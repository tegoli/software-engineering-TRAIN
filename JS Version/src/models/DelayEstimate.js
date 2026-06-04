export class DelayEstimate {
    constructor(estimateId, delayMinutes, confidence) {
        this.estimateId = estimateId;
        this.delayMinutes = delayMinutes;
        this.confidence = confidence;
    }
    getDelayPrediction(trainId) { return this.delayMinutes; }
}