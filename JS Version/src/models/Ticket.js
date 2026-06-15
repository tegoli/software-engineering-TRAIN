import { TravelDocument } from './TravelDocument.js';
import { TicketManagementController } from '../controllers/TicketManagementController.js';

/**
 * @class Ticket
 * @extends TravelDocument
 * @brief Domain entity model representing an explicit single-use or multi-segment journey entitlement asset.
 * @details Extends the core TravelDocument framework by embedding concrete tracking logistics like departure/arrival 
 * timestamps, specialized passenger demographics, and internal rule checking logic to evaluate modification windows.
 */
export class Ticket extends TravelDocument {
    /** * @brief Unique database record primary key mapping this discrete ticket entity to the ticketing database ledger.
     * @type {number} 
     */ 
    ticketId;

    /** * @brief Scheduled target date and time when the designated train run leaves the origin station node.
     * @type {Date} 
     */ 
    departureTime;

    /** * @brief Scheduled target date and time when the designated train run arrives at the terminating station node.
     * @type {Date} 
     */ 
    arrivalTime;

    /** * @brief Demographic classification token applied to enforce explicit fare structures (e.g., 'adult', 'child').
     * @type {string} 
     */ 
    passengerType; // 'adult', 'child'

    /**
     * @brief Computes the absolute millisecond duration remaining prior to the scheduled departure window.
     * @param {Date} currentTime - The active reference system timestamp used for temporal comparison math.
     * @return {number} Delta duration measured in milliseconds.
     */
    calculateTimeRemaining(currentTime) {
        return this.departureTime - currentTime;
    }

    /**
     * @brief Enforces structural tariff rules to assess whether the booking qualifies for comprehensive modifications.
     * @details Checks if the chronological window remaining until departure exceeds the strict 24-hour business policy boundary.
     * @return {boolean} True if the calculated time buffer allows a complete itinerary or structural overhaul.
     */
    allowFullModification() {
        const hoursLeft = this.calculateTimeRemaining(new Date()) / (1000 * 3600);
        return hoursLeft > 24;
    }

    /**
     * @brief Evaluates whether change parameters must be locked down exclusively to same-day schedule shifts.
     * @details Analyzes if the departure deadline falls inside the critical 24-hour pre-flight buffer zone while remaining in the future.
     * @return {boolean} True if structural shifts are locked, restricting the passenger solely to timeline re-scheduling.
     */
    restrictToTimeOnly() {
        const hoursLeft = this.calculateTimeRemaining(new Date()) / (1000 * 3600);
        return hoursLeft <= 24 && hoursLeft > 0;
    }

    /**
     * @brief Dispatches updated tracking logistics or route changes to the system clearinghouse ledger.
     * @details Handshakes asynchronously with the TicketManagementController to overwrite underlying data properties across the registry.
     * @param {Object} newDetails - Structured payload object containing the newly targeted travel parameters.
     * @return {Promise<Object>} Asynchronous resolve handler carrying processing status confirmations from the database.
     */
    async updateTicket(newDetails) {
        return TicketManagementController.updateTicket(this.ticketId, newDetails);
    }
}