import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @const {string} DB_PATH
 * @brief The absolute path to the JSON database file.
 */
export const DB_PATH = path.join(__dirname, 'database.json');

/**
 * @brief Reads and parses the JSON database.
 * @details Checks if the database file exists at DB_PATH. If it does not exist, 
 * it initializes an empty database structure, writes it to disk, and returns it.
 * @return {Object} The complete database object containing all tables/collections.
 */
export function readDB() {
    if (!fs.existsSync(DB_PATH)) {
        const empty = {
            users: [], stations: [], trains: [], routes: [], trainRuns: [],
            tickets: [], shiftSchedules: [], payments: [], loyaltyTransactions: [],
            additionalReservations: [], seatReservations: [], supportRequests: [],
            notifications: [], subscriptions: [], delayPredictions: [], occupancySnapshots: []
        };
        writeDB(empty);
        return empty;
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

/**
 * @brief Writes the provided data object back to the JSON database file.
 * @param {Object} data - The complete database object to be serialized and saved.
 * @return {void}
 */
export function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

/**
 * @brief Hashes a plain text password using the SHA-256 algorithm.
 * @param {string} pwd - The plain text password to hash.
 * @return {string} The resulting hexadecimal hash string.
 */
export function hashPassword(pwd) {
    return crypto.createHash('sha256').update(pwd).digest('hex');
}

/**
 * @brief Retrieves all train stations stored in the database.
 * @return {Array<Object>} An array of station objects.
 */
export function getStations() {
    return readDB().stations;
}

/**
 * @brief Retrieves a specific user by their unique user ID.
 * @param {number|string} userId - The unique identifier of the user.
 * @return {Object|undefined} The user object if found, otherwise undefined.
 */
export function getUserById(userId) {
    return readDB().users.find(u => u.userId === userId);
}

/**
 * @brief Creates a notification for a user and saves it.
 * @details Generates an auto-incremented ID, sets the current time, read status to false.
 * @param {number|string} userId - The ID of the user to notify.
 * @param {string} message - The notification text.
 * @param {string} type - The type of notification (e.g., alert, info).
 * @return {void}
 */
export function createNotification(userId, message, type) {
    const db = readDB();
    const newId = Math.max(...db.notifications.map(n => n.notificationId), 0) + 1;
    db.notifications.push({ notificationId: newId, userId, message, type, date: new Date().toISOString(), read: false });
    writeDB(db);
}

/**
 * @brief Initializes the database with mock seed data if collections are empty.
 * @details Populates default records for stations, trains, routes, and upcoming train runs 
 * if their respective arrays are currently empty.
 * @return {void}
 */
export function initDatabase() {
    const db = readDB();
    let changed = false;
    if (db.stations.length === 0) {
        db.stations = [
            { stationId: 1, name: 'Roma Termini', city: 'Roma', code: 'ROM', latitude: 41.902, longitude: 12.496 },
            { stationId: 2, name: 'Milano Centrale', city: 'Milano', code: 'MIL', latitude: 45.486, longitude: 9.204 },
            { stationId: 3, name: 'Firenze Santa Maria Novella', city: 'Firenze', code: 'FIR', latitude: 43.776, longitude: 11.248 },
            { stationId: 4, name: 'Napoli Centrale', city: 'Napoli', code: 'NAP', latitude: 40.852, longitude: 14.268 },
            { stationId: 5, name: 'Bologna Centrale', city: 'Bologna', code: 'BOL', latitude: 44.505, longitude: 11.342 }
        ];
        changed = true;
    }
    if (db.trains.length === 0) {
        db.trains = [
            { trainId: 1, trainCode: 'FR100', trainType: 'Frecciarossa', serviceClasses: ['standard', 'business'], coaches: [{ coachNumber: 1, coachClass: 'standard', totalSeats: 60 }] },
            { trainId: 2, trainCode: 'IC200', trainType: 'Intercity', serviceClasses: ['standard'], coaches: [{ coachNumber: 1, coachClass: 'standard', totalSeats: 60 }] },
            { trainId: 3, trainCode: 'RG300', trainType: 'Regionale', serviceClasses: ['standard'], coaches: [{ coachNumber: 1, coachClass: 'standard', totalSeats: 60 }] }
        ];
        changed = true;
    }
    if (db.routes.length === 0) {
        db.routes = [
            { routeId: 1, routeName: 'Roma-Milano', stops: [{ stopOrder: 1, stationId: 1, scheduledDeparture: '06:00', scheduledArrival: '06:00' }, { stopOrder: 2, stationId: 3, scheduledDeparture: '08:00', scheduledArrival: '07:55' }, { stopOrder: 3, stationId: 2, scheduledDeparture: '10:30', scheduledArrival: '10:30' }] },
            { routeId: 2, routeName: 'Milano-Napoli', stops: [{ stopOrder: 1, stationId: 2, scheduledDeparture: '14:00', scheduledArrival: '14:00' }, { stopOrder: 2, stationId: 5, scheduledDeparture: '16:00', scheduledArrival: '15:50' }, { stopOrder: 3, stationId: 4, scheduledDeparture: '18:30', scheduledArrival: '18:30' }] }
        ];
        changed = true;
    }
    if (db.trainRuns.length === 0) {
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        db.trainRuns = [
            { runId: 1, trainId: 1, routeId: 1, departureDateTime: `${dateStr}T06:00:00Z`, status: 'on-time', currentDelayMinutes: 0 },
            { runId: 2, trainId: 2, routeId: 2, departureDateTime: `${dateStr}T14:00:00Z`, status: 'delayed', currentDelayMinutes: 15 }
        ];
        changed = true;
    }
    if (changed) writeDB(db);
}

/**
 * @brief Adds default test users and schedules to the database.
 * @details Checks if admin, test user and inspector accounts exist.
 * If missing, creates them with default passwords and mock shift schedules.
 * @return {void}
 */
export function seedDefaultUsers() {
    const db = readDB();
    let changed = false;
    if (!db.users.some(u => u.email === 'admin@railway.it')) {
        const newId = Math.max(...db.users.map(u => u.userId), 0) + 1;
        db.users.push({ userId: newId, name: 'Admin', surname: 'Railway', email: 'admin@railway.it', passwordHash: hashPassword('admin'), role: 'administrator', preferredLanguage: 'en', loyaltyPoints: 0, failedLoginAttempts: 0, accountStatus: 'active', adminCode: 'ADMIN-001' });
        changed = true;
    }
    if (!db.users.some(u => u.email === 'test@example.com')) {
        const newId = Math.max(...db.users.map(u => u.userId), 0) + 1;
        db.users.push({ userId: newId, name: 'Test', surname: 'User', email: 'test@example.com', passwordHash: hashPassword('password'), role: 'passenger', preferredLanguage: 'it', loyaltyPoints: 50, failedLoginAttempts: 0, accountStatus: 'active' });
        changed = true;
    }
    // Turni per l'ispettore Robin (userId 1003)
if (db.shiftSchedules.filter(s => s.staffId === 1003).length === 0) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0,10);
    db.shiftSchedules.push(
        { staffId: 1003, date: dateStr, startTime: '08:00', endTime: '12:00', assignedRoute: 'Roma-Milano', trainRunId: 1 },
        { staffId: 1003, date: dateStr, startTime: '14:00', endTime: '18:00', assignedRoute: 'Milano-Napoli', trainRunId: 2 }
    );
    changed = true;
}
    if (changed) writeDB(db);
        // Ispettore con userId = 1003 (usato dal frontend)
        if (!db.users.some(u => u.userId === 1003)) {
            db.users.push({
                userId: 3001,
                name: 'Ispettore',
                surname: 'Rossi',
                email: 'inspector@example.com',
                passwordHash: hashPassword('password'),
                role: 'inspector',
                preferredLanguage: 'it',
                loyaltyPoints: 0,
                failedLoginAttempts: 0,
                accountStatus: 'active',
                inspectorCode: 'INS-3001'
            });
            changed = true;
            console.log('✅ Ispettore creato (inspector@example.com / password, userId=3001)');
        }
    
        // Turni per l'ispettore 3001
        if (db.shiftSchedules.length === 0) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dateStr = tomorrow.toISOString().slice(0,10);
            db.shiftSchedules.push(
                { staffId: 3001, date: dateStr, startTime: '08:00', endTime: '12:00', assignedRoute: 'Roma-Milano', trainRunId: 1 },
                { staffId: 3001, date: dateStr, startTime: '14:00', endTime: '18:00', assignedRoute: 'Milano-Napoli', trainRunId: 2 }
            );
            changed = true;
        }
}