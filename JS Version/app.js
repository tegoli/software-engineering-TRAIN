import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// -------------------- Helper per leggere/scrivere DB --------------------
const DB_PATH = path.join(__dirname, 'database', 'database.json');

function readDB() {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// -------------------- Utility --------------------
function hashPassword(pwd) {
    return crypto.createHash('sha256').update(pwd).digest('hex');
}

// Calcolo prezzo approssimativo (km * 0.15 €) - per demo
function calculatePrice(stationA, stationB, travelClass) {
    const coordA = { lat: stationA.latitude, lon: stationA.longitude };
    const coordB = { lat: stationB.latitude, lon: stationB.longitude };
    const R = 6371;
    const dLat = (coordB.lat - coordA.lat) * Math.PI / 180;
    const dLon = (coordB.lon - coordA.lon) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(coordA.lat * Math.PI/180) * Math.cos(coordB.lat * Math.PI/180) * Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const km = R * c;
    let price = km * 0.15;
    if (travelClass === 'business') price *= 1.8;
    return Math.round(price * 100) / 100;
}

// -------------------- API ROUTES --------------------

// 1. Ottieni tutte le stazioni (per mappa e select)
app.get('/api/stations', (req, res) => {
    const db = readDB();
    res.json(db.stations);
});

// 2. Ricerca treni
app.post('/api/search', (req, res) => {
    const { departureStationName, arrivalStationName, date, travelClass } = req.body;
    const db = readDB();

    const fromStation = db.stations.find(s => s.name.toLowerCase() === departureStationName.toLowerCase());
    const toStation = db.stations.find(s => s.name.toLowerCase() === arrivalStationName.toLowerCase());
    if (!fromStation || !toStation) return res.json({ trains: [] });

    const searchDate = new Date(date);
    const results = [];

    for (const run of db.trainRuns) {
        const route = db.routes.find(r => r.routeId === run.routeId);
        if (!route) continue;

        const fromStop = route.stops.find(stop => stop.stationId === fromStation.stationId);
        const toStop = route.stops.find(stop => stop.stationId === toStation.stationId);
        if (!fromStop || !toStop || fromStop.stopOrder >= toStop.stopOrder) continue;

        const runDate = new Date(run.departureDateTime);
        if (runDate.toDateString() !== searchDate.toDateString()) continue;
        if (run.status === 'cancelled') continue;

        const train = db.trains.find(t => t.trainId === run.trainId);
        if (!train.serviceClasses.includes(travelClass)) continue;

        // Calcola orario di partenza dalla fermata di origine
        const departureTimeStr = fromStop.scheduledDeparture;
        const [depHour, depMin] = departureTimeStr.split(':');
        const departureDateTime = new Date(runDate);
        departureDateTime.setHours(parseInt(depHour), parseInt(depMin), 0);

        const arrivalTimeStr = toStop.scheduledArrival;
        const [arrHour, arrMin] = arrivalTimeStr.split(':');
        const arrivalDateTime = new Date(runDate);
        arrivalDateTime.setHours(parseInt(arrHour), parseInt(arrMin), 0);
        if (arrivalDateTime < departureDateTime) arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);

        const durationMs = arrivalDateTime - departureDateTime;
        const durationMinutes = Math.round(durationMs / 60000);

        const price = calculatePrice(fromStation, toStation, travelClass);

        results.push({
            id: run.runId,
            from: fromStation.name,
            to: toStation.name,
            departureTime: departureDateTime.toISOString(),
            arrivalTime: arrivalDateTime.toISOString(),
            duration: `${Math.floor(durationMinutes/60)}h ${durationMinutes%60}m`,
            price: price,
            trainType: train.trainType,
            trainCode: train.trainCode,
            travelClass: travelClass
        });
    }
    res.json({ trains: results });
});

// 3. Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.email === email);
    if (!user || user.passwordHash !== hashPassword(password)) {
        return res.json({ success: false, message: 'Credenziali errate' });
    }
    if (user.accountStatus !== 'active') {
        return res.json({ success: false, message: 'Account non attivo' });
    }
    res.json({ success: true, user: { id: user.userId, name: user.name, role: user.role } });
});

