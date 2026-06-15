/**
 * @class StatisticsFilter
 * @brief Utility configuration entity that structures search parameters for administrative business intelligence logs.
 * @details Encapsulates granular metric-gathering scopes, allowing system queries to be filtered down to individual 
 * calendar periods, localized track line indicators, and operational calculation types (such as capacity or revenues).
 */
export class StatisticsFilter {
    /**
     * @brief Instantiates a statistics filtering criterion data block.
     * @param {string|Date} date - The analytical reference timestamp or specific calendar date parameter.
     * @param {string} trainLine - The alphanumeric identifier tag matching a specific physical transit corridor route.
     * @param {string} type - The targeted data calculation classification category (e.g., 'delay_ratio', 'crowding_averages').
     */
    constructor(date, trainLine, type) {
        /** @type {string|Date} */ this.date = date;
        /** @type {string} */ this.trainLine = trainLine;
        /** @type {string} */ this.type = type;
    }
}