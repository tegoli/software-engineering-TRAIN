export class AdditionalReservation {
    /** @type {number} */ reservationId;
    /** @type {string} */ status; // 'reserved', 'confirmed', 'cancelled'
    /** @type {number} */ price;

    confirmReservation() {
        this.status = 'confirmed';
    }

    cancelReservation() {
        this.status = 'cancelled';
    }
}