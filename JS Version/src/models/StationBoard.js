export class StationBoard {
    /** @type {number} */ boardId;
    /** @type {string} */ boardType; // 'departures', 'arrivals'
    /** @type {Date} */ lastUpdate;

    updateDisplay(entries) {
        this.lastUpdate = new Date();
        // refresh UI
    }
}