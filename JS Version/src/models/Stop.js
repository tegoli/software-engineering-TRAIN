/**
 * @file Stop.js
 * @brief Represents one station stop along a train's route.
 * @details Stores the order of the stop, station ID, scheduled and estimated times, and the track number.
 */
export class Stop {
    /** @brief Where this stop falls in the train's route order.
     * @type {number} 
     */ 
    stopOrder;

    /** @brief The database ID for the station where this stop is.
     * @type {number} 
     */ 
    stationId;

    /** @brief The official arrival time from the timetable.
     * @type {string} 
     */ 
    scheduledArrival;   // HH:MM

    /** @brief The official departure time from the timetable.
     * @type {string} 
     */ 
    scheduledDeparture; // HH:MM

    /** @brief The updated arrival time based on current conditions.
     * @type {string} 
     */ 
    estimatedArrival;

    /** @brief The updated departure time based on current conditions.
     * @type {string} 
     */ 
    estimatedDeparture;

    /** @brief Which platform or track the train stops at.
     * @type {string} 
     */ 
    trackNumber;
}
