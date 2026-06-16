/**
 * @class ApplicationInterface
 * @brief Manages UI interactions like displaying dashboards, errors and confirmations.
 * @details Simple interface class for showing dashboard data, filtered results,
 * error messages, confirmation dialogs and updating the UI language.
 */
export class ApplicationInterface {
    /**
     * @brief Shows the dashboard with stats.
     * @param {Object} stats - The statistics data to display.
     * @return {void}
     */
    displayDashboard(stats) { console.log('Dashboard mostrata', stats); }
    
    /**
     * @brief Shows filtered data.
     * @param {Array<Object>|Object} data - The data to display.
     * @param {Object} filters - The filters that were applied.
     * @return {void}
     */
    displayData(data, filters) { console.log('Dati filtrati', data); }
    
    /**
     * @brief Shows an error message.
     * @param {string} message - The error message to show.
     * @return {void}
     */
    showError(message) { console.error(message); }
    
    /**
     * @brief Shows a confirmation dialog.
     * @param {string} message - The confirmation text.
     * @return {boolean} True if the user confirmed, false otherwise.
     */
    showConfirmation(message) { return confirm(message); } // solo browser
    
    /**
     * @brief Updates the UI to use a new language.
     * @param {string} lang - The language code ('it', 'en', 'de').
     * @return {void}
     */
    updatedUI(lang) { console.log(`UI aggiornata a ${lang}`); }
}