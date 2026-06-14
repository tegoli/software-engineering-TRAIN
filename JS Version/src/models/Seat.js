export class Seat {
    /** @type {string} */ seatNumber;
    /** @type {string} */ seatStatus; // 'free', 'reserved', 'occupied'

    reserve() {
        if (this.seatStatus === 'free') this.seatStatus = 'reserved';
    }

    markOccupied() {
        this.seatStatus = 'occupied';
    }
}