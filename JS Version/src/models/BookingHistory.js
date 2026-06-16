/**
 * @file BookingHistory.js
 * @brief Keeps track of past bookings a user has made.
 * @details Stores old reservations and can figure out which stations the user visits the most.
 */
export class BookingHistory {
    /** * @brief Unique ID for this history record.
     * @type {number} 
     */ 
    historyId;

    /** * @brief List of all past booking objects.
     * @type {Array<Object>} 
     */ 
    pastBookings;

    /**
     * @brief Finds the stations the user goes to most often.
     * @details Goes through past bookings and counts how many times each station shows up.
     * @return {Array<string>} Station names sorted by how popular they are.
     */
    getPopularStations() {
        // return frequently used stations
    }
}
