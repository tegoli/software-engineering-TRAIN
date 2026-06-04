export class SessionToken {
    constructor(tokenValue, expirationTime) {
        this.tokenValue = tokenValue;
        this.expirationTime = expirationTime;
    }
    isExpired(currentTime) {
        return currentTime > this.expirationTime;
    }
}