export class TicketChangeRequest {
    constructor(newDate, newTime, changeType) {
        this.newDate = newDate;
        this.newTime = newTime;
        this.changeType = changeType;
    }
    validateAgainstThreshold(departureTime) { return true; }
}