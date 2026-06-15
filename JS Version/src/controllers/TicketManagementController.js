/**
 * @file Manages ticket modifications (FR 16).
 */
import { readDB, writeDB } from '../database/db.js';

/**
 * @const TicketManagementController
 * @brief Controller object handling mid-lifecycle ticket alterations and changes.
 * @details Implements functional requirements (FR 16) allowing customers or administrators 
 * to fetch and modify reservation records before a journey.
 */
export const TicketManagementController = {
    /**
     * @brief Locates and returns an explicit ticket record for editing workflows.
     * @details Scans the absolute ticket collection array matching the unique ticket ID. 
     * Throws an exception if no record matches.
     * @param {number|string} ticketId - The unique identifier of the target ticket.
     * @throws {Error} Throws an exception if the ticket does not exist within the system.
     * @return {Promise<Object>} Resolves to the matching raw ticket data record.
     */
    async getTicketForModify(ticketId) {
        const db = readDB();
        const ticket = db.tickets.find(t => t.ticketId === ticketId);
        if (!ticket) throw new Error('Ticket not found');
        return ticket;
    },

    /**
     * @brief Overwrites an existing ticket record parameters with modernized properties.
     * @details Finds the internal collection offset index for the targeted ticket asset, 
     * applies shallow object composition overrides to update metadata, and flushes results to database disk storage.
     * @param {Object} newDetails - The configuration tracking block containing the target `ticketId` and modifications.
     * @throws {Error} Throws an exception if the specified target ticket index cannot be resolved.
     * @return {Promise<Object>} Resolves to a standard operation success receipt object.
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