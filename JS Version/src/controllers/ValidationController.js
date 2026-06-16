import { readDB, writeDB } from '../database/db.js';

/**
 * @const ValidationController
 * @brief Handles ticket validation for inspectors.
 * @details Looks up a ticket by ID, checks if it is active, marks it as used,
 * and updates the seat reservation to occupied.
 */
export const ValidationController = {
    /**
     * @brief Validates a ticket by its ID.
     * @details Searches for the ticket, checks that it is active, marks it as used,
     * and updates the corresponding seat to occupied.
     * @param {Object} req - Express request with ticketId in the body.
     * @param {Object} res - Express response object.
     * @return {Object} JSON with valid flag and a message.
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