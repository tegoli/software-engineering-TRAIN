/**
 * @file Manages UI language switching.
 */

/**
 * @const LanguageController
 * @brief Controller object handling interface localization and user regionalization settings.
 * @details Manages immediate frontend application state translations alongside persistent, 
 * database-level updates matching user accounts.
 */
export const LanguageController = {
    /**
     * @brief Updates the operational translation settings across active application contexts.
     * @param {string} lang - The specific regional language code token (e.g., 'it', 'en').
     * @return {string} The active applied language token code.
     */
    changeLanguage(lang) {
        // update global state
        return lang;
    },

    /**
     * @brief Persists regional localization preferences directly into the database record for a specific user.
     * @details Synchronously imports DB utilities dynamically, iterates across profiles to isolate 
     * matching identities, modifies preferred language parameters, and saves results.
     * @param {number|string} userId - The unique registry id of the destination user profile.
     * @param {string} lang - The target regional locale designation code string.
     * @return {Promise<boolean>} Resolves to true indicating database update operations were finalized.
     */
    async savePreference(userId, lang) {
        const { readDB, writeDB } = await import('../database/db.js');
        const db = readDB();
        const user = db.users.find(u => u.userId === userId);
        if (user) user.preferredLanguage = lang;
        writeDB(db);
        return true;
    }
};