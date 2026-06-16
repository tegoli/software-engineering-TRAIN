/**
 * @file StatisticsReport.js
 * @brief Stores a report with stats like revenue or passenger numbers.
 * @details Holds the report data and lets you filter it or format it for display.
 */
export class StatisticsReport {
    /** * @brief Unique ID for this report.
     * @type {number} 
     */ 
    reportId;

    /** * @brief What kind of report this is.
     * @type {string} 
     */ 
    reportType;

    /** * @brief When the report was generated.
     * @type {Date} 
     */ 
    generationDate;

    /** * @brief The actual report data.
     * @type {Object} 
     */ 
    data;

    /**
     * @brief Filters the report data based on given rules.
     * @details Narrows down the data using filters like date range or station.
     * @param {Object} filters - Filters to apply to the data.
     * @return {void}
     */
    applyFilters(filters) {
        // filter internal data
    }

    /**
     * @brief Formats the report data so it can be shown in the UI.
     * @details Converts the data into a format that front-end charts and exports can use.
     * @return {Object|Array} Formatted data for the UI.
     */
    displayData() {
        // return formatted data
    }
}
