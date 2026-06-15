import { User } from './User.js';
import { TrainSearchController } from '../controllers/TrainSearchController.js';

/**
 * @class AnonymousUser
 * @extends User
 * @brief Domain actor model representing an unauthenticated guest or non-registered consumer.
 * @details Establishes a lightweight interface profile allowing guest sessions to execute basic, read-only 
 * transit operations like location mapping, itinerary queries, and self-service identity creation pathways.
 */
export class AnonymousUser extends User {
    /**
     * @brief Dispatches route criteria parameters downstream to discover matching itinerary solutions.
     * @details Handshakes asynchronously with the main search engine to pull matching schedules, applying 
     * geo-spatial map routing layers if explicit visual configurations are toggled.
     * @param {Object} criteria - Structural search data parameters matching terminal target coordinates and temporal windows.
     * @param {boolean} mapOpt - Toggle parameter indicating whether to return coordinate mapping layout matrices alongside results.
     * @return {Promise<Array<Object>>} Asynchronous collection of structural train schedule and tariff option rows.
     */
    async search(criteria, mapOpt) {
        return TrainSearchController.searchInternal(criteria, mapOpt);
    }

    /**
     * @brief Resolves geographical data rows mapping a string description to a concrete station object asset.
     * @details Asynchronously dynamic-imports storage layer hooks, filtering master transit nodes to find the 
     * coordinate-complete station representation matching the user's map interaction point.
     * @param {string} stationName - Unique descriptive name or tag of the target railway facility.
     * @return {Promise<Object>} The matching station record entity populated with infrastructure parameters.
     */
    async selectStation(stationName) {
        // returns station object
        const { getStations } = await import('../database/db.js');
        return getStations().find(s => s.name === stationName);
    }

    /**
     * @brief Forwards raw identity registration profile arguments to generate permanent user credentials.
     * @details Lazy-loads authorization control systems to securely process personal details, allocate safe 
     * security hashes, and initialize customer tracking indices inside database engines.
     * @param {string} name - Given legal first name parameters identifying the customer.
     * @param {string} surname - Family name or last name attributes tracking the customer.
     * @param {string} email - Unique digital communication path requested to manage session logins and receipts.
     * @param {string} password - Raw string token passphrase targeted for hashing and storage validation.
     * @return {Promise<Object>} Asynchronous handler carrying the freshly created user record or verification details.
     */
    async register(name, surname, email, password) {
        const { AuthController } = await import('../controllers/AuthController.js');
        return AuthController.registerInternal({ name, surname, email, password });
    }
}