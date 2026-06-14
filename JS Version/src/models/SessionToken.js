/**
 * @file Represents an active user session.
 */
export class SessionToken {
    /** @type {string} */ tokenValue;
    /** @type {Date} */ expirationTime;

    constructor(tokenValue, expirationTime) {
        this.tokenValue = tokenValue;
        this.expirationTime = expirationTime;
    }

    isExpired(currentTime) {
        return currentTime > this.expirationTime;
    }
}