/**
 * @class Train
 * @brief Represents a real train that runs on the network.
 * @details Stores info like the train code, type, service
 * classes, and has methods to check its location and delays.
 */
export class Train {
    /** * @brief Unique database ID for this train.
     * @type {number} 
     */ 
    trainId;

    /** * @brief Public code like 'FR9532'.
     * @type {string} 
     */ 
    trainCode;

    /** * @brief Type like 'Frecciarossa', 'Intercity', 'Regionale'.
     * @type {string} 
     */ 
    trainType;

    /** * @brief Seat classes like ['Standard', 'Business'].
     * @type {string[]} 
     */ 
    serviceClasses;

    /**
     * @brief Gets the current GPS location of the train.
     * @details Calls an external API or reads from the
     * database to find where the train is right now.
     * @param {number} trainId - ID of the train to locate.
     * @return {Object} Latitude and longitude coordinates.
     */
    getLiveLocation(trainId) {
        // call external API or read from DB
        return { latitude: 45.0, longitude: 9.0 };
    }

    /**
     * @brief Estimates how late the train will be.
     * @details Checks sensor data and schedule info
     * to figure out the delay in minutes.
     * @param {number} trainId - ID of the train to check.
     * @return {number} Estimated delay in minutes.
     */
    getDelayEstimate(trainId) {
        return Math.floor(Math.random() * 30);
    }
}
