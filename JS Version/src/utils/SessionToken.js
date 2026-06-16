/**
 * @class SessionToken
 * @brief Represents an active user session.
 * @details Stores a token value and expiration time.
 */
export class SessionToken {
    /**
     * @brief Creates a new SessionToken.
     * @param {string} tokenValue - The session token string.
     * @param {Date|number} expirationTime - When the session expires.
     */
    constructor(tokenValue, expirationTime) {
        /** @type {string} */ this.tokenValue = tokenValue;
        /** @type {Date|number} */ this.expirationTime = expirationTime;
    }

    /**
     * @brief Checks if the session has expired.
     * @param {Date|number} currentTime - The current time.
     * @return {boolean} True if expired.
     */
    isExpired(currentTime) {
        return currentTime > this.expirationTime;
    }
}
