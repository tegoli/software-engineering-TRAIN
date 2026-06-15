/**
 * @class Location
 * @brief A pair of geographic coordinates (latitude, longitude).
 * @details Used to track positions, calculate distances, and interact with mapping APIs.
 */
export class Location {
    /**
     * @brief Creates a new Location.
     * @param {number} lat - Latitude in degrees.
     * @param {number} lon - Longitude in degrees.
     */
    constructor(lat, lon) {
        /** @type {number} */ this.lat = lat;
        /** @type {number} */ this.lon = lon;
    }
}
