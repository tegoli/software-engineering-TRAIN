/**
 * @file SearchCriteria.js
 * @brief Stores what the user searched for when looking up train trips.
 * @details Holds departure and arrival stations, date, time, train type, class, and number of passengers.
 */
export class SearchCriteria {
    /** @brief The station the user wants to leave from.
     * @type {string} 
     */ 
    departureStationName;

    /** @brief The station the user wants to arrive at.
     * @type {string} 
     */ 
    arrivalStationName;

    /** @brief What day the user wants to travel.
     * @type {Date} 
     */ 
    date;

    /** @brief What time the user wants to leave.
     * @type {string} 
     */ 
    time;

    /** @brief The type of train the user wants (e.g., 'Frecciarossa', 'Regionale').
     * @type {string} 
     */ 
    trainType;

    /** @brief What class of travel the user wants.
     * @type {string} 
     */ 
    travelClass;

    /** @brief How many people are traveling.
     * @type {number} 
     */ 
    passengerCount;

    /**
     * @brief Checks if the search details make sense before sending.
     * @details Makes sure the departure and arrival stations are different and the date isn't in the past.
     * @return {boolean} True if the search is valid, false otherwise.
     */
    validate() {
        return this.departureStationName !== this.arrivalStationName &&
               this.date >= new Date().setHours(0,0,0,0);
    }
}
