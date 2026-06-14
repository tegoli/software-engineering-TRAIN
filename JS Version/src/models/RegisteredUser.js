import { User } from './User.js';
import { AuthController } from '../controllers/AuthController.js';

export class RegisteredUser extends User {
    /** @type {string} */ passwordHash;
    /** @type {string} */ accountStatus; // 'active', 'locked'
    /** @type {number} */ failedLoginAttempts;

    async login(email, password) {
        return AuthController.loginInternal(email, password);
    }

    logout() {
        AuthController.logout(this.userId);
    }

    async changePassword(oldPass, newPass) {
        return AuthController.changePassword(this.userId, oldPass, newPass);
    }

    async requestPasswordRecovery(email) {
        return AuthController.requestRecovery(email);
    }

    async eliminateAccount() {
        return AuthController.deleteAccount(this.userId);
    }

    viewActiveDocuments() {
        // returns active tickets/subscriptions
        const { getActiveDocuments } = require('../database/db.js');
        return getActiveDocuments(this.userId);
    }
}