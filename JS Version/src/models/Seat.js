/**
 * @class Seat
 * @brief Represents a physical passenger seat asset situated within a specific train coach configuration.
 * @details Models inventory allocation states, allowing booking pipelines and onboard auditing crews 
 * to track, lock down, or transition transactional placement statuses as trips progress.
 */
export class Seat {
    /** * @brief Alphanumeric tracking coordinate tag designating the row and column position (e.g., '14A').
     * @type {string} 
     */ 
    seatNumber;

    /** * @brief Current booking inventory state designator flag (e.g., 'free', 'reserved', 'occupied').
     * @type {string} 
     */ 
    seatStatus; // 'free', 'reserved', 'occupied'

    /**
     * @brief Locks the individual inventory item state to prevent duplicate seat assignments.
     * @details Evaluates the active state configuration and applies a secure temporary hold pattern 
     * by updating the tracking flag to 'reserved' if the resource is completely unallocated.
     * @return {void}
     */
    reserve() {
        if (this.seatStatus === 'free') this.seatStatus = 'reserved';
    }

    /**
     * @brief Transitions the seat lifecycle tracker into an active onboard passenger presence state.
     * @details Updates internal telemetry properties to 'occupied', signaling to ticket inspectors 
     * and live seat-map widgets that the customer has checked into or physical filled this coordinate space.
     * @return {void}
     */
    markOccupied() {
        this.seatStatus = 'occupied';
    }
}