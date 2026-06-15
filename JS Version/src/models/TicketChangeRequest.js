/**
 * @file TicketChangeRequest.js
 * @brief Domain entity capturing parameters and business logic constraints for modifying an issued transit booking.
 * @details Models data structures for processing date and time changes, evaluating request timestamps against 
 * fare rule boundaries to determine eligible modification types.
 */
export class TicketChangeRequest {
    /** * @brief The target calendar day requested for the rescheduled journey sequence.
     * @type {Date} 
     */ 
    newDate;

    /** * @brief The updated operational departure time window target requested for the itinerary.
     * @type {string} 
     */ 
    newTime;

    /** * @brief Resolved structural classification code dictating the allowable modification tier (e.g., 'full' or 'time-only').
     * @type {string} 
     */ 
    changeType; // 'full' or 'time-only'

    /**
     * @brief Evaluates the remaining chronological window before departure to enforce modification rate rules.
     * @details Calculates the real-time delta between current system execution times and the target route departure window. 
     * Applies a strict 24-hour business rule threshold to filter whether the ticket is eligible for structural parameters shifts 
     * or restricted strictly to timeline adjustments.
     * @param {Date} departureTime - The original scheduled departure timestamp of the active booking asset.
     * @return {string} Operational modifier code ('full' if window > 24 hours, otherwise fallback 'time-only').
     */
    validateAgainstThreshold(departureTime) {
        const hoursLeft = (departureTime - new Date()) / (1000 * 3600);
        return hoursLeft > 24 ? 'full' : 'time-only';
    }
}