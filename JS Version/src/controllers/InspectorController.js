import { readDB, writeDB } from '../database/db.js';

/**
 * @const InspectorController
 * @brief Controller object handling ticket inspections and shift schedules for ticket inspectors.
 * @details Validates traditional travel tickets and multi-use subscriptions, tracking expiration ranges 
 * and updating in-memory status maps. Provides secure access interfaces to view personalized staff schedules.
 */
export const InspectorController = {
    /**
     * @brief Validates a provided verification entry token against known travel credentials.
     * @details Searches across ticket arrays and down into subscriptions if unmatched. Checks structural 
     * properties like date intervals, active indicators, and state tags. If a normal ticket is identified 
     * as active, updates its lifecycle profile state to 'used' and locks corresponding seat rows.
     * @param {Object} req - Express request object containing `ticketId` inside the body payload.
     * @param {Object} res - Express response object returning validation status matrices and textual updates.
     * @return {Object|void} Sends a JSON status response confirming validity attributes.
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
     * @brief Retrieves and builds detailed work assignment structures for an authorized staff inspector.
     * @details Evaluates session descriptors to verify that the requesting user matches the targeted staff ID 
     * or holds administrator access permissions. Searches schedule records and links train runs, 
     * route information, and rolling stock parameters.
     * @param {Object} req - Express request object containing `inspectorId` parameters and custom identity contexts.
     * @param {Object} res - Express response object handling access denials or structured shift itineraries.
     * @return {Object|void} Sends a 403 authorization error on mismatch, or a list of enriched shift itineraries.
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