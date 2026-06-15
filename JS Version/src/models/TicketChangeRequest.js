/**
 * @file TicketChangeRequest.js
 * @brief Stores info needed to change a ticket after booking.
 * @details Keeps the new date and time, and decides if
 * the user can do a full change or just time-only.
 */
export class TicketChangeRequest {
    /** * @brief The new date the user wants to travel.
     * @type {Date} 
     */ 
    newDate;

    /** * @brief The new time the user wants to leave.
     * @type {string} 
     */ 
    newTime;

    /** * @brief Either 'full' or 'time-only' depending on rules.
     * @type {string} 
     */ 
    changeType; // 'full' or 'time-only'

    /**
     * @brief Checks if the ticket is too close to departure for full changes.
     * @details Works out how many hours are left before the train leaves.
     * If it's more than 24 hours, you can do a full change.
     * Otherwise, only time changes are allowed.
     * @param {Date} departureTime - When the train was supposed to leave.
     * @return {string} 'full' if over 24 hours, else 'time-only'.
     */
    validateAgainstThreshold(departureTime) {
        const hoursLeft = (departureTime - new Date()) / (1000 * 3600);
        return hoursLeft > 24 ? 'full' : 'time-only';
    }
}
