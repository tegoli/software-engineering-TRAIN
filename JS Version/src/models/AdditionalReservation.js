export class AdditionalReservation {
    constructor(reservationId, status, price) {
        this.reservationId = reservationId;
        this.status = status;
        this.price = price;
    }
    confirmReservation() { console.log('Prenotazione confermata'); }
    cancelReservation() { console.log('Prenotazione cancellata'); }
}