import { RegisteredUser } from './RegisteredUser.js';
import { StatisticsController } from '../controllers/StatisticsController.js';

export class RailwayAdministrator extends RegisteredUser {
    /** @type {string} */ adminCode;

    requestAdminArea() {
        return true;
    }

    loadStatistics() {
        return StatisticsController.getRawStatistics();
    }

    applyFilters(date, trainLine) {
        return StatisticsController.filterStatistics(date, trainLine);
    }

    viewStatistics() {
        return StatisticsController.getFormattedStatistics();
    }
}