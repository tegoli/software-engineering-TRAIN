/**
 * @class MappingAPI
 * @brief Mock API that simulates a geospatial mapping service.
 * @details Resolves geographic coordinates into station names.
 */
export class MappingAPI {
    /**
     * @brief Resolves coordinates into a station name.
     * @param {Object|Array} coords - Coordinates with lat and lng values.
     * @return {string} The station name.
     */
    resolve(coords) { console.log('Coordinate risolte', coords); return 'Stazione Centrale'; }
}
