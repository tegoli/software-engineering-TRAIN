/**
 * @file Geographical utilities for price calculation.
 */

/**
 * Calculates ticket price based on Euclidean distance (approximation).
 * @param {object} fromStation - Object with latitude, longitude.
 * @param {object} toStation - Object with latitude, longitude.
 * @param {string} travelClass - 'standard' or 'business'.
 * @returns {number} Price in euros (2 decimals).
 */
export function calculatePrice(fromStation, toStation, travelClass, trainType) {
    const R = 6371; //Earth radius in Km
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