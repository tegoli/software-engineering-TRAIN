/**
 * @class TrainRun
 * @brief Represents one scheduled trip of a train on a specific day.
 * @details Keeps track of delays, status changes, and real-time
 * position so passengers can get notified.
 */
export class TrainRun {
    /** * @brief Unique ID for this specific train run.
     * @type {number} 
     */ 
    runId;

    /** * @brief The day and time this run is scheduled for.
     * @type {Date} 
     */ 
    departureDate;

    /** * @brief Current status like 'on-time', 'delayed', or 'cancelled'.
     * @type {string} 
     */ 
    status; // 'on-time', 'delayed', 'cancelled'

    /** * @brief How many minutes late the train is.
     * @type {number} 
     */ 
    currentDelayMinutes;

    /**
     * @brief Updates the delay time and changes the status.
     * @details Saves the new delay, sets status to 'delayed',
     * and sends out notifications to passengers.
     * @param {number} trainId - ID of the train that is late.
     * @param {number} delayTime - Minutes of delay to set.
     * @return {void}
     */
    reportDelay(trainId, delayTime) {
        this.currentDelayMinutes = delayTime;
        this.status = 'delayed';
        // trigger notifications
    }

    /**
     * @brief Gets fresh data from track sensors and GPS.
     * @details Updates the run object with live info so
     * the status stays accurate.
     * @return {void}
     */
    refreshData() {
        // fetch latest from sensors
    }
}
