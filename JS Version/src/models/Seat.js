/**
 * @class Seat
 * @brief A single seat on a train that can be reserved or occupied.
 * @details Tracks if a seat is free, reserved, or taken so nobody double-books it.
 */
export class Seat {
    /** @brief The seat's label like '14A' showing its row and position.
     * @type {string} 
     */ 
    seatNumber;

    /** @brief Whether the seat is free, reserved, or occupied.
     * @type {string} 
     */ 
    seatStatus; // 'free', 'reserved', 'occupied'

    /**
     * @brief Marks the seat as reserved so nobody else can take it.
     * @details Only works if the seat is currently free.
     * @return {void}
     */
    reserve() {
        if (this.seatStatus === 'free') this.seatStatus = 'reserved';
    }

    /**
     * @brief Marks the seat as occupied when a passenger sits down.
     * @return {void}
     */
    markOccupied() {
        this.seatStatus = 'occupied';
    }
}
