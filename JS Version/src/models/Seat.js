export class Seat {
    constructor(seatNumber, seatStatus) {
        this.seatNumber = seatNumber;
        this.seatStatus = seatStatus;
    }
    reserve() { this.seatStatus = 'RESERVED'; }
    markOccupied() { this.seatStatus = 'OCCUPIED'; }
}