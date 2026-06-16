import { User } from './User.js';
import { AuthController } from '../controllers/AuthController.js';

/**
 * @class RegisteredUser
 * @extends User
 * @brief Represents a user who has signed up and logged in.
 * @details Extends the basic User class with login, password management, and account security features.
 */
export class RegisteredUser extends User {
    /** * @brief Hashed password for login.
     * @type {string} 
     */ 
    passwordHash;

    /** * @brief Whether the account is active or locked.
     * @type {string} 
     */ 
    accountStatus; // 'active', 'locked'

    /** * @brief Number of failed login attempts.
     * @type {number} 
     */ 
    failedLoginAttempts;

    /**
     * @brief Logs the user in and gets a session token.
     * @details Calls the auth controller to check the email and password and create a session.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @return {Promise<Object|boolean>} Promise with session data or false.
     */
    async login(email, password) {
        return AuthController.loginInternal(email, password);
    }

    /**
     * @brief Logs the user out by clearing their session.
     * @details Tells the auth controller to end this user's session.
     * @return {void}
     */
    logout() {
        AuthController.logout(this.userId);
    }

    /**
     * @brief Changes the user's password after checking the old one.
     * @details Validates the old password, then hashes and saves the new one.
     * @param {string} oldPass - The current password.
     * @param {string} newPass - The new password to set.
     * @return {Promise<boolean>} Promise that resolves to true if it worked.
     */
    async changePassword(oldPass, newPass) {
        return AuthController.changePassword(this.userId, oldPass, newPass);
    }

    /**
     * @brief Sends a password recovery email to the user.
     * @details Tells the auth controller to send a recovery link to the user's email.
     * @param {string} email - The user's email address.
     * @return {Promise<boolean>} Promise that resolves to true if sent.
     */
    async requestPasswordRecovery(email) {
        return AuthController.requestRecovery(email);
    }

    /**
     * @brief Deletes the user's account from the system.
     * @details Removes the user's data from the database but keeps anonymous audit records.
     * @return {Promise<Object>} Promise with status info.
     */
    async eliminateAccount() {
        return AuthController.deleteAccount(this.userId);
    }

    /**
     * @brief Gets all active tickets and passes for this user.
     * @details Queries the database for documents that are still valid.
     * @return {Array<Object>} List of active documents.
     */
    viewActiveDocuments() {
        // returns active tickets/subscriptions
        const { getActiveDocuments } = require('../database/db.js');
        return getActiveDocuments(this.userId);
    }
}
