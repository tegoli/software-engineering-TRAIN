/**
 * @file Manages ticket modifications (FR 16).
 */
import { readDB, writeDB } from '../database/db.js';

export const TicketManagementController = {
    async getTicketForModify(ticketId) {
        const db = readDB();
        const ticket = db.tickets.find(t => t.ticketId === ticketId);
        if (!ticket) throw new Error('Ticket not found');
        return ticket;
    },

    async updateTicket(newDetails) {
        const db = readDB();
        const index = db.tickets.findIndex(t => t.ticketId === newDetails.ticketId);
        if (index === -1) throw new Error('Ticket not found');
        db.tickets[index] = { ...db.tickets[index], ...newDetails };
        writeDB(db);
        return { success: true };
    }
};