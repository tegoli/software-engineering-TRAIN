/**
 * @file Delay prediction for a train run.
 */
export class DelayEstimate {
    /** @type {number} */ estimateId;
    /** @type {number} */ delayMinutes;
    /** @type {number} */ confidence; // 0..1

    getDelayPrediction(trainId) {
        // placeholder
        return this.delayMinutes;
    }
}