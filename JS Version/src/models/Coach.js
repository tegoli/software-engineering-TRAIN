export class Coach {
    /** @type {number} */ coachNumber;
    /** @type {string} */ coachClass; // 'standard', 'business'
    /** @type {number} */ maxPassengers;
    /** @type {number} */ currentPassengers;

    updateOccupancy(nPassengers) {
        this.currentPassengers = nPassengers;
        // persist
    }
}