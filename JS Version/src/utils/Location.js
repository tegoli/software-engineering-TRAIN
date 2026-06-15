/**
 * @class Location
 * @brief Represents a pair of geographic coordinates on the Earth's surface using a standard coordinate system.
 * @details Encapsulates latitudinal and longitudinal values to track rolling stock fleet assets, calculate physical 
 * station distances, and integrate with external mapping APIs.
 */
export class Location {
    /**
     * @brief Instantiates a geometric coordinate position tracking block.
     * @param {number} lat - Latitude in degrees, indicating angular distance north or south of the equator.
     * @param {number} lon - Longitude in degrees, indicating angular distance east or west of the prime meridian.
     */
    constructor(lat, lon) {
        /** @type {number} */ this.lat = lat;
        /** @type {number} */ this.lon = lon;
    }
}