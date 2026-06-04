import { RegisteredUser } from './RegisteredUser.js';

export class RailwayAdministrator extends RegisteredUser {
    constructor(...args) {
        super(...args);
        this.adminCode = '';
    }
    requestAdminArea() { }
    loadStatistics() { }
    applyFilters(date, trainLine) { }
    viewStatistics() { }
}