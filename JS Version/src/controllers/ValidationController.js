import { readDB, writeDB } from '../database/db.js';

/**
 * @const ValidationController
 * @brief Controller object tasked with real-time digital ticket processing and physical transit verification.
 * @details Manages live ticket operational state checks, updates usage records to prevent reuse, and synchronization loops
 * that modify associated seat inventory distributions on active routes.
 */
export const ValidationController = {
    /**
     * @brief Evaluates an incoming reservation token signature to verify dynamic travel permissions.
     * @details Searches the centralized ticket register for matching identifiers. Confirms the pass is currently active, 
     * switches its lifecycle status to prevent duplicate boarding fraud, and transitionally locks the assigned cabin seat 
     * reservation to occupied status.
     * @param {Object} req - Express request holding payload data parameters including `ticketId`.
     * @param {Object} res - Express response target delivering the confirmation status report object.
     * @return {Object} Returns a structural JSON verification report detailing validation flags or error descriptions.
     */
    validateTicket(req, res) {
        const { ticketId } = req.body;
        const db = readDB();
        const ticket = db.tickets.find(t => t.ticketId === ticketId);
        if (!ticket) return res.json({ valid: false, message: 'Ticket not found' });
        if (ticket.status !== 'active') return res.json({ valid: false, message: 'Ticket already used or expired' });
        ticket.status = 'used';
        const seatRes = db.seatReservations.find(sr => sr.ticketId === ticketId);
        if (seatRes) seatRes.status = 'occupied';
        writeDB(db);
        res.json({ valid: true, message: 'Ticket validated successfully' });
    }
};