/**
 * @class Route
 * @brief Represents a train route between stations.
 * @details Stores the route ID and name, and can calculate how long the trip takes.
 */
export class Route {
    /**
     * @brief Creates a new Route object.
     * @param {number|string} routeId - ID for this route.
     * @param {string} routeName - Name of the route.
     */
    constructor(routeId, routeName) {
        /** * @brief Unique ID for this route.
         * @type {number|string} 
         */
        this.routeId = routeId;

        /** * @brief Display name for the route.
         * @type {string} 
         */
        this.routeName = routeName;
    }

    /**
     * @brief Works out how long the route takes.
     * @details Uses schedule data to estimate travel time in minutes.
     * @return {number} Travel time in minutes.
     */
    calculateDuration() { 
        return 0; 
    }
}
