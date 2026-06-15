/**
 * @file DelayEstimate.js
 * @brief Domain entity capturing statistical forecasting data points for a specific train journey run.
 * @details Encapsulates raw calculated time deviation offsets alongside structural machine learning 
 * confidence ratings to provide routing systems and consumer apps with weighted timeline projections.
 */
export class DelayEstimate {
    /** * @brief Unique master identification tracking key assigned to this specific analytical estimation ledger entry.
     * @type {number} 
     */ 
    estimateId;

    /** * @brief Projected schedule deviation timeline offset duration evaluated and expressed in minutes.
     * @type {number} 
     */ 
    delayMinutes;

    /** * @brief Probability coefficient decimal value ranging from 0.0 to 1.0 representing mathematical model certainty.
     * @type {number} 
     */ 
    confidence; // 0..1

    /**
     * @brief Retreives the anticipated time variance constraint calculated for the target rolling stock asset.
     * @details Evaluates model metrics to supply down-stream scheduling loops and information boards with 
     * a calculated delay baseline projection matching the requested journey context.
     * @param {number|string} trainId - Unique asset identification key mapping to the physical rolling stock unit.
     * @return {number} Calculated timeline deviation offset value expressed in minutes.
     */
    getDelayPrediction(trainId) {
        // placeholder
        return this.delayMinutes;
    }
}