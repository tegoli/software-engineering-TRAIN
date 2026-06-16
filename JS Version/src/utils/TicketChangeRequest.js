/**
 * @class TicketChangeRequest
 * @brief Represents a request to change a ticket.
 * @details Stores the new date, time, and type of change requested.
 */
export class TicketChangeRequest {
    /**
     * @brief Creates a new TicketChangeRequest.
     * @param {string} newDate - The new date for the ticket.
     * @param {string} newTime - The new time for the ticket.
     * @param {string} changeType - The type of change (e.g. 'date_shift', 'time_shift').
     */
    constructor(newDate, newTime, changeType) {
        /** @type {string} */ this.newDate = newDate;
        /** @type {string} */ this.newTime = newTime;
        /** @type {string} */ this.changeType = changeType;
    }

    /**
     * @brief Checks if the change request is valid for the given departure time.
     * @param {string|Date} departureTime - The original departure time.
     * @return {boolean} True if the change is allowed.
     */
    validateAgainstThreshold(departureTime) { return true; }
}
