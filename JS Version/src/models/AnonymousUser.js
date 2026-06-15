import { User } from './User.js';
import { TrainSearchController } from '../controllers/TrainSearchController.js';

/**
 * @class AnonymousUser
 * @extends User
 * @brief A user who hasn't logged in yet.
 * @details Lets guests search for trains, pick stations, and create an account.
 */
export class AnonymousUser extends User {
    /**
     * @brief Searches for train trips matching the given criteria.
     * @details Sends the search info to the controller and gets back matching schedules. Can also return map data.
     * @param {Object} criteria - What the user is looking for.
     * @param {boolean} mapOpt - Whether to include map data.
     * @return {Promise<Array<Object>>} List of train schedules and prices.
     */
    async search(criteria, mapOpt) {
        return TrainSearchController.searchInternal(criteria, mapOpt);
    }

    /**
     * @brief Looks up a station by its name.
     * @details Finds the station object that matches the given name from the database.
     * @param {string} stationName - Name of the station to find.
     * @return {Promise<Object>} The station object with its info.
     */
    async selectStation(stationName) {
        // returns station object
        const { getStations } = await import('../database/db.js');
        return getStations().find(s => s.name === stationName);
    }

    /**
     * @brief Creates a new user account from the given details.
     * @details Sends the name, email and password to the auth controller to make a new account.
     * @param {string} name - The user's first name.
     * @param {string} surname - The user's last name.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's chosen password.
     * @return {Promise<Object>} The newly created user object.
     */
    async register(name, surname, email, password) {
        const { AuthController } = await import('../controllers/AuthController.js');
        return AuthController.registerInternal({ name, surname, email, password });
    }
}
