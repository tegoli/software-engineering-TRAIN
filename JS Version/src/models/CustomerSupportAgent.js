import { RegisteredUser } from './RegisteredUser.js';

export class CustomerSupportAgent extends RegisteredUser {
    /** @type {string} */ staffCode;

    viewUserProfile(userId) {
        const { getUserById } = require('../database/db.js');
        return getUserById(userId);
    }

    manageSupportRequest(requestId) {
        const { updateSupportRequest } = require('../database/db.js');
        return updateSupportRequest(requestId);
    }

    viewLoyaltyPointsBalance(userId) {
        const { getUserById } = require('../database/db.js');
        return getUserById(userId)?.loyaltyPoints;
    }

    viewSchedule(staffId) {
        const { getSupportSchedule } = require('../database/db.js');
        return getSupportSchedule(staffId);
    }
}