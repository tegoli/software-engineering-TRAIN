export class TrainOption {
    constructor(optionId, totalPrice, availableSeats) {
        this.optionId = optionId;
        this.totalPrice = totalPrice;
        this.availableSeats = availableSeats;
    }
    displayTotal() { return this.totalPrice; }
}