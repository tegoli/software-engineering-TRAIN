/**
 * @class TrainStatus
 * @brief Represents live tracking info for a running train.
 * @details Stores the scheduled and estimated times for departures and arrivals, plus any delay. Used to show passengers where the train is and if it is late.
 */
export class TrainStatus {
    /** * @brief The time the train was meant to leave according to the official schedule.
     * @type {Date} 
     */ 
    scheduledDeparture;

    /** * @brief The updated departure time based on current conditions.
     * @type {Date} 
     */ 
    estimatedDeparture;

    /** * @brief The time the train was meant to arrive according to the schedule.
     * @type {Date} 
     */ 
    scheduledArrival;

    /** * @brief The updated arrival time based on current conditions.
     * @type {Date} 
     */ 
    estimatedArrival;

    /** * @brief How late the train is, in minutes.
     * @type {number} 
     */ 
    delayMinutes;

    /**
     * @brief Builds a timeline object for showing the train's progress in the UI.
     * @details Takes the current location and delay and packages them into something a front-end component can display to the user.
     * @param {Object|string} location - Current location of the train.
     * @param {number} delay - Current delay in minutes.
     * @return {Object} Object with timeline data and current location.
     */
    displayVisualTimeline(location, delay) {
        // Build UI representation
        return { timeline: [], currentLocation: location };
    }
}
