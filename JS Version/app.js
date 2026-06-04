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

// ============================================================================
//  DATABASE HELPERS
// ============================================================================

/**
 * Percorso del file JSON che funge da database.
 * @constant {string}
 */
const DB_PATH = path.join(__dirname, 'database', 'database.json');

/**
 * Legge il database dal file JSON.
 * @returns {object} Contenuto del database.
 */
function readDB() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

/**
 * Scrive il database sul file JSON.
 * @param {object} data - Dati da salvare.
 */
function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ============================================================================
//  SESSION MANAGEMENT
// ============================================================================

/** Mappa token di sessione → { userId, role } */
const sessions = new Map();

/**
 * Genera un token di sessione casuale.
 * @returns {string} Token esadecimale a 64 caratteri.
 */
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Middleware di autenticazione: verifica il token Bearer.
 * @param {object} req - Richiesta Express.
 * @param {object} res - Risposta Express.
 * @param {Function} next - Chiamata successiva.
 */
function authenticate(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: missing token' });
    }
    const token = auth.slice(7);
    const session = sessions.get(token);
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }
    req.user = session;
    next();
}

/**
 * Middleware per richiedere un ruolo specifico.
 * @param {string} role - Ruolo richiesto (admin, inspector, passenger).
 * @returns {Function} Middleware Express.
 */
function requireRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: `Forbidden: ${role} role required` });
        }
        next();
    };
}

// ============================================================================
//  UTILITY FUNCTIONS
// ============================================================================

/**
 * Calcola l'hash SHA256 di una password.
 * @param {string} pwd - Password in chiaro.
 * @returns {string} Hash esadecimale.
 */
function hashPassword(pwd) {
    return crypto.createHash('sha256').update(pwd).digest('hex');
}

/**
 * Calcola il prezzo di un biglietto in base alla distanza geografica approssimativa.
 * @param {object} fromStation - Stazione di partenza (con latitude, longitude).
 * @param {object} toStation - Stazione di arrivo.
 * @param {string} travelClass - 'standard' o 'business'.
 * @returns {number} Prezzo in euro (arrotondato a 2 decimali).
 */
function calculatePrice(fromStation, toStation, travelClass) {
    const R = 6371; // raggio Terra in km
    const dLat = (toStation.latitude - fromStation.latitude) * Math.PI / 180;
    const dLon = (toStation.longitude - fromStation.longitude) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(fromStation.latitude * Math.PI / 180) *
              Math.cos(toStation.latitude * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const km = R * c;
    let price = km * 0.15;
    if (travelClass === 'business') price *= 1.8;
    return Math.round(price * 100) / 100;
}

/**
 * Inizializza il database con utenti di default se non esistono.
 * Utenti creati:
 * - admin@railway.it / admin (ruolo administrator)
 * - test@example.com / password (ruolo passenger)
 */
function seedDefaultUsers() {
    const db = readDB();
    let changed = false;

    const adminExists = db.users.some(u => u.email === 'admin@railway.it');
    if (!adminExists) {
        const newId = Math.max(...db.users.map(u => u.userId)) + 1;
        db.users.push({
            userId: newId,
            name: 'Admin',
            surname: 'Railway',
            email: 'admin@railway.it',
            passwordHash: hashPassword('admin'),
            role: 'administrator',
            preferredLanguage: 'en',
            loyaltyPoints: 0,
            failedLoginAttempts: 0,
            accountStatus: 'active',
            adminCode: 'ADMIN-001'
        });
        changed = true;
        console.log('✅ Utente admin creato (admin@railway.it / admin)');
    }

    const testExists = db.users.some(u => u.email === 'test@example.com');
    if (!testExists) {
        const newId = Math.max(...db.users.map(u => u.userId)) + 1;
        db.users.push({
            userId: newId,
            name: 'Test',
            surname: 'User',
            email: 'test@example.com',
            passwordHash: hashPassword('password'),
            role: 'passenger',
            preferredLanguage: 'it',
            loyaltyPoints: 50,
            failedLoginAttempts: 0,
            accountStatus: 'active'
        });
        changed = true;
        console.log('✅ Utente test creato (test@example.com / password)');
    }

    if (changed) writeDB(db);
}

// Esegui il seeding all'avvio
try {
    seedDefaultUsers();
} catch (err) {
    console.error('Errore durante il seeding:', err);
}

// ============================================================================
//  API PUBLICHE (non richiedono autenticazione)
// ============================================================================

/**
 * GET /api/stations
 * Restituisce l'elenco di tutte le stazioni.
 */
app.get('/api/stations', (req, res) => {
    const db = readDB();
    res.json(db.stations);
});

/**
 * POST /api/login
 * Autentica un utente e restituisce un token di sessione.
 * Body: { email, password }
 */
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.email === email);

    if (!user || user.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ success: false, message: 'Credenziali errate' });
    }
    if (user.accountStatus !== 'active') {
        return res.status(401).json({ success: false, message: 'Account non attivo' });
    }

    const token = generateToken();
    sessions.set(token, { userId: user.userId, role: user.role });
    res.json({
        success: true,
        token,
        user: { id: user.userId, name: user.name, role: user.role }
    });
});

