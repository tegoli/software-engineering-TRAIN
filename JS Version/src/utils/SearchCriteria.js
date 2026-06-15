/**
 * @class SearchCriteria
 * @brief Filters for searching train schedules.
 * @details Contains departure, arrival, date, time, train type, class and passenger count.
 */
export class SearchCriteria {
    /**
     * @brief Creates a new SearchCriteria.
     * @param {string} departureStationName - The departure station.
     * @param {string} arrivalStationName - The arrival station.
     * @param {string} date - The date of travel.
     * @param {string} time - The departure time.
     * @param {string} trainType - The train type (e.g. 'high_speed', 'regional').
     * @param {string} travelClass - The travel class ('standard', 'business').
     * @param {number} passengerCount - Number of passengers.
     */
    constructor(departureStationName, arrivalStationName, date, time, trainType, travelClass, passengerCount) {
        /** @type {string} */ this.departureStationName = departureStationName;
        /** @type {string} */ this.arrivalStationName = arrivalStationName;
        /** @type {string} */ this.date = date;
        /** @type {string} */ this.time = time;
        /** @type {string} */ this.trainType = trainType;
        /** @type {string} */ this.travelClass = travelClass;
        /** @type {number} */ this.passengerCount = passengerCount;
    }

    /**
     * @brief Validates the search criteria.
     * @return {boolean} Always returns true.
     */
    validate() { return true; }
}
