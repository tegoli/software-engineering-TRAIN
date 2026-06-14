/**
 * @file Main Express server for the Train Application.
 * Implements all REST endpoints required by the frontend.
 * Delegates business logic to controllers following D2 design.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { AuthController, hashPassword } from './src/controllers/AuthController.js';
import { TrainSearchController } from './src/controllers/TrainSearchController.js';
import { TicketPurchaseController } from './src/controllers/TicketPurchaseController.js';
import { ValidationController } from './src/controllers/ValidationController.js';
import { ScheduleController } from './src/controllers/ScheduleController.js';
import { StatisticsController } from './src/controllers/StatisticsController.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// ============================================================================
//  MIDDLEWARE & STATIC FILES
// ============================================================================
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
//  DATABASE HELPERS (only for direct DB access where no controller exists)
// ============================================================================
const DB_PATH = path.join(__dirname, 'database', 'database.json');

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

// ============================================================================
//  SEED DEFAULT USERS (using AuthController.hashPassword)
// ============================================================================
/**
 * Initialises the database with default users if they do not exist.
 * - administrator: admin@railway.it / admin
 * - passenger: test@example.com / password
 */
function seedDefaultUsers() {
    const db = readDB();
    let changed = false;

    if (!db.users.some(u => u.email === 'admin@railway.it')) {
        const newId = Math.max(...db.users.map(u => u.userId), 0) + 1;
        db.users.push({
            userId: newId,
            name: 'Admin',
            surname: 'Railway',
            email: 'admin@railway.it',
            passwordHash: hashPassword('admin'),
            role: 'administrator',
            preferredLanguage: 'en',
            loyaltyPoints: 0,
            failedLoginAttempts: 0,
            accountStatus: 'active',
            adminCode: 'ADMIN-001'
        });
        changed = true;
        console.log('✅ Admin user created (admin@railway.it / admin)');
    }

    if (!db.users.some(u => u.email === 'test@example.com')) {
        const newId = Math.max(...db.users.map(u => u.userId), 0) + 1;
        db.users.push({
            userId: newId,
            name: 'Test',
            surname: 'User',
            email: 'test@example.com',
            passwordHash: hashPassword('password'),
            role: 'passenger',
            preferredLanguage: 'it',
            loyaltyPoints: 50,
            failedLoginAttempts: 0,
            accountStatus: 'active'
        });
        changed = true;
        console.log('✅ Test user created (test@example.com / password)');
    }

    if (changed) writeDB(db);
}
seedDefaultUsers();

// ============================================================================
//  PUBLIC ROUTES (no authentication required)
// ============================================================================

/**
 * GET /api/stations
 * Returns the list of all stations (simple DB read, no controller needed).
 */
app.get('/api/stations', (req, res) => {
    const db = readDB();
    res.json(db.stations);
});

/**
 * POST /api/login
 * Authenticates a user and returns a session token.
 */
app.post('/api/login', AuthController.login);

/**
 * POST /api/register
 * Creates a new passenger account.
 */
app.post('/api/register', AuthController.register);

/**
 * POST /api/search
 * Searches for available trains matching the criteria.
 */
app.post('/api/search', TrainSearchController.search);

// ============================================================================
//  PROTECTED ROUTES (authentication required)
// ============================================================================

/**
 * GET /api/me
 * Returns the authenticated user's basic data.
 */
app.get('/api/me', AuthController.authenticate, (req, res) => {
    const db = readDB();
    const user = db.users.find(u => u.userId === req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.userId, name: user.name, role: user.role });
});

/**
 * GET /api/user/dashboard/:userId
 * Returns passenger dashboard (active tickets, history, loyalty points).
 * Accessible by the user themselves or an administrator.
 */
app.get('/api/user/dashboard/:userId', AuthController.authenticate, (req, res) => {
    const targetUserId = parseInt(req.params.userId);
    if (req.user.userId !== targetUserId && req.user.role !== 'administrator') {
        return res.status(403).json({ error: 'Access denied' });
    }
    const db = readDB();
    const user = db.users.find(u => u.userId === targetUserId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const tickets = db.tickets.filter(t => t.userId === targetUserId);
    const activeTickets = tickets.filter(t => t.status === 'active');
    const history = tickets.filter(t => t.status !== 'active').map(t => {
        const run = db.trainRuns.find(r => r.runId === t.runId);
        const route = db.routes.find(r => r.routeId === run?.routeId);
        const fromStop = route?.stops.find(s => s.stopOrder === t.fromStopOrder);
        const toStop = route?.stops.find(s => s.stopOrder === t.toStopOrder);
        const fromStation = db.stations.find(s => s.stationId === fromStop?.stationId);
        const toStation = db.stations.find(s => s.stationId === toStop?.stationId);
        return {
            ticketId: t.ticketId,
            from: fromStation?.name,
            to: toStation?.name,
            date: t.purchaseDate,
            price: t.price,
            status: t.status
        };
    });

    res.json({
        name: user.name,
        loyaltyPoints: user.loyaltyPoints,
        activeTickets: activeTickets.map(t => {
            const run = db.trainRuns.find(r => r.runId === t.runId);
            const route = db.routes.find(r => r.routeId === run?.routeId);
            const fromStop = route?.stops.find(s => s.stopOrder === t.fromStopOrder);
            const toStop = route?.stops.find(s => s.stopOrder === t.toStopOrder);
            const fromStation = db.stations.find(s => s.stationId === fromStop?.stationId);
            const toStation = db.stations.find(s => s.stationId === toStop?.stationId);
            return {
                ticketId: t.ticketId,
                from: fromStation?.name,
                to: toStation?.name,
                departureTime: fromStop?.scheduledDeparture,
                price: t.price,
                seatNumber: t.seatNumber
            };
        }),
        history
    });
});

/**
 * POST /api/purchase
 * Buys a ticket for the authenticated user.
 */
app.post('/api/purchase', AuthController.authenticate, TicketPurchaseController.purchase);

/**
 * POST /api/validate
 * Validates a ticket (inspector only).
 */
app.post('/api/validate', AuthController.authenticate, AuthController.requireRole('inspector'), ValidationController.validateTicket);

/**
 * GET /api/inspector/schedule/:inspectorId
 * Returns the shift schedule for a ticket inspector.
 */
app.get('/api/inspector/schedule/:inspectorId', AuthController.authenticate, AuthController.requireRole('inspector'), ScheduleController.getSchedule);

/**
 * GET /api/admin/stats
 * Returns system statistics (administrator only).
 */
app.get('/api/admin/stats', AuthController.authenticate, AuthController.requireRole('administrator'), StatisticsController.getStatistics);

/**
 * POST /api/support
 * Submits a customer support request.
 * (No dedicated controller yet – kept inline for simplicity)
 */
app.post('/api/support', AuthController.authenticate, (req, res) => {
    const { requestType, ticketRef, description } = req.body;
    const db = readDB();
    const newId = Math.max(...db.supportRequests.map(r => r.requestId), 0) + 1;
    db.supportRequests.push({
        requestId: newId,
        userId: req.user.userId,
        requestType,
        description,
        status: 'open',
        creationDate: new Date().toISOString(),
        resolution: null
    });
    writeDB(db);
    res.json({ success: true, message: 'Request sent' });
});

// ============================================================================
//  START SERVER
// ============================================================================
app.listen(PORT, () => {
    console.log(`🚆 Train server running on http://localhost:${PORT}`);
    console.log(`📁 Database: ${DB_PATH}`);
    console.log(`🔐 Admin: admin@railway.it / admin`);
    console.log(`👤 Test user: test@example.com / password`);
});