/**
 * @file Station.js
 * @brief Represents a single railway station.
 * @details Stores the station's name, city, code, and GPS coordinates.
 */
export class Station {
    /** * @brief Unique ID for this station.
     * @type {number} 
     */ 
    stationId;

    /** * @brief Full name of the station.
     * @type {string} 
     */ 
    name;

    /** * @brief City where the station is located.
     * @type {string} 
     */ 
    city;

    /** * @brief Short code for the station.
     * @type {string} 
     */ 
    code;

    /** * @brief Latitude coordinate of the station.
     * @type {number} 
     */ 
    latitude;

    /** * @brief Longitude coordinate of the station.
     * @type {number} 
     */ 
    longitude;

    /**
     * @brief Updates the station's departure/arrival boards.
     * @details Sends train data to web, mobile, or physical displays for this station.
     * @param {Array<Object>} data - Train data to show on the board.
     * @return {void}
     */
    displayBoard(data) {
        // would trigger UI update
    }
}
