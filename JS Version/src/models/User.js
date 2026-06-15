/**
 * @file User.js
 * @brief Base class with basic info and methods for all users.
 * @details Defines the common fields (name, email, etc.) that
 * Passenger, Conductor, and Admin all inherit.
 */
export class User {
    /** * @brief Unique database ID for this user.
     * @type {number} 
     */ 
    userId;

    /** * @brief The user's first name.
     * @type {string} 
     */ 
    name;

    /** * @brief The user's last name.
     * @type {string} 
     */ 
    surname;

    /** * @brief Email address used for login and notifications.
     * @type {string} 
     */ 
    email;

    /** * @brief Language code like 'it' or 'en'.
     * @type {string} 
     */ 
    preferredLanguage; // 'it', 'en', etc.

    /**
     * @brief Changes the user's preferred language.
     * @details Updates the language setting which affects dates,
     * templates, and notification messages.
     * @param {string} lang - Two-letter language code.
     * @return {void}
     */
    changeLanguage(lang) {
        this.preferredLanguage = lang;
        // In real app, also trigger UI update.
    }
}
