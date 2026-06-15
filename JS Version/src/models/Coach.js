/**
 * @class Coach
 * @brief A single train car that carries passengers.
 * @details Tracks how many seats there are, what class it is, and how many people are currently inside.
 */
export class Coach {
    /** * @brief The position of this car in the train.
     * @type {number} 
     */ 
    coachNumber;

    /** * @brief The class of the car (e.g. 'standard', 'business').
     * @type {string} 
     */ 
    coachClass; // 'standard', 'business'

    /** * @brief Maximum number of passengers allowed in this car.
     * @type {number} 
     */ 
    maxPassengers;

    /** * @brief How many passengers are currently in the car.
     * @type {number} 
     */ 
    currentPassengers;

    /**
     * @brief Updates the number of passengers in this car.
     * @details Sets the new passenger count and saves it to the database.
     * @param {number} nPassengers - The new passenger headcount.
     * @return {void}
     */
    updateOccupancy(nPassengers) {
        this.currentPassengers = nPassengers;
        // persist
    }
}