// 4. Registrazione
app.post('/api/register', (req, res) => {
    const { name, surname, email, password } = req.body;
    const db = readDB();
    if (db.users.find(u => u.email === email)) {
        return res.json({ success: false, message: 'Email già registrata' });
    }
    const newId = Math.max(...db.users.map(u => u.userId)) + 1;
    const newUser = {
        userId: newId,
        name, surname, email,
        passwordHash: hashPassword(password),
        role: 'passenger',
        preferredLanguage: 'it',
        loyaltyPoints: 0,
        failedLoginAttempts: 0,
        accountStatus: 'active'
    };
    db.users.push(newUser);
    writeDB(db);
    res.json({ success: true });
});

// 5. Dashboard utente (biglietti attivi, storico, punti)
app.get('/api/user/dashboard/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const db = readDB();
    const user = db.users.find(u => u.userId === userId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    const tickets = db.tickets.filter(t => t.userId === userId);
    const activeTickets = tickets.filter(t => t.status === 'active');
    const history = tickets.filter(t => t.status !== 'active').map(t => {
        const run = db.trainRuns.find(r => r.runId === t.runId);
        const route = db.routes.find(r => r.routeId === run?.routeId);
        const fromStop = route?.stops.find(s => s.stopOrder === t.fromStopOrder);
        const toStop = route?.stops.find(s => s.stopOrder === t.toStopOrder);
        const fromStation = db.stations.find(s => s.stationId === fromStop?.stationId);
        const toStation = db.stations.find(s => s.stationId === toStop?.stationId);
        return {
            ticketId: t.ticketId,
            from: fromStation?.name,
            to: toStation?.name,
            date: t.purchaseDate,
            price: t.price,
            status: t.status
        };
    });

    res.json({
        name: user.name,
        loyaltyPoints: user.loyaltyPoints,
        activeTickets: activeTickets.map(t => {
            const run = db.trainRuns.find(r => r.runId === t.runId);
            const route = db.routes.find(r => r.routeId === run?.routeId);
            const fromStop = route?.stops.find(s => s.stopOrder === t.fromStopOrder);
            const toStop = route?.stops.find(s => s.stopOrder === t.toStopOrder);
            const fromStation = db.stations.find(s => s.stationId === fromStop?.stationId);
            const toStation = db.stations.find(s => s.stationId === toStop?.stationId);
            return {
                ticketId: t.ticketId,
                from: fromStation?.name,
                to: toStation?.name,
                departureTime: fromStop?.scheduledDeparture,
                price: t.price,
                seatNumber: t.seatNumber
            };
        }),
        history
    });
});

