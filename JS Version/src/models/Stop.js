export class Stop {
    constructor(stopOrder, scheduledArrival, scheduledDeparture, estimatedArrival, estimatedDeparture, trackNumber) {
        this.stopOrder = stopOrder;
        this.scheduledArrival = scheduledArrival;
        this.scheduledDeparture = scheduledDeparture;
        this.estimatedArrival = estimatedArrival;
        this.estimatedDeparture = estimatedDeparture;
        this.trackNumber = trackNumber;
    }
}