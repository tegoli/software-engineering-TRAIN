/**
 * @file Represents a train option the user chooses.
 */
export class TrainOption {
    /** @type {number} */ optionId;
    /** @type {number} */ totalPrice;
    /** @type {number} */ availableSeats;

    displayTotal() {
        return this.totalPrice;
    }
}