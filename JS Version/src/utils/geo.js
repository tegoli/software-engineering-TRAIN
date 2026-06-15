/**
 * @file PriceCalculator.js
 * @brief Geographical and algorithmic utilities for computing dynamic transit passenger fares.
 * @details Implements the Haversine trigonometric formula to determine exact great-circle distance coordinates 
 * across the Earth's surface, applying tiered price multi-pliers for high-speed rolling stock assets and premium cabin tiers.
 */

/**
 * @brief Computes real-time ticket pricing structures based on geographic tracking metrics and cabin service variables.
 * @details Calculates surface track kilometers across geographic coordinate structures using Haversine equations. 
 * Establishes standard regional pricing tiers per kilometer, scaling baselines upward for high-speed rail express 
 * classes and premium executive business arrangements.
 * @param {Object} fromStation - Origin station coordinates containing physical latitude and longitude parameters.
 * @param {number} fromStation.latitude - Geographic latitude in degrees for the departure station platform.
 * @param {number} fromStation.longitude - Geographic longitude in degrees for the departure station platform.
 * @param {Object} toStation - Destination station coordinates containing physical latitude and longitude parameters.
 * @param {number} toStation.latitude - Geographic latitude in degrees for the terminating station platform.
 * @param {number} toStation.longitude - Geographic longitude in degrees for the terminating station platform.
 * @param {string} travelClass - Structural comfort class categorization selector flag (e.g., 'standard' or 'business').
 * @param {string} trainType - Classification descriptor tag indicating the rolling stock speed profile (e.g., 'Regionale').
 * @returns {number} Consolidated final currency value formatted in Euros rounded strictly to two decimal precision.
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