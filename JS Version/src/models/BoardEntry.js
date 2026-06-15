/**
 * @file BoardEntry.js
 * @brief Represents one row on a station departure or arrival board.
 * @details Holds the scheduled time, estimated time, platform, and status for a single train on the board.
 */
export class BoardEntry {
    /** * @brief The scheduled time from the timetable.
     * @type {Date} 
     */ 
    scheduledTime;

    /** * @brief The updated time if the train is delayed.
     * @type {Date} 
     */ 
    estimatedTime;

    /** * @brief Platform number for boarding.
     * @type {string} 
     */ 
    platform;

    /** * @brief Current status of the train.
     * @type {string} 
     */ 
    entryStatus; // 'on-time', 'delayed', 'cancelled'
}
