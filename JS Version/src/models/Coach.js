/**
 * @class Coach
 * @brief Represents an individual rolling stock passenger car or carriage asset attached to a train vehicle configuration.
 * @details Models interior capacity constraints, tracking comfort classes alongside raw structural limits 
 * and physical passenger counts to deliver live seating densities to inspectors and inventory systems.
 */
export class Coach {
    /** * @brief Sequence number or physical index designating the position of this carriage in the train line layout (e.g., Car 4).
     * @type {number} 
     */ 
    coachNumber;

    /** * @brief Service tier structure designator classifying the onboard comfort tier (e.g., 'standard', 'business').
     * @type {string} 
     */ 
    coachClass; // 'standard', 'business'

    /** * @brief Maximum safety threshold baseline or structural seating count limit defined for this individual car asset.
     * @type {number} 
     */ 
    maxPassengers;

    /** * @brief Active passenger headcount currently checking into or physically occupying space inside the car.
     * @type {number} 
     */ 
    currentPassengers;

    /**
     * @brief Synchronizes the active passenger count tracking metrics directly with backend data persistence layers.
     * @details Updates internal seat load attributes with real-time inspector observations or entry gate counts, 
     * flushing the mutated inventory attributes down-pipe to central network databases.
     * @param {number} nPassengers - The fresh headcount tally representing current physical occupants inside the car.
     * @return {void}
     */
    updateOccupancy(nPassengers) {
        this.currentPassengers = nPassengers;
        // persist
    }
}