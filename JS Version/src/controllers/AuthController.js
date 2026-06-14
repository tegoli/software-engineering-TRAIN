/**
 * @file Authentication controller.
 * Implements user registration, login, logout, session management, and password recovery.
 * Follows D2 use cases UC2 and UC10.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../database/database.json');

/**
 * Reads the entire JSON database.
 * @returns {object} Database content.
 */
function readDB() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

/**
 * Writes data to the JSON database.
 * @param {object} data - Database content.
 */
function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

/**
 * Hashes a password using SHA256.
 * @param {string} pwd - Plain text password.
 * @returns {string} Hexadecimal hash.
 */
export function hashPassword(pwd) {
    return crypto.createHash('sha256').update(pwd).digest('hex');
}

/**
 * Generates a random session token.
 * @returns {string} 64-character hex token.
 */
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// In‑memory session store (for production, use Redis)
const sessions = new Map();

export class AuthController {
    /**
     * UC2 - Register a new user (FR12).
     * @param {Object} req - Express request (body: name, surname, email, password).
     * @param {Object} res - Express response.
     */
    static async register(req, res) {
        const { name, surname, email, password } = req.body;
        const db = readDB();
        if (db.users.find(u => u.email === email)) {
            return res.status(400).json({ success: false, message: 'Email già registrata' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password minima 8 caratteri' });
        }
        const newId = Math.max(...db.users.map(u => u.userId)) + 1;
        const newUser = {
            userId: newId,
            name, surname, email,
            passwordHash: hashPassword(password),
            role: 'passenger',
            preferredLanguage: 'it',
            loyaltyPoints: 0,
            failedLoginAttempts: 0,
            accountStatus: 'active'
        };
        db.users.push(newUser);
        writeDB(db);
        res.json({ success: true, message: 'Registrazione completata' });
    }

    /**
     * UC2 - Login (FR28).
     * @param {Object} req - Express request (body: email, password).
     * @param {Object} res - Express response.
     */
    static async login(req, res) {
        const { email, password } = req.body;
        const db = readDB();
        const user = db.users.find(u => u.email === email);
        if (!user || user.passwordHash !== hashPassword(password)) {
            if (user) {
                user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
                if (user.failedLoginAttempts >= 5) {
                    user.accountStatus = 'blocked';
                }
                writeDB(db);
            }
            return res.status(401).json({ success: false, message: 'Credenziali errate' });
        }
        if (user.accountStatus !== 'active') {
            return res.status(401).json({ success: false, message: 'Account bloccato' });
        }
        user.failedLoginAttempts = 0;
        writeDB(db);

        const token = generateToken();
        sessions.set(token, { userId: user.userId, role: user.role });
        res.json({
            success: true,
            token,
            user: { id: user.userId, name: user.name, role: user.role }
        });
    }

    /**
     * UC2 - Logout (FR34).
     * @param {Object} req - Express request.
     * @param {Object} res - Express response.
     */
    static async logout(req, res) {
        const auth = req.headers.authorization;
        if (auth && auth.startsWith('Bearer ')) {
            const token = auth.slice(7);
            sessions.delete(token);
        }
        res.json({ success: true });
    }

    /**
     * Middleware: authenticates a Bearer token.
     * @param {Object} req - Express request.
     * @param {Object} res - Express response.
     * @param {Function} next - Next middleware.
     */
    static authenticate(req, res, next) {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = auth.slice(7);
        const session = sessions.get(token);
        if (!session) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = session;
        next();
    }

    /**
     * Middleware: requires a specific user role.
     * @param {string} role - Required role (e.g., 'administrator', 'inspector').
     * @returns {Function} Express middleware.
     */
    static requireRole(role) {
        return (req, res, next) => {
            if (req.user.role !== role) {
                return res.status(403).json({ error: `Forbidden: ${role} role required` });
            }
            next();
        };
    }

    // ========== Additional D2 methods (UC10, etc.) ==========

    /**
     * Checks if an email is already registered.
     * @param {string} email - Email to check.
     * @returns {boolean} True if unique.
     */
    static checkEmailUnique(email) {
        const db = readDB();
        return !db.users.find(u => u.email === email);
    }

    /**
     * Creates a new account in the database (wrapper).
     * @param {Object} userData - User profile data.
     */
    static createAccount(userData) {
        const db = readDB();
        const newId = Math.max(...db.users.map(u => u.userId), 0) + 1;
        const newUser = { userId: newId, ...userData };
        db.users.push(newUser);
        writeDB(db);
    }

    /**
     * Validates user credentials.
     * @param {string} email - User email.
     * @param {string} password - Plain password.
     * @returns {boolean} True if valid.
     */
    static validateCredentials(email, password) {
        const db = readDB();
        const user = db.users.find(u => u.email === email);
        return user && user.passwordHash === hashPassword(password);
    }

    /**
     * Creates a new session token for a user.
     * @param {string} email - User email.
     * @returns {string} Session token.
     */
    static createSession(email) {
        const db = readDB();
        const user = db.users.find(u => u.email === email);
        if (!user) return null;
        const token = generateToken();
        sessions.set(token, { userId: user.userId, role: user.role });
        return token;
    }

    /**
     * Increments the failed login attempt counter.
     * @param {string} email - User email.
     */
    static incrementFailedAttempts(email) {
        const db = readDB();
        const user = db.users.find(u => u.email === email);
        if (user) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            writeDB(db);
        }
    }

    /**
     * Returns the number of failed login attempts.
     * @param {string} email - User email.
     * @returns {number} Failed attempts count.
     */
    static checkFailCount(email) {
        const db = readDB();
        const user = db.users.find(u => u.email === email);
        return user ? user.failedLoginAttempts : 0;
    }

    /**
     * Locks a user account after too many failures.
     * @param {string} email - User email.
     */
    static lockAccount(email) {
        const db = readDB();
        const user = db.users.find(u => u.email === email);
        if (user) {
            user.accountStatus = 'blocked';
            writeDB(db);
        }
    }

    /**
     * Terminates a session by removing the token.
     * @param {string} token - Session token.
     */
    static terminateSession(token) {
        sessions.delete(token);
    }

    /**
     * Validates a password change request.
     * @param {string} oldPass - Old password.
     * @param {string} newPass - New password.
     * @returns {boolean} True if change is allowed.
     */
    static validateChange(oldPass, newPass) {
        return newPass && newPass.length >= 8;
    }

    /**
     * Verifies password complexity (min 8 chars).
     * @param {string} password - Password to check.
     * @returns {boolean} True if strong enough.
     */
    static verifyComplexity(password) {
        return password && password.length >= 8;
    }

    /**
     * Updates a user's password hash.
     * @param {number} userId - User ID.
     * @param {string} newPass - New plain password.
     */
    static updateCredentials(userId, newPass) {
        const db = readDB();
        const user = db.users.find(u => u.userId === userId);
        if (user) {
            user.passwordHash = hashPassword(newPass);
            writeDB(db);
        }
    }

    /**
     * Sends a password reset link (simulated).
     * @param {string} email - User email.
     */
    static triggerResetLink(email) {
        console.log(`[Auth] Password reset link sent to ${email}`);
    }
}