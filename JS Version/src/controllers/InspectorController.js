import { readDB, writeDB } from '../database/db.js';

/**
 * @const InspectorController
 * @brief Handles ticket validation and shift schedules for inspectors.
 * @details Validates tickets and subscriptions, marks tickets as used,
 * and returns the inspector's work schedule for the day.
 */
export const InspectorController = {
    /**
     * @brief Validates a ticket or subscription by its ID.
     * @details Tries to find the document among tickets first, then subscriptions.
     * Marks tickets as used, but subscriptions stay active until their end date.
     * @param {Object} req - Express request with ticketId in the body.
     * @param {Object} res - Express response object.
     * @return {Object|void} JSON with valid flag and a message.
     */
    validateTicket(req, res) {
        const { ticketId } = req.body;
        const db = readDB();
        
        // Prima cerca tra i biglietti
        let ticket = db.tickets.find(t => t.ticketId === ticketId);
        let isSubscription = false;
        let subscription = null;
        
        if (!ticket) {
            // Se non è un biglietto, cerca tra gli abbonamenti
            subscription = db.subscriptions.find(s => s.subscriptionId === ticketId);
            if (subscription) {
                isSubscription = true;
                ticket = subscription; // per uniformità
            }
        }
        
        if (!ticket) {
            return res.json({ valid: false, message: 'Documento non trovato' });
        }
        
        // Se è un abbonamento, controlla la validità temporale
        if (isSubscription) {
            const today = new Date();
            const endDate = new Date(subscription.endDate);
            const startDate = new Date(subscription.startDate);
            if (subscription.status !== 'active' || today > endDate || today < startDate) {
                return res.json({ valid: false, message: 'Abbonamento non valido o scaduto' });
            }
            // Abbonamento valido: non si "usa" come un biglietto, rimane attivo.
            // Opzionale: puoi registrare un log di validazione.
            return res.json({ valid: true, message: 'Abbonamento valido', type: 'subscription' });
        }
        
        // Biglietto normale
        if (ticket.status !== 'active') {
            return res.json({ valid: false, message: 'Biglietto già utilizzato o scaduto' });
        }
        
        // Marca come usato
        ticket.status = 'used';
        const seatRes = db.seatReservations.find(sr => sr.ticketId === ticketId);
        if (seatRes) seatRes.status = 'occupied';
        writeDB(db);
        res.json({ valid: true, message: 'Biglietto valido e marcato come utilizzato', type: 'ticket' });
    },

    /**
     * @brief Returns the shift schedule for an inspector.
     * @details Checks that the requester is the inspector themselves or an admin.
     * Enriches shifts with train and route info.
     * @param {Object} req - Express request with inspectorId as a route parameter.
     * @param {Object} res - Express response object.
     * @return {Object|void} 403 if not authorized, otherwise the list of shifts.
     */
    getSchedule(req, res) {
        const inspectorId = parseInt(req.params.inspectorId);
        // Verifica che l'utente autenticato sia l'ispettore stesso o un admin
        if (req.user.userId !== inspectorId && req.user.role !== 'administrator') {
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
    }
};