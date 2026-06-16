/**
 * @file Manages ticket modifications.
 */
import { readDB, writeDB } from '../database/db.js';

/**
 * @const TicketManagementController
 * @brief Handles ticket updates and lookups.
 * @details Provides methods to find a ticket by ID and update its details.
 */
export const TicketManagementController = {
    /**
     * @brief Finds a ticket by its ID.
     * @param {number|string} ticketId - The ID of the ticket.
     * @throws {Error} If the ticket is not found.
     * @return {Promise<Object>} The ticket object.
     */
    async getTicketForModify(ticketId) {
        const db = readDB();
        const ticket = db.tickets.find(t => t.ticketId === ticketId);
        if (!ticket) throw new Error('Ticket not found');
        return ticket;
    },

    /**
     * @brief Updates a ticket with new data.
     * @details Finds the ticket by ID and merges the new details into it.
     * @param {Object} newDetails - An object with the ticketId and fields to update.
     * @throws {Error} If the ticket is not found.
     * @return {Promise<Object>} Success confirmation.
     */
    async updateTicket(newDetails) {
        const db = readDB();
        const index = db.tickets.findIndex(t => t.ticketId === newDetails.ticketId);
        if (index === -1) throw new Error('Ticket not found');
        db.tickets[index] = { ...db.tickets[index], ...newDetails };
        writeDB(db);
        return { success: true };
    }
};