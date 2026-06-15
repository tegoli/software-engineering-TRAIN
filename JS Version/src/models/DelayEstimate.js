/**
 * @file DelayEstimate.js
 * @brief Stores info about how late a train is expected to be.
 * @details Holds the delay time in minutes and how sure the system is about that prediction.
 */
export class DelayEstimate {
    /** @brief Unique ID for this delay prediction record.
     * @type {number} 
     */ 
    estimateId;

    /** @brief How many minutes the train is expected to be late.
     * @type {number} 
     */ 
    delayMinutes;

    /** @brief How confident the system is, from 0.0 to 1.0.
     * @type {number} 
     */ 
    confidence; // 0..1

    /**
     * @brief Gets the predicted delay for a specific train.
     * @param {number|string} trainId - The train to get the delay for.
     * @return {number} The predicted delay in minutes.
     */
    getDelayPrediction(trainId) {
        // placeholder
        return this.delayMinutes;
    }
}
