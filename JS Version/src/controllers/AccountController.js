/**
 * @file Account management (password recovery, deletion).
 */
import { readDB, writeDB, hashPassword } from '../database/db.js';

export const AccountController = {
    async changePassword(userId, oldPass, newPass) {
        const db = readDB();
        const user = db.users.find(u => u.userId === userId);
        if (!user || user.passwordHash !== hashPassword(oldPass)) return false;
        if (newPass.length < 8) return false;
        user.passwordHash = hashPassword(newPass);
        writeDB(db);
        return true;
    },

    async deleteAccount(userId) {
        const db = readDB();
        db.users = db.users.filter(u => u.userId !== userId);
        db.tickets = db.tickets.filter(t => t.userId !== userId);
        writeDB(db);
        return true;
    },

    async requestRecovery(email) {
        // send reset link
        return true;
    }
};