import { TravelDocument } from './TravelDocument.js';
import { TicketManagementController } from '../controllers/TicketManagementController.js';

export class Ticket extends TravelDocument {
    /** @type {number} */ ticketId;
    /** @type {Date} */ departureTime;
    /** @type {Date} */ arrivalTime;
    /** @type {string} */ passengerType; // 'adult', 'child'

    calculateTimeRemaining(currentTime) {
        return this.departureTime - currentTime;
    }

    allowFullModification() {
        const hoursLeft = this.calculateTimeRemaining(new Date()) / (1000 * 3600);
        return hoursLeft > 24;
    }

    restrictToTimeOnly() {
        const hoursLeft = this.calculateTimeRemaining(new Date()) / (1000 * 3600);
        return hoursLeft <= 24 && hoursLeft > 0;
    }

    async updateTicket(newDetails) {
        return TicketManagementController.updateTicket(this.ticketId, newDetails);
    }
}