/**
 * POST /api/register
 * Registra un nuovo utente (ruolo passenger).
 * Body: { name, surname, email, password }
 */
app.post('/api/register', (req, res) => {
    const { name, surname, email, password } = req.body;
    const db = readDB();

    if (db.users.find(u => u.email === email)) {
        return res.json({ success: false, message: 'Email già registrata' });
    }
    if (!password || password.length < 8) {
        return res.json({ success: false, message: 'La password deve essere lunga almeno 8 caratteri' });
    }

    const newId = Math.max(...db.users.map(u => u.userId)) + 1;
    const newUser = {
        userId: newId,
        name,
        surname,
        email,
        passwordHash: hashPassword(password),
        role: 'passenger',
        preferredLanguage: 'it',
        loyaltyPoints: 0,
        failedLoginAttempts: 0,
        accountStatus: 'active'
    };
    db.users.push(newUser);
    writeDB(db);
    res.json({ success: true, message: 'Registrazione completata' });
});

/**
 * POST /api/search
 * Cerca treni in base a partenza, arrivo, data e classe.
 * Body: { departureStationName, arrivalStationName, date, travelClass }
 */
app.post('/api/search', (req, res) => {
    const { departureStationName, arrivalStationName, date, travelClass } = req.body;
    const db = readDB();

    const fromStation = db.stations.find(s => s.name.toLowerCase() === departureStationName.toLowerCase());
    const toStation = db.stations.find(s => s.name.toLowerCase() === arrivalStationName.toLowerCase());

    if (!fromStation || !toStation) {
        return res.json({ trains: [] }); // stazione non esistente
    }

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

        // Orari di partenza e arrivo dalla fermata specifica
        const departureDateTime = new Date(runDate);
        const [depHour, depMin] = fromStop.scheduledDeparture.split(':');
        departureDateTime.setHours(parseInt(depHour), parseInt(depMin), 0);

        const arrivalDateTime = new Date(runDate);
        const [arrHour, arrMin] = toStop.scheduledArrival.split(':');
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
            duration: `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`,
            price,
            trainType: train.trainType,
            trainCode: train.trainCode,
            travelClass
        });
    }
    res.json({ trains: results });
});

// ============================================================================
//  API PROTETTE (richiedono autenticazione)
// ============================================================================

/**
 * GET /api/me
 * Restituisce i dati dell'utente autenticato.
 */
