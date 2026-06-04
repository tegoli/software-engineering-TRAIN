export class TrainStatus {
    constructor(scheduledDeparture, estimatedDeparture, scheduledArrival, estimatedArrival, delayMinutes) {
        this.scheduledDeparture = scheduledDeparture;
        this.estimatedDeparture = estimatedDeparture;
        this.scheduledArrival = scheduledArrival;
        this.estimatedArrival = estimatedArrival;
        this.delayMinutes = delayMinutes;
    }
    displayVisualTimeline(location, delay) { console.log('Mostra timeline visiva'); }
}