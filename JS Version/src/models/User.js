/**
 * @file Abstract base class for all users.
 */
export class User {
    /** @type {number} */ userId;
    /** @type {string} */ name;
    /** @type {string} */ surname;
    /** @type {string} */ email;
    /** @type {string} */ preferredLanguage; // 'it', 'en', etc.

    /**
     * Changes the interface language.
     * @param {string} lang - Language code.
     */
    changeLanguage(lang) {
        this.preferredLanguage = lang;
        // In real app, also trigger UI update.
    }
}