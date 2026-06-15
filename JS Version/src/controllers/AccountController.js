/**
 * @file Account management (password recovery, deletion).
 */
import { readDB, writeDB, hashPassword } from '../database/db.js';

/**
 * @const AccountController
 * @brief Controller object handling operational logic for user accounts.
 * @details Manages security validations, full account data erasure, and recovery workflows.
 */
export const AccountController = {
    /**
     * @brief Validates security records and changes a user's password.
     * @details Compares the hash of the old password against storage records, validates that 
     * the new password meets the minimum length requirement, updates the record, and persists modifications.
     * @param {number|string} userId - The unique identifier of the user changing their credentials.
     * @param {string} oldPass - The current plain text password for identity verification.
     * @param {string} newPass - The new plain text password to be applied.
     * @return {Promise<boolean>} Resolves to true if password modification succeeded; false if verification failed or criteria weren't met.
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
     * @brief Permanently deletes a user account and purges associated data.
     * @details Removes the user's specific registration entry and cascades the deletion to remove 
     * all records matching their user identifier within the tickets database.
     * @param {number|string} userId - The unique identifier of the target account to erase.
     * @return {Promise<boolean>} Resolves to true once database filters are completed and saved.
     */
    async deleteAccount(userId) {
        const db = readDB();
        db.users = db.users.filter(u => u.userId !== userId);
        db.tickets = db.tickets.filter(t => t.userId !== userId);
        writeDB(db);
        return true;
    },

    /**
     * @brief Initiates the password recovery procedure for a user given their email identity.
     * @details Mock implementation for generating and sending an automated credential reset link.
     * @param {string} email - The registered email address associated with the recovery request.
     * @return {Promise<boolean>} Resolves to true indicating processing operations were completed.
     */
    async requestRecovery(email) {
        // send reset link
        return true;
    }
};