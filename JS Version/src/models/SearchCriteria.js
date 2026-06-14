/**
 * @file Criteria for searching trains.
 */
export class SearchCriteria {
    /** @type {string} */ departureStationName;
    /** @type {string} */ arrivalStationName;
    /** @type {Date} */ date;
    /** @type {string} */ time;
    /** @type {string} */ trainType;
    /** @type {string} */ travelClass;
    /** @type {number} */ passengerCount;

    validate() {
        return this.departureStationName !== this.arrivalStationName &&
               this.date >= new Date().setHours(0,0,0,0);
    }
}