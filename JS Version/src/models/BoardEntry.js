/**
 * @file BoardEntry.js
 * @brief View-model definition representing a single row configuration on an station departure or arrival board.
 * @details Captures the immediate tactical telemetry points for a scheduled train stop—pairing original baseline timetables 
 * with dynamic estimated adjustments, track platform designations, and operational tracking flags to build live passenger displays.
 */
export class BoardEntry {
    /** * @brief Baseline chronological timestamp coordinate originally mapped and published in standard network timetables.
     * @type {Date} 
     */ 
    scheduledTime;

    /** * @brief Dynamic, real-time recalculation timestamp accounting for active network constraints, delays, or physical track sensors.
     * @type {Date} 
     */ 
    estimatedTime;

    /** * @brief Designated station track or platform node terminal sequence identifier where passengers physically board the train.
     * @type {string} 
     */ 
    platform;

    /** * @brief High-level systemic operational readiness or warning flag displayed to passengers (e.g., 'on-time', 'delayed', 'cancelled').
     * @type {string} 
     */ 
    entryStatus; // 'on-time', 'delayed', 'cancelled'
}