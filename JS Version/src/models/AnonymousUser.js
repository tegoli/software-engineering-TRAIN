import { User } from './User.js';
import { TrainSearchController } from '../controllers/TrainSearchController.js';

export class AnonymousUser extends User {
    /**
     * Searches for trains using manual input.
     * @param {object} criteria
     * @param {boolean} mapOpt
     * @returns {Promise<Array>}
     */
    async search(criteria, mapOpt) {
        return TrainSearchController.searchInternal(criteria, mapOpt);
    }

    /**
     * Selects station from map.
     * @param {string} stationName
     * @returns {object}
     */
    async selectStation(stationName) {
        // returns station object
        const { getStations } = await import('../database/db.js');
        return getStations().find(s => s.name === stationName);
    }

    /**
     * Registers a new account.
     * @param {string} name
     * @param {string} surname
     * @param {string} email
     * @param {string} password
     * @returns {Promise<object>}
     */
    async register(name, surname, email, password) {
        const { AuthController } = await import('../controllers/AuthController.js');
        return AuthController.registerInternal({ name, surname, email, password });
    }
}