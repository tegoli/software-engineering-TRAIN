import { RegisteredUser } from './RegisteredUser.js';
import { StatisticsController } from '../controllers/StatisticsController.js';

/**
 * @class RailwayAdministrator
 * @extends RegisteredUser
 * @brief An admin user with extra powers over the system.
 * @details Has special access to view statistics and manage the railway. Can filter data and see raw reports.
 */
export class RailwayAdministrator extends RegisteredUser {
    /** * @brief Unique code that identifies this admin.
     * @type {string} 
     */ 
    adminCode;

    /**
     * @brief Checks if the current user can access the admin panel.
     * @details Makes sure the user has the right permissions before showing admin stuff.
     * @return {boolean} True if the user is allowed in.
     */
    requestAdminArea() {
        return true;
    }

    /**
     * @brief Gets raw data directly from the database.
     * @details Calls the stats controller to pull unprocessed data about how things are running.
     * @return {Object} Big object full of raw system data.
     */
    loadStatistics() {
        return StatisticsController.getRawStatistics();
    }

    /**
     * @brief Filters statistics by date and train line.
     * @details Lets the admin narrow down data to specific dates and routes.
     * @param {Date|string} date - Date to filter by.
     * @param {string} trainLine - Train line to look at.
     * @return {Array<Object>} Filtered list of records matching the filters.
     */
    applyFilters(date, trainLine) {
        return StatisticsController.filterStatistics(date, trainLine);
    }

    /**
     * @brief Gets cleaned-up statistics ready for display.
     * @details Pulls formatted stats from the controller so the admin can see them on a dashboard.
     * @return {Object} Organized data ready to show on screen.
     */
    viewStatistics() {
        return StatisticsController.getFormattedStatistics();
    }
}
