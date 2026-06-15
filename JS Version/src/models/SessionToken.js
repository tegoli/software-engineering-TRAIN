/**
 * @file SessionToken.js
 * @brief Domain entity capturing the cryptographic lifecycle state of an authenticated user session context.
 * @details Models short-lived validation keys, housing signature character vectors alongside security 
 * duration bounds to guard remote API gateway access channels from unauthorized requests.
 */
export class SessionToken {
    /** * @brief The active cryptographic string token payload submitted alongside HTTP request headers.
     * @type {string} 
     */ 
    tokenValue;

    /** * @brief Exact calendar timestamp marking when this security clearance token passes its validation threshold.
     * @type {Date} 
     */ 
    expirationTime;

    /**
     * @brief Instantiates a structured token verification tracker instance.
     * @param {string} tokenValue - Cryptographic signature hash tracking current session authorization.
     * @param {Date} expirationTime - Target lifecycle terminal timestamp bound.
     */
    constructor(tokenValue, expirationTime) {
        this.tokenValue = tokenValue;
        this.expirationTime = expirationTime;
    }

    /**
     * @brief Assesses if the session window has crossed past its maximum allowed lifecycle boundary.
     * @details Compares a target comparison timestamp against internal expiration criteria to determine 
     * if client access frameworks must trigger a formal re-authentication routing flow.
     * @param {Date} currentTime - Active reference system clock timestamp used for verification checks.
     * @return {boolean} True if the reference timestamp equals or exceeds the absolute validation boundary.
     */
    isExpired(currentTime) {
        return currentTime > this.expirationTime;
    }
}