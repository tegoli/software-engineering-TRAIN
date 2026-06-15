/**
 * @file TrainOption.js
 * @brief Holds a specific trip option a passenger picked during booking.
 * @details Stores the price and how many seats are free
 * for this option before the booking is finalized.
 */
export class TrainOption {
    /** * @brief Unique ID for this option in the checkout.
     * @type {number} 
     */ 
    optionId;

    /** * @brief Total price for this trip option.
     * @type {number} 
     */ 
    totalPrice;

    /** * @brief How many seats are still free.
     * @type {number} 
     */ 
    availableSeats;

    /**
     * @brief Returns the total price of the option.
     * @details Gives the price number to billing or
     * the checkout page so it can be displayed.
     * @return {number} The total price amount.
     */
    displayTotal() {
        return this.totalPrice;
    }
}
