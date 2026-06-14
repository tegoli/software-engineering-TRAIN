/**
 * @brief Real-time status of a train.
 */
export class TrainStatus {
    /** @type {Date} */ scheduledDeparture;
    /** @type {Date} */ estimatedDeparture;
    /** @type {Date} */ scheduledArrival;
    /** @type {Date} */ estimatedArrival;
    /** @type {number} */ delayMinutes;

    displayVisualTimeline(location, delay) {
        // Build UI representation
        return { timeline: [], currentLocation: location };
    }
}