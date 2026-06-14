export class TrainRun {
    /** @type {number} */ runId;
    /** @type {Date} */ departureDate;
    /** @type {string} */ status; // 'on-time', 'delayed', 'cancelled'
    /** @type {number} */ currentDelayMinutes;

    reportDelay(trainId, delayTime) {
        this.currentDelayMinutes = delayTime;
        this.status = 'delayed';
        // trigger notifications
    }

    refreshData() {
        // fetch latest from sensors
    }
}