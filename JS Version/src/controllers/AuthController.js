import { readDB, writeDB, hashPassword, createNotification } from '../database/db.js';
import { generateToken } from '../utils/crypto.js';

/**
 * @const {Map} sessions
 * @brief In-memory session store mapping active bearer tokens to user session objects.
 */
const sessions = new Map();

/**
 * @const AuthController
 * @brief Controller object handling identity verification, session state, and security boundaries.
 * @details Manages middleware authorization checks, login throttles, user registrations, and language properties.
 */
export const AuthController = {
    /**
     * @brief Middleware to enforce request validation via Bearer tokens.
     * @details Checks incoming authorization headers, extracts the active signature token, 
     * and maps it against the local session store. Attaches the user object on validation success.
     * @param {Object} req - Express request object containing headers and targets.
     * @param {Object} res - Express response object for error processing.
     * @param {Function} next - Callback function to advance control to the subsequent route execution block.
     * @return {Object|void} Sends a 401 response if verification fails, otherwise passes control forward.
     */
    authenticate(req, res, next) {
        const auth = req.headers.authorization;
        console.log('Auth header:', auth);  // ← aggiungi questa riga
        if (!auth || !auth.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = auth.slice(7);
        const session = sessions.get(token);
        if (!session) {
            console.log('Token non trovato nelle sessioni:', token);  // ← aggiungi
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = session;
        next();
    },

    /**
     * @brief Authenticates credentials and instantiates a user session.
     * @details Evaluates email accuracy, verification parameters, and account status blocks. Increments 
     * failedLoginAttempts tracking and locks accounts exceeding 5 consecutive credential failures. 
     * Resets indicators and generates unique access tokens upon identity match.
     * @param {Object} req - Express request object housing email and password properties.
     * @param {Object} res - Express response object delivering validation status codes or bearer tokens.
     * @return {Object|void} Sends an error message on validation failure, or a profile summary with a token.
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
     * @brief Registers a brand new passenger account within the user repository.
     * @details Verifies that the email address is unique, validates minimum character lengths for 
     * plain text keys, handles unique ID auto-incrementing, registers default metadata parameters, 
     * and sends a welcome alert.
     * @param {Object} req - Express request payload carrying new registry fields.
     * @param {Object} res - Express response endpoint providing transaction status logs.
     * @return {Object|void} Sends a 400 response on validation constraints, or a success message upon commitment.
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
     * @brief Commits regionalization locale modifications on active validated users.
     * @details Parses session contextual headers. If authentication fields are validated, 
     * updates user localization markers across storage components while remaining open 
     * to anonymous client updates.
     * @param {Object} req - Express request object providing identity payloads and modern tracking variables.
     * @param {Object} res - Express response terminal.
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
     * @brief Validates destination records and sets up a credential recovery context.
     * @details Confirms matching email records, constructs an internal notification link alert tracking log, 
     * and leaves an email execution mock record.
     * @param {Object} req - Express request payload showing recipient coordinates.
     * @param {Object} res - Express response delivery map.
     * @return {Object|void} Sends a 404 response if the email is unregistered, otherwise sends a confirmation.
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
     * @brief Measures aggregate allocation indexes for the tracking memory cache store.
     * @return {number} The active record size count.
     */
    sessionCount() {
        return sessions.size;
    }
};