app.get('/api/me', authenticate, (req, res) => {
    const db = readDB();
    const user = db.users.find(u => u.userId === req.user.userId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    res.json({ id: user.userId, name: user.name, role: user.role });
});

/**
 * GET /api/user/dashboard/:userId
 * Restituisce dashboard del passeggero (biglietti attivi, storico, punti fedeltà).
 * Solo l'utente stesso o un amministratore può accedere.
 */
app.get('/api/user/dashboard/:userId', authenticate, (req, res) => {
    const targetUserId = parseInt(req.params.userId);
    if (req.user.userId !== targetUserId && req.user.role !== 'administrator') {
        return res.status(403).json({ error: 'Accesso negato' });
    }

    const db = readDB();
    const user = db.users.find(u => u.userId === targetUserId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    const tickets = db.tickets.filter(t => t.userId === targetUserId);
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

/**
 * POST /api/purchase
 * Acquista un biglietto per l'utente autenticato.
 * Body: { runId, fromStopOrder, toStopOrder, passengerType, travelClass, seatNumber, extras, totalPrice }
 */
app.post('/api/purchase', authenticate, (req, res) => {
    const userId = req.user.userId;
    const { runId, fromStopOrder, toStopOrder, passengerType, travelClass, seatNumber, extras, totalPrice } = req.body;
    const db = readDB();

    const user = db.users.find(u => u.userId === userId);
    if (!user) return res.status(400).json({ success: false, message: 'Utente non valido' });

    // Crea nuovo biglietto
    const newTicketId = Math.max(...db.tickets.map(t => t.ticketId)) + 1;
    const now = new Date().toISOString();
    const newTicket = {
        ticketId: newTicketId,
        ticketCode: `TKT-${userId}-${newTicketId}`,
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
        coachNumber: 1, // Semplificato; in realtà andrebbe calcolato
        seatNumber,
        ticketId: newTicketId,
        status: 'reserved'
    });

    // Servizi extra (bagaglio, bici, ...)
    if (extras && extras.length) {
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

/**
 * POST /api/validate
 * Valida un biglietto (solo ispettori).
 * Body: { ticketId }
 */
app.post('/api/validate', authenticate, requireRole('inspector'), (req, res) => {
    const { ticketId } = req.body;
    const db = readDB();
    const ticket = db.tickets.find(t => t.ticketId === ticketId);

    if (!ticket) {
        return res.json({ valid: false, message: 'Biglietto non trovato' });
    }
    if (ticket.status !== 'active') {
        return res.json({ valid: false, message: 'Biglietto già utilizzato o scaduto' });
    }

    ticket.status = 'used';
    const seatRes = db.seatReservations.find(sr => sr.ticketId === ticketId);
    if (seatRes) seatRes.status = 'occupied';

    writeDB(db);
    res.json({ valid: true, message: 'Biglietto valido e marcato come utilizzato' });
});

/**
 * GET /api/inspector/schedule/:inspectorId
 * Restituisce i turni di un ispettore (solo l'ispettore stesso).
 */
app.get('/api/inspector/schedule/:inspectorId', authenticate, requireRole('inspector'), (req, res) => {
    const inspectorId = parseInt(req.params.inspectorId);
    if (req.user.userId !== inspectorId) {
        return res.status(403).json({ error: 'Accesso negato' });
    }
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

/**
 * GET /api/admin/stats
 * Restituisce statistiche di sistema (solo amministratori).
 */
app.get('/api/admin/stats', authenticate, requireRole('administrator'), (req, res) => {
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

/**
 * POST /api/support
 * Invia una richiesta di supporto (utente autenticato).
 * Body: { requestType, ticketRef, description }
 */
app.post('/api/support', authenticate, (req, res) => {
    const { requestType, ticketRef, description } = req.body;
    const db = readDB();
    const newId = Math.max(...db.supportRequests.map(r => r.requestId)) + 1;
    db.supportRequests.push({
        requestId: newId,
        userId: req.user.userId,
        requestType,
        description,
        status: 'open',
        creationDate: new Date().toISOString(),
        resolution: null
    });
    writeDB(db);
    res.json({ success: true, message: 'Richiesta inviata' });
});

// ============================================================================
//  AVVIO DEL SERVER
// ============================================================================

app.listen(PORT, () => {
    console.log(`🚆 Server running on http://localhost:${PORT}`);
    console.log(`📁 Database: ${DB_PATH}`);
    console.log(`🔐 Admin: admin@railway.it / admin`);
    console.log(`👤 Test user: test@example.com / password`);
});