/**
 * @file Account management: password change, deletion, recovery.
 */
import { readDB, writeDB, hashPassword } from '../database/db.js';

/**
 * @const AccountController
 * @brief Handles account operations like password changes, deletion and recovery.
 * @details Provides async methods for changing passwords, deleting accounts
 * and requesting password recovery.
 */
export const AccountController = {
    /**
     * @brief Changes the user's password.
     * @details Checks the old password hash, validates the new password length,
     * and updates the database.
     * @param {number|string} userId - The ID of the user.
     * @param {string} oldPass - The current password.
     * @param {string} newPass - The new password (min 8 chars).
     * @return {Promise<boolean>} True if the password was changed, false otherwise.
     */
    async changePassword(userId, oldPass, newPass) {
        const db = readDB();
        const user = db.users.find(u => u.userId === userId);
        if (!user || user.passwordHash !== hashPassword(oldPass)) return false;
        if (newPass.length < 8) return false;
        user.passwordHash = hashPassword(newPass);
        writeDB(db);
        return true;
    },

    /**
     * @brief Deletes a user account and all associated data.
     * @details Removes the user from the database and deletes all their tickets.
     * @param {number|string} userId - The ID of the user to delete.
     * @return {Promise<boolean>} True when the deletion is complete.
     */
    async deleteAccount(userId) {
        const db = readDB();
        db.users = db.users.filter(u => u.userId !== userId);
        db.tickets = db.tickets.filter(t => t.userId !== userId);
        writeDB(db);
        return true;
    },

    /**
     * @brief Sends a password recovery email (simulated).
     * @param {string} email - The email address for the recovery request.
     * @return {Promise<boolean>} True when the process is complete.
     */
    async requestRecovery(email) {
        // send reset link
        return true;
    }
};