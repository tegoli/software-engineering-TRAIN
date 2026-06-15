import { RegisteredUser } from './RegisteredUser.js';
import { StatisticsController } from '../controllers/StatisticsController.js';

/**
 * @class RailwayAdministrator
 * @extends RegisteredUser
 * @brief Domain actor model representing an enterprise system administrator with executive privileges.
 * @details Extends corporate employee definitions by exposing privileged administrative console routing hooks, 
 * raw telemetry extraction routines, and analytical multi-variable filtering wrappers to audit system performance metrics.
 */
export class RailwayAdministrator extends RegisteredUser {
    /** * @brief Unique corporate workforce identifier tracking administrator clearance parameters.
     * @type {string} 
     */ 
    adminCode;

    /**
     * @brief Assesses active session signature scopes to verify high-level clearance parameters before rendering control environments.
     * @details Acts as a high-level guard check to unlock specialized administrative actions and infrastructure panels.
     * @return {boolean} True if the current administrative identity context satisfies necessary security rules.
     */
    requestAdminArea() {
        return true;
    }

    /**
     * @brief Extracts raw transaction logs and infrastructure performance matrices directly from storage engines.
     * @details Calls down into the StatisticsController to fetch deep unaggregated business metadata snapshots.
     * @return {Object} Large collection containing unparsed, raw data points spanning infrastructure operations.
     */
    loadStatistics() {
        return StatisticsController.getRawStatistics();
    }

    /**
     * @brief Constraints large operational matrices using temporal and regional tracking parameters.
     * @details Submits refinement filters to target specific line segments and calendar dates, returning narrowed datasets for analysis.
     * @param {Date|string} date - Chronological filter limit applied to slice database event timestamps.
     * @param {string} trainLine - Target transit corridor layout identifier used to slice geographical log records.
     * @return {Array<Object>} Subset collection of analytical records conforming to the specified parameters.
     */
    applyFilters(date, trainLine) {
        return StatisticsController.filterStatistics(date, trainLine);
    }

    /**
     * @brief Pulls parsed, ready-to-render view models optimized for visual presentation interfaces.
     * @details Queries the core reporting controller to fetch aggregated and transformed performance metrics tailored for administration dashboards.
     * @return {Object} Organized visualization data schemas structured for immediate injection into UI components.
     */
    viewStatistics() {
        return StatisticsController.getFormattedStatistics();
    }
}