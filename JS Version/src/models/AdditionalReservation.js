/**
 * @class AdditionalReservation
 * @brief Handles extra stuff you can book on top of a train ticket.
 * @details Things like bike spots, extra luggage, or lounge access added to a main booking.
 */
export class AdditionalReservation {
    /** @brief Unique ID for this extra booking item.
     * @type {number} 
     */ 
    reservationId;

    /** @brief Current state of the booking (e.g., 'reserved', 'confirmed', 'cancelled').
     * @type {string} 
     */ 
    status; // 'reserved', 'confirmed', 'cancelled'

    /** @brief How much this extra item costs.
     * @type {number} 
     */ 
    price;

    /**
     * @brief Changes the status to confirmed after payment goes through.
     * @details Locks in the reservation so nobody else can take that spot.
     * @return {void}
     */
    confirmReservation() {
        this.status = 'confirmed';
    }

    /**
     * @brief Cancels this extra booking and frees up the spot.
     * @return {void}
     */
    cancelReservation() {
        this.status = 'cancelled';
    }
}
