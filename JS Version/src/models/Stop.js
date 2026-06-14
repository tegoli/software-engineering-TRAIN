/**
 * @file Represents a stop along a route.
 */
export class Stop {
    /** @type {number} */ stopOrder;
    /** @type {number} */ stationId;
    /** @type {string} */ scheduledArrival;   // HH:MM
    /** @type {string} */ scheduledDeparture; // HH:MM
    /** @type {string} */ estimatedArrival;
    /** @type {string} */ estimatedDeparture;
    /** @type {string} */ trackNumber;
}