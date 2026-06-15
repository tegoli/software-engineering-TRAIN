/**
 * @file SearchCriteria.js
 * @brief Configuration data transfer object enclosing user-specified query boundaries for itinerary lookups.
 * @details Packages search coordinates, chronological limits, and rolling stock preferences required to 
 * query transit databases, providing structural logic validations before dispatching requests to routing engines.
 */
export class SearchCriteria {
    /** * @brief Name or title designation matching the physical starting terminal node of the journey.
     * @type {string} 
     */ 
    departureStationName;

    /** * @brief Name or title designation matching the physical ending terminal node of the journey.
     * @type {string} 
     */ 
    arrivalStationName;

    /** * @brief Target calendar date requested for the route lookup sequence.
     * @type {Date} 
     */ 
    date;

    /** * @brief Preferred baseline daily timestamp marker limiting the initial search window.
     * @type {string} 
     */ 
    time;

    /** * @brief Velocity or branding tier preference filtering the transit vehicle profile (e.g., 'Frecciarossa', 'Regionale').
     * @type {string} 
     */ 
    trainType;

    /** * @brief Desired cabin tier structure option utilized to filter accommodating rolling stock configurations.
     * @type {string} 
     */ 
    travelClass;

    /** * @brief Quantity index capturing total passenger count allocations to scope available inventory targets.
     * @type {number} 
     */ 
    passengerCount;

    /**
     * @brief Executes foundational integrity checks on the internal criteria parameters.
     * @details Verifies that origin and destination station targets do not match, and applies temporal calculations 
     * to confirm that the requested calendar date falls on or after the start of the current day.
     * @return {boolean} True if the structured query criteria parameters satisfy core operational boundaries.
     */
    validate() {
        return this.departureStationName !== this.arrivalStationName &&
               this.date >= new Date().setHours(0,0,0,0);
    }
}