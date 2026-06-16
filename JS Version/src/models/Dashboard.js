/**
 * @file Dashboard.js
 * @brief Holds stats and info shown on an admin's main screen.
 * @details Groups together things like revenue numbers, delay counts, and other business data for display.
 */
export class Dashboard {
    /** @brief Unique ID for this dashboard instance.
     * @type {number} 
     */ 
    dashboardId;

    /** @brief The name or heading shown at the top of the dashboard.
     * @type {string} 
     */ 
    title;

    /** @brief Contains all the numbers and data shown on the dashboard.
     * @type {object} 
     */ 
    statistics;
}
