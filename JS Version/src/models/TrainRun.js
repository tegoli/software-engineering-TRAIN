export class TrainRun {
    constructor(runId, departureDate, status, currentDelayMinutes) {
        this.runId = runId;
        this.departureDate = departureDate;
        this.status = status;
        this.currentDelayMinutes = currentDelayMinutes;
    }
    reportDelay(trainId, delayTime) { console.log(`Ritardo segnalato per run ${this.runId}`); }
    refreshData() { console.log('Dati run aggiornati'); }
}