/**
 * @file SessionToken.js
 * @brief Keeps track of a user's login session with a token and expiry time.
 * @details Stores the token string and when it expires so the system knows if the user is still logged in.
 */
export class SessionToken {
    /** @brief The actual token string sent with API requests.
     * @type {string} 
     */ 
    tokenValue;

    /** @brief When this token stops being valid.
     * @type {Date} 
     */ 
    expirationTime;

    /**
     * @brief Makes a new session token with a value and expiry.
     * @param {string} tokenValue - The token string for the session.
     * @param {Date} expirationTime - When the token should expire.
     */
    constructor(tokenValue, expirationTime) {
        this.tokenValue = tokenValue;
        this.expirationTime = expirationTime;
    }

    /**
     * @brief Checks if the token has expired yet.
     * @details Compares the given time to the expiration time.
     * @param {Date} currentTime - The current time to check against.
     * @return {boolean} True if the current time is past the expiry.
     */
    isExpired(currentTime) {
        return currentTime > this.expirationTime;
    }
}
