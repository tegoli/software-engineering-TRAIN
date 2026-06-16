/**
 * @file StatisticsFilter.js
 * @brief Filters what data shows up in reports and charts.
 * @details Lets you pick a date, train line, and type of data to narrow down the results.
 */
export class StatisticsFilter {
    /** @brief The date to look at for the report.
     * @type {Date} 
     */ 
    date;

    /** @brief Which train line to get statistics for.
     * @type {string} 
     */ 
    trainLine;

    /** @brief What kind of data to show (e.g., 'revenue', 'bookings', 'delays').
     * @type {string} 
     */ 
    type; // 'revenue', 'bookings', 'delays'
}
