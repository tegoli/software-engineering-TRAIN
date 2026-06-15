import { readDB, writeDB, hashPassword, createNotification } from '../database/db.js';
import { generateToken } from '../utils/crypto.js';

/**
 * @const {Map} sessions
 * @brief Stores active sessions, mapping tokens to user data.
 */
const sessions = new Map();

/**
 * @const AuthController
 * @brief Handles login, registration, password recovery and auth middleware.
 * @details Manages session tokens, login attempts blocking, and user registration.
 */
export const AuthController = {
    /**
     * @brief Checks if the request has a valid Bearer token.
     * @details Reads the Authorization header, looks up the token in the sessions map,
     * and attaches the user to the request if valid.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Callback to pass control to the next handler.
     * @return {Object|void} 401 if the token is missing or invalid, otherwise calls next().
     */
    authenticate(req, res, next) {
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
    },

    /**
     * @brief Logs a user in by checking email and password.
     * @details Finds the user by email, checks the password hash, and blocks the account
     * after 5 failed attempts. Creates a session token on success.
     * @param {Object} req - Express request with email and password in the body.
     * @param {Object} res - Express response object.
     * @return {Object|void} Error message on failure, or user data with a token on success.
     */
    login(req, res) {
        const { email, password } = req.body;
        const db = readDB();
        const user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenziali errate' });
        }
        if (user.accountStatus === 'blocked') {
            return res.status(401).json({ success: false, message: 'Account bloccato per troppi tentativi falliti. Contatta il supporto.' });
        }
        if (user.passwordHash !== hashPassword(password)) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            if (user.failedLoginAttempts >= 5) {
                user.accountStatus = 'blocked';
                writeDB(db);
                return res.status(401).json({ success: false, message: 'Account bloccato per troppi tentativi falliti.' });
            }
            writeDB(db);
            return res.status(401).json({ success: false, message: 'Credenziali errate' });
        }
        user.failedLoginAttempts = 0;
        writeDB(db);
        const token = generateToken();
        sessions.set(token, { userId: user.userId, role: user.role });
        res.json({ success: true, token, user: { id: user.userId, name: user.name, role: user.role } });
    },

    /**
     * @brief Creates a new passenger account.
     * @details Checks that the email is not already taken and the password is at least 8 chars.
     * Adds the user to the database and sends a welcome notification.
     * @param {Object} req - Express request with name, surname, email and password.
     * @param {Object} res - Express response object.
     * @return {Object|void} 400 if validation fails, otherwise a success message.
     */
    register(req, res) {
        const { name, surname, email, password } = req.body;
        const db = readDB();
        if (db.users.find(u => u.email === email)) {
            return res.status(400).json({ success: false, message: 'Email già registrata' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password minima 8 caratteri' });
        }
        const newId = Math.max(...db.users.map(u => u.userId), 0) + 1;
        db.users.push({
            userId: newId, name, surname, email,
            passwordHash: hashPassword(password), role: 'passenger',
            preferredLanguage: 'it', loyaltyPoints: 0, failedLoginAttempts: 0,
            accountStatus: 'active'
        });
        createNotification(newId, 'Benvenuto! Grazie per esserti registrato.', 'info');
        writeDB(db);
        res.json({ success: true, message: 'Registrazione completata' });
    },

    /**
     * @brief Changes the language preference for the current user.
     * @details If the user is logged in, saves the language to the database.
     * If not logged in, the frontend handles it via localStorage.
     * @param {Object} req - Express request with language in the body.
     * @param {Object} res - Express response object.
     * @return {void}
     */
    setLanguage(req, res) {
        const { language } = req.body;
        // Se non c'è utente autenticato, salva la lingua solo in localStorage (client side)
        // Ma il client manda comunque la richiesta con token se loggato.
        // Controlliamo se req.user esiste (autenticazione opzionale)
        if (req.user && req.user.userId) {
            const db = readDB();
            const user = db.users.find(u => u.userId === req.user.userId);
            if (user) {
                user.preferredLanguage = language;
                writeDB(db);
            }
        }
        // Anche se non loggato, rispondiamo successo (il client gestisce)
        res.json({ success: true });
    },

    /**
     * @brief Starts the password recovery process for a given email.
     * @details If the email is registered, creates a notification and simulates sending a reset email.
     * @param {Object} req - Express request with email in the body.
     * @param {Object} res - Express response object.
     * @return {Object|void} 404 if the email is not found, otherwise a confirmation message.
     */
    recoverPassword(req, res) {
        const { email } = req.body;
        const db = readDB();
        const user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email non registrata' });
        }
        createNotification(user.userId, 'È stata richiesta la procedura di recupero password. Segui il link inviato via email.', 'security');
        writeDB(db);
        res.json({ success: true, message: `Email di reset inviata a ${email}` });
    },

    /**
     * @brief Returns the number of active sessions.
     * @return {number} The number of sessions currently stored.
     */
    sessionCount() {
        return sessions.size;
    }
};