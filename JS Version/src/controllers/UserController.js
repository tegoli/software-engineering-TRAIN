import { readDB, writeDB, createNotification, hashPassword } from '../database/db.js';

export const UserController = {
    getMe(req, res) {
        const db = readDB();
        const user = db.users.find(u => u.userId === req.user.userId);
        res.json({ id: user.userId, name: user.name, role: user.role });
    },

    getDashboard(req, res) {
        const targetId = parseInt(req.params.userId);
        if (req.user.userId !== targetId && req.user.role !== 'administrator') {
            return res.status(403).json({ error: 'Accesso negato' });
        }
        const db = readDB();
        const user = db.users.find(u => u.userId === targetId);
        if (!user) return res.status(404).json({ error: 'Utente non trovato' });
        const tickets = db.tickets.filter(t => t.userId === targetId);
        // Sottoscrizioni attive dell'utente
const subscriptions = db.subscriptions.filter(s => s.userId === targetId && s.status === 'active').map(s => {
    const route = db.routes.find(r => r.routeId === s.routeId);
    const fromStation = db.stations.find(st => st.stationId === route?.stops[0].stationId);
    const toStation = db.stations.find(st => st.stationId === route?.stops[route.stops.length-1].stationId);
    const startDate = new Date(s.startDate);
    const endDate = new Date(s.endDate);
    const today = new Date();
    const remainingDays = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
    return {
        subscriptionId: s.subscriptionId,
        routeName: route?.routeName || 'Sconosciuta',
        from: fromStation?.name || '?',
        to: toStation?.name || '?',
        startDate: s.startDate,
        endDate: s.endDate,
        remainingDays,
        class: s.class,
        qrCode: s.qrCode,
        price: s.price,
        status: s.status
    };
});


        const activeTickets = tickets.filter(t => t.status === 'active').map(t => {
            const run = db.trainRuns.find(r => r.runId === t.runId);
            if (!run) return { ticketId: t.ticketId, from: '?', to: '?', departureTime: '---', price: t.price, seatNumber: t.seatNumber };
            const route = db.routes.find(r => r.routeId === run.routeId);
            const fromStop = route?.stops.find(s => s.stopOrder === t.fromStopOrder);
            const toStop = route?.stops.find(s => s.stopOrder === t.toStopOrder);
            const fromStation = db.stations.find(s => s.stationId === fromStop?.stationId);
            const toStation = db.stations.find(s => s.stationId === toStop?.stationId);
            return {
                ticketId: t.ticketId,
                from: fromStation?.name || 'Sconosciuta',
                to: toStation?.name || 'Sconosciuta',
                departureTime: fromStop?.scheduledDeparture || '---',
                price: t.price,
                seatNumber: t.seatNumber
            };
        });

        const history = tickets.filter(t => t.status !== 'active').map(t => {
            const run = db.trainRuns.find(r => r.runId === t.runId);
            if (!run) return { ticketId: t.ticketId, from: '?', to: '?', date: t.purchaseDate, price: t.price, status: t.status };
            const route = db.routes.find(r => r.routeId === run.routeId);
            const fromStop = route?.stops.find(s => s.stopOrder === t.fromStopOrder);
            const toStop = route?.stops.find(s => s.stopOrder === t.toStopOrder);
            const fromStation = db.stations.find(s => s.stationId === fromStop?.stationId);
            const toStation = db.stations.find(s => s.stationId === toStop?.stationId);
            return {
                ticketId: t.ticketId,
                from: fromStation?.name || 'Sconosciuta',
                to: toStation?.name || 'Sconosciuta',
                date: t.purchaseDate,
                price: t.price,
                status: t.status
            };
        });

        
        res.json({
            name: user.name,
            loyaltyPoints: user.loyaltyPoints,
            activeTickets,
            history,
            subscriptions   // ← nuova proprietà
        });
    },

    getPoints(req, res) {
        const db = readDB();
        const user = db.users.find(u => u.userId === req.user.userId);
        if (!user) return res.status(404).json({ error: 'Utente non trovato' });
        res.json({ points: user.loyaltyPoints || 0 });
    },

    modifyTicket(req, res) {
        const { ticketId, newDate, newTime } = req.body;
        const db = readDB();
        const ticket = db.tickets.find(t => t.ticketId === ticketId);
        if (!ticket) return res.status(404).json({ success: false, message: 'Biglietto non trovato' });
        if (ticket.userId !== req.user.userId && req.user.role !== 'administrator')
            return res.status(403).json({ success: false, message: 'Non autorizzato' });
        const run = db.trainRuns.find(r => r.runId === ticket.runId);
        if (!run) return res.status(404).json({ success: false, message: 'Corsa non trovata' });
        const originalDeparture = new Date(run.departureDateTime);
        const now = new Date();
        const hoursDiff = (originalDeparture - now) / (1000 * 3600);
        if (hoursDiff <= 0) return res.status(400).json({ success: false, message: 'Treno già partito' });
        if (hoursDiff > 24) {
            if (!newDate) return res.status(400).json({ success: false, message: 'Nuova data richiesta' });
            const newRun = db.trainRuns.find(r => r.routeId === run.routeId && r.departureDateTime.startsWith(newDate));
            if (!newRun) return res.status(404).json({ success: false, message: 'Nessuna corsa nella nuova data' });
            ticket.runId = newRun.runId;
        } else if (hoursDiff <= 24 && hoursDiff > 0) {
            if (!newTime) return res.status(400).json({ success: false, message: 'Nuovo orario richiesto' });
            const [hour, minute] = newTime.split(':');
            const newDepDateTime = new Date(run.departureDateTime);
            newDepDateTime.setHours(parseInt(hour), parseInt(minute), 0);
            if (newDepDateTime < now) return res.status(400).json({ success: false, message: 'Nuovo orario già passato' });
            run.departureDateTime = newDepDateTime.toISOString();
        } else {
            return res.status(400).json({ success: false, message: 'Modifica non consentita' });
        }
        const user = db.users.find(u => u.userId === ticket.userId);
        createNotification(ticket.userId, `Biglietto #${ticketId} modificato con successo. Nuovi dettagli: ${newTime}${newDate ? ' data '+newDate : ''}`, 'info');
        writeDB(db);
        res.json({ success: true, message: `Email di conferma inviata a ${user.email}` });
    },

    changePassword(req, res) {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.userId;
        const db = readDB();
        const user = db.users.find(u => u.userId === userId);
        if (!user || user.passwordHash !== hashPassword(oldPassword))
            return res.status(401).json({ success: false, message: 'Password attuale errata' });
        if (newPassword.length < 8)
            return res.status(400).json({ success: false, message: 'Minimo 8 caratteri' });
        user.passwordHash = hashPassword(newPassword);
        createNotification(userId, 'Password modificata con successo.', 'security');
        writeDB(db);
        res.json({ success: true, message: `Email di conferma inviata a ${user.email}` });
    },

    logout(req, res) {
        const auth = req.headers.authorization;
        if (auth && auth.startsWith('Bearer ')) {
            const token = auth.slice(7);
            // La sessione è gestita da AuthController, ma possiamo invalidare qui
            // Per semplicità lasciamo che scada naturalmente; il client cancellerà il token.
        }
        res.json({ success: true });
    },

    deleteAccount(req, res) {
        const userId = req.user.userId;
        const db = readDB();
        const user = db.users.find(u => u.userId === userId);
        if (!user) return res.status(404).json({ success: false, message: 'Utente non trovato' });
        const activeTickets = db.tickets.some(t => t.userId === userId && t.status === 'active');
        if (activeTickets) {
            return res.status(400).json({ success: false, message: 'Non puoi eliminare l\'account con biglietti attivi.' });
        }
        db.users = db.users.filter(u => u.userId !== userId);
        db.tickets.filter(t => t.userId === userId).forEach(t => t.userId = null);
        writeDB(db);
        res.json({ success: true, message: 'Account eliminato.' });
    }
};