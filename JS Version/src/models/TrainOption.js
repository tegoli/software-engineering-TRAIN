/**
 * @file TrainOption.js
 * @brief Domain entity encapsulating a specific itinerary choice selected by a passenger during booking checkout.
 * @details Models a transient selection tracking state, binding financial price configurations alongside live 
 * real-time physical seat inventory allocations before locking in final reservations.
 */
export class TrainOption {
    /** * @brief Unique identifier string or key mapping this specific travel choice option to the current user checkout context.
     * @type {number} 
     */ 
    optionId;

    /** * @brief Accumulated currency total for the chosen itinerary, incorporating cabin tiers and base kilometer calculations.
     * @type {number} 
     */ 
    totalPrice;

    /** * @brief Current volume of unallocated seats remaining on the physical carriage configuration for this run selection.
     * @type {number} 
     */ 
    availableSeats;

    /**
     * @brief Formats and yields the complete financial total for the selected itinerary option.
     * @details Provides raw numeric price points directly to billing modules or front-end checkout display layers.
     * @return {number} The aggregated currency value total.
     */
    displayTotal() {
        return this.totalPrice;
    }
}