/**
 * @class StatisticsFilter
 * @brief Filters for querying statistics.
 * @details Contains a date, train line, and type filter.
 */
export class StatisticsFilter {
    /**
     * @brief Creates a new StatisticsFilter.
     * @param {string|Date} date - The date to filter by.
     * @param {string} trainLine - The train line to filter by.
     * @param {string} type - The type of statistics (e.g. 'delay_ratio', 'crowding_averages').
     */
    constructor(date, trainLine, type) {
        /** @type {string|Date} */ this.date = date;
        /** @type {string} */ this.trainLine = trainLine;
        /** @type {string} */ this.type = type;
    }
}
