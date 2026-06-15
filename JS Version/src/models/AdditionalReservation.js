/**
 * @class AdditionalReservation
 * @brief Domain entity model capturing ancillary travel services or secondary add-on bookings.
 * @details Manages structural allocations and separate transactional lifecycles for peripheral transit 
 * selections (such as bicycle rack placements, oversized luggage holds, or premium lounge access tokens) 
 * that accompany a passenger's primary travel ticket ledger record.
 */
export class AdditionalReservation {
    /** * @brief Unique master identification tracking key assigned to this specific ancillary selection row.
     * @type {number} 
     */ 
    reservationId;

    /** * @brief Internal operational lifecycle configuration state (e.g., 'reserved', 'confirmed', 'cancelled').
     * @type {string} 
     */ 
    status; // 'reserved', 'confirmed', 'cancelled'

    /** * @brief Financial valuation total designated for this ancillary line item, expressed in the smallest applicable currency subunit.
     * @type {number} 
     */ 
    price;

    /**
     * @brief Transitions the ancillary booking status to a permanently validated allocation state.
     * @details Mutates internal tracking parameters to lock down the ancillary asset space following successful inventory validation or fund capture.
     * @return {void}
     */
    confirmReservation() {
        this.status = 'confirmed';
    }

    /**
     * @brief Releases the reserved ancillary asset allocation and updates the lifecycle track flags.
     * @details Shifts internal tracking states to mark space as unallocated, safely returning the target capacity back into open network inventory rings.
     * @return {void}
     */
    cancelReservation() {
        this.status = 'cancelled';
    }
}