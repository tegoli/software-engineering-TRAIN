/**
 * @class UserDatabase
 * @brief Handles user data in the database.
 * @details Manages creating accounts, updating passwords, deleting users,
 * and saving language preferences.
 */
export class UserDatabase {
    /**
     * @brief Creates a new user account.
     * @param {Object} userData - The user's name, email, password etc.
     * @return {void}
     */
    createAccount(userData) { console.log('Creazione utente', userData); }
    
    /**
     * @brief Updates a user's password.
     * @param {number|string} userId - The ID of the user.
     * @param {string} newPass - The new password.
     * @return {void}
     */
    updateCredentials(userId, newPass) { }
    
    /**
     * @brief Deletes a user from the database.
     * @param {number|string} userId - The ID of the user to delete.
     * @return {void}
     */
    hardDelete(userId) { }
    
    /**
     * @brief Saves the language preference for a user.
     * @param {number|string} userId - The ID of the user.
     * @param {string} lang - The language code ('it', 'en', 'de').
     * @return {void}
     */
    savePreference(userId, lang) { }
    
    /**
     * @brief Gets data from the database by type.
     * @param {string} type - The type of data to retrieve.
     * @return {void}
     */
    retrieveData(type) { }
    
    /**
     * @brief Prepares the available filters for queries.
     * @return {void}
     */
    requestFilters() { }
    
    /**
     * @brief Applies filters to the data.
     * @param {Object} filters - The filters to apply.
     * @return {void}
     */
    applyFilters(filters) { }
    
    /**
     * @brief Checks if there is no data available.
     * @return {boolean} True if the dataset is empty.
     */
    noData() { return false; }
    
    /**
     * @brief Shows an error message.
     * @return {void}
     */
    showErrorMessage() { console.log('Errore DB utenti'); }
}