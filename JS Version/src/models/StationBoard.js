/**
 * @class StationBoard
 * @brief Represents a station board that shows arrivals or departures.
 * @details Stores the board type, entries, and last update time so passengers can see live train info.
 */
export class StationBoard {
    /** * @brief Unique ID for this board.
     * @type {number} 
     */ 
    boardId;

    /** * @brief Whether this board shows departures or arrivals.
     * @type {string} 
     */ 
    boardType; // 'departures', 'arrivals'

    /** * @brief When the board was last refreshed.
     * @type {Date} 
     */ 
    lastUpdate;

    /**
     * @brief Updates the board with new train entries and sets the time.
     * @details Replaces the old entries with fresh ones and records the update time.
     * @param {Array<Object>} entries - New train data to show on the board.
     * @return {void}
     */
    updateDisplay(entries) {
        this.lastUpdate = new Date();
        // refresh UI
    }
}
