/**
 * @file Manages UI language switching.
 */

/**
 * @const LanguageController
 * @brief Handles language switching for the UI.
 * @details Updates language preferences both in the frontend and in the database for logged-in users.
 */
export const LanguageController = {
    /**
     * @brief Changes the current language.
     * @param {string} lang - The language code ('it', 'en', 'de').
     * @return {string} The language code that was set.
     */
    changeLanguage(lang) {
        // update global state
        return lang;
    },

    /**
     * @brief Saves the language preference for a user in the database.
     * @param {number|string} userId - The ID of the user.
     * @param {string} lang - The language code to save.
     * @return {Promise<boolean>} True when the save is complete.
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