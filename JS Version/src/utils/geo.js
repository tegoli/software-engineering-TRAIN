/**
 * @file geo.js
 * @brief Utility functions for calculating ticket prices based on distance.
 * @details Uses the Haversine formula to compute the distance between two stations
 * and applies pricing multipliers based on train type and travel class.
 */

/**
 * @brief Calculates the ticket price between two stations.
 * @param {Object} fromStation - Origin station coordinates.
 * @param {number} fromStation.latitude - Latitude of departure station.
 * @param {number} fromStation.longitude - Longitude of departure station.
 * @param {Object} toStation - Destination station coordinates.
 * @param {number} toStation.latitude - Latitude of arrival station.
 * @param {number} toStation.longitude - Longitude of arrival station.
 * @param {string} travelClass - The travel class ('standard' or 'business').
 * @param {string} trainType - The train type (e.g. 'Regionale').
 * @returns {number} The ticket price in Euros.
 */
export function calculatePrice(fromStation, toStation, travelClass, trainType) {
    const R = 6371; // Earth radius in Km
    const dLat = (toStation.latitude - fromStation.latitude) * Math.PI / 180;
    const dLon = (toStation.longitude - fromStation.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(fromStation.latitude * Math.PI/180) * Math.cos(toStation.latitude * Math.PI/180) * Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const km = R * c;
    
    let basePrice = km * 0.15;
    if (trainType && !trainType.includes('Regionale')) basePrice *= 2;
    
    let price = basePrice;
    if (travelClass === 'business') price *= 1.8;
    
    return Math.round(price * 100) / 100;
}
