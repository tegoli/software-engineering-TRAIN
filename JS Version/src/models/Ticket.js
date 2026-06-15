import { TravelDocument } from './TravelDocument.js';
import { TicketManagementController } from '../controllers/TicketManagementController.js';

/**
 * @class Ticket
 * @extends TravelDocument
 * @brief Represents a single ticket for a train journey.
 * @details Extends TravelDocument with departure and arrival
 * times, passenger type, and methods to check
 * if changes are still allowed.
 */
export class Ticket extends TravelDocument {
    /** * @brief Unique database ID for this ticket.
     * @type {number} 
     */ 
    ticketId;

    /** * @brief When the train leaves the station.
     * @type {Date} 
     */ 
    departureTime;

    /** * @brief When the train gets to the destination.
     * @type {Date} 
     */ 
    arrivalTime;

    /** * @brief Passenger type like 'adult' or 'child'.
     * @type {string} 
     */ 
    passengerType; // 'adult', 'child'

    /**
     * @brief Works out how much time is left before departure.
     * @param {Date} currentTime - The current time to compare against.
     * @return {number} Time left in milliseconds.
     */
    calculateTimeRemaining(currentTime) {
        return this.departureTime - currentTime;
    }

    /**
     * @brief Checks if there is enough time for a full ticket change.
     * @details Returns true if there are more than 24 hours
     * before the train leaves.
     * @return {boolean} True if a full change is allowed.
     */
    allowFullModification() {
        const hoursLeft = this.calculateTimeRemaining(new Date()) / (1000 * 3600);
        return hoursLeft > 24;
    }

    /**
     * @brief Checks if only a time change is possible.
     * @details Returns true if there are less than 24 hours
     * left but the train hasn't left yet.
     * @return {boolean} True if only time can be changed.
     */
    restrictToTimeOnly() {
        const hoursLeft = this.calculateTimeRemaining(new Date()) / (1000 * 3600);
        return hoursLeft <= 24 && hoursLeft > 0;
    }

    /**
     * @brief Sends updated ticket info to the server.
     * @details Calls TicketManagementController to save
     * the new travel details in the database.
     * @param {Object} newDetails - The new travel details to save.
     * @return {Promise<Object>} Response confirming the update.
     */
    async updateTicket(newDetails) {
        return TicketManagementController.updateTicket(this.ticketId, newDetails);
    }
}
