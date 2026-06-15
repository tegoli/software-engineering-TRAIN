/**
 * @class PredictionSystem
 * @brief Guesses how late trains will be using some basic math.
 * @details Has static methods that give delay predictions and estimates for trains. Right now it just uses random numbers.
 */
export class PredictionSystem {
    /**
     * @brief Predicts delays for a list of trains.
     * @details Takes an array of train IDs and returns predicted delay times for each one.
     * @param {Array<number|string>} trainIds - The trains to check.
     * @return {Array<Object>} Each train mapped to its predicted delay in minutes.
     */
    static getDelayPrediction(trainIds) {
        // ML model placeholder
        return trainIds.map(id => ({ trainId: id, predictedDelay: Math.random() * 20 }));
    }

    /**
     * @brief Estimates how late a single train will be.
     * @details Returns a random delay estimate for the given train ID.
     * @param {number|string} trainId - The train to estimate.
     * @return {number} Estimated delay in minutes.
     */
    static getDelayEstimate(trainId) {
        return Math.random() * 30;
    }
}
