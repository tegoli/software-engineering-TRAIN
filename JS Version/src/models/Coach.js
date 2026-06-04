export class Coach {
    constructor(coachNumber, coachClass, maxPassengers, currentPassengers) {
        this.coachNumber = coachNumber;
        this.coachClass = coachClass;
        this.maxPassengers = maxPassengers;
        this.currentPassengers = currentPassengers;
    }
    updateOccupancy(nPassengers) { this.currentPassengers = nPassengers; }
}