// 6. Acquisto biglietto
app.post('/api/purchase', (req, res) => {
    const { userId, runId, fromStopOrder, toStopOrder, passengerType, travelClass, seatNumber, extras, totalPrice } = req.body;
    const db = readDB();

    const user = db.users.find(u => u.userId === userId);
    if (!user) return res.status(400).json({ success: false, message: 'Utente non valido' });

    const newTicketId = Math.max(...db.tickets.map(t => t.ticketId)) + 1;
    const ticketCode = `TKT-${userId}-${newTicketId}`;
    const now = new Date().toISOString();

    const newTicket = {
        ticketId: newTicketId,
        ticketCode,
        userId,
        runId,
        fromStopOrder,
        toStopOrder,
        passengerType,
        seatNumber,
        class: travelClass,
        price: totalPrice,
        status: 'active',
        purchaseDate: now,
        qrCode: `QR${newTicketId}${Math.random().toString(36).substring(2, 8)}`
    };
    db.tickets.push(newTicket);

    // Aggiorna punti fedeltà (1 punto per euro)
    const pointsEarned = Math.floor(totalPrice);
    user.loyaltyPoints += pointsEarned;

    // Registra transazione punti
    const newLoyaltyId = Math.max(...db.loyaltyTransactions.map(l => l.transactionId)) + 1;
    db.loyaltyTransactions.push({
        transactionId: newLoyaltyId,
        userId,
        points: pointsEarned,
        reason: `Acquisto biglietto #${newTicketId}`,
        date: now
    });

    // Registra pagamento
    const newPaymentId = Math.max(...db.payments.map(p => p.paymentId)) + 1;
    db.payments.push({
        paymentId: newPaymentId,
        userId,
        ticketId: newTicketId,
        subscriptionId: null,
        amount: totalPrice,
        paymentDate: now,
        paymentMethod: 'Credit Card',
        transactionId: `TXN${newPaymentId}`,
        status: 'completed'
    });

    // Prenotazione posto
    db.seatReservations.push({
        runId,
        coachNumber: 1, // Semplificato
        seatNumber,
        ticketId: newTicketId,
        status: 'reserved'
    });

    // Servizi extra
    if (extras) {
        for (const extra of extras) {
            const newResId = Math.max(...db.additionalReservations.map(r => r.reservationId)) + 1;
            db.additionalReservations.push({
                reservationId: newResId,
                ticketId: newTicketId,
                type: extra.type,
                status: 'confirmed',
                price: extra.price
            });
        }
    }

    writeDB(db);
    res.json({ success: true, ticketId: newTicketId });
});

// 7. Validazione biglietto (inspector)
app.post('/api/validate', (req, res) => {
    const { ticketId } = req.body;
    const db = readDB();
    const ticket = db.tickets.find(t => t.ticketId === ticketId);
    if (!ticket) return res.json({ valid: false, message: 'Biglietto non trovato' });
    if (ticket.status !== 'active') return res.json({ valid: false, message: 'Biglietto già utilizzato o scaduto' });

    ticket.status = 'used';
    // Aggiorna stato posto
    const seatRes = db.seatReservations.find(sr => sr.ticketId === ticketId);
    if (seatRes) seatRes.status = 'occupied';

    writeDB(db);
    res.json({ valid: true, message: 'Biglietto valido e marcato come utilizzato' });
});

// 8. Turni ispettore
app.get('/api/inspector/schedule/:inspectorId', (req, res) => {
    const inspectorId = parseInt(req.params.inspectorId);
    const db = readDB();
    const shifts = db.shiftSchedules.filter(s => s.staffId === inspectorId);
    const enriched = shifts.map(s => {
        const run = db.trainRuns.find(r => r.runId === s.trainRunId);
        const route = db.routes.find(r => r.routeId === run?.routeId);
        const train = db.trains.find(t => t.trainId === run?.trainId);
        return {
            date: s.date,
            startTime: s.startTime,
            endTime: s.endTime,
            route: s.assignedRoute,
            trainCode: train?.trainCode,
            trainType: train?.trainType
        };
    });
    res.json({ shifts: enriched });
});

// 9. Statistiche admin
app.get('/api/admin/stats', (req, res) => {
    const db = readDB();
    const totalRevenue = db.payments.reduce((sum, p) => sum + p.amount, 0);
    const totalBookings = db.tickets.length;
    const delayedRuns = db.trainRuns.filter(r => r.status === 'delayed').length;
    const activeUsers = db.users.filter(u => u.accountStatus === 'active' && u.role === 'passenger').length;
    res.json({
        revenue: totalRevenue,
        bookings: totalBookings,
        delayedTrains: delayedRuns,
        activeUsers
    });
});

// 10. Supporto
app.post('/api/support', (req, res) => {
    const { userId, requestType, ticketRef, description } = req.body;
    const db = readDB();
    const newId = Math.max(...db.supportRequests.map(r => r.requestId)) + 1;
    db.supportRequests.push({
        requestId: newId,
        userId,
        requestType,
        description,
        status: 'open',
        creationDate: new Date().toISOString(),
        resolution: null
    });
    writeDB(db);
    res.json({ success: true, message: 'Richiesta inviata' });
});

// 11. Mappa: stazioni con coordinate (già esiste /api/stations)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});