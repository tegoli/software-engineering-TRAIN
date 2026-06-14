import { readDB, writeDB, hashPassword, createNotification } from '../database/db.js';
import { generateToken } from '../utils/crypto.js';

const sessions = new Map();

export const AuthController = {
    authenticate(req, res, next) {
        const auth = req.headers.authorization;
        console.log('🔐 Auth header:', auth);  // ← aggiungi questa riga
        if (!auth || !auth.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = auth.slice(7);
        const session = sessions.get(token);
        if (!session) {
            console.log('❌ Token non trovato nelle sessioni:', token);  // ← aggiungi
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = session;
        next();
    },

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

    sessionCount() {
        return sessions.size;
    }
};