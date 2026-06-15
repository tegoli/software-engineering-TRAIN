/**
 * @file User.js
 * @brief Abstract base class defining fundamental attributes and common behaviors for all system identities.
 * @details Establishes core demographic schema fields and global localization functions inherited 
 * by all participant roles across the transport management platform, such as Passengers, Conductors, and Administrators.
 */
export class User {
    /** * @brief Unique database primary key assigned to the identity record.
     * @type {number} 
     */ 
    userId;

    /** * @brief Legal given name of the individual.
     * @type {string} 
     */ 
    name;

    /** * @brief Legal family name of the individual.
     * @type {string} 
     */ 
    surname;

    /** * @brief Primary electronic mail address used for authentication routing and operational receipts.
     * @type {string} 
     */ 
    email;

    /** * @brief ISO language code specifying the user's localized content rendering selection (e.g., 'it', 'en').
     * @type {string} 
     */ 
    preferredLanguage; // 'it', 'en', etc.

    /**
     * @brief Persists a new internationalization (i18n) localization preference code for the current context.
     * @details Updates internal localization preferences to guide structural template rendering, 
     * matching localized date-time values, and selecting system communication notification translations.
     * @param {string} lang - Two-letter ISO language configuration code (e.g., 'it', 'en').
     * @return {void}
     */
    changeLanguage(lang) {
        this.preferredLanguage = lang;
        // In real app, also trigger UI update.
    }
}