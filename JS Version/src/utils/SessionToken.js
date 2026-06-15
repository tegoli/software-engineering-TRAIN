/**
 * @class SessionToken
 * @brief Cryptographic state tracking model representing an active user authentication session lifecycle.
 * @details Encapsulates the core signature payload string alongside an explicit expiration timestamp,
 * providing the baseline validation checks necessary to safely verify session security limits.
 */
export class SessionToken {
    /**
     * @brief Instantiates a secure session validation tracking token entity.
     * @param {string} tokenValue - The literal alphanumeric security payload string sent by authenticating clients.
     * @param {Date|number} expirationTime - The chronological threshold limit indicating when authorization records expire.
     */
    constructor(tokenValue, expirationTime) {
        /** @type {string} */ this.tokenValue = tokenValue;
        /** @type {Date|number} */ this.expirationTime = expirationTime;
    }

    /**
     * @brief Assesses whether the current validation window has exceeded its authorization time limits.
     * @details Compares a current runtime timestamp property against the internal token expiration limit 
     * to determine if access permissions must be programmatically dropped.
     * @param {Date|number} currentTime - The present time parameters used to evaluate token validity.
     * @return {boolean} True if the reference time is greater than the defined expiration threshold.
     */
    isExpired(currentTime) {
        return currentTime > this.expirationTime;
    }
}