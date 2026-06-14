/**
 * @file Manages UI language switching.
 */
export const LanguageController = {
    changeLanguage(lang) {
        // update global state
        return lang;
    },

    async savePreference(userId, lang) {
        const { readDB, writeDB } = await import('../database/db.js');
        const db = readDB();
        const user = db.users.find(u => u.userId === userId);
        if (user) user.preferredLanguage = lang;
        writeDB(db);
        return true;
    }
};