import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, seedDefaultUsers, getStations, readDB } from './src/database/db.js';
import { AuthController } from './src/controllers/AuthController.js';
import { TrainSearchController } from './src/controllers/TrainSearchController.js';
import { TicketPurchaseController } from './src/controllers/TicketPurchaseController.js';
import { UserController } from './src/controllers/UserController.js';
import { InspectorController } from './src/controllers/InspectorController.js';
import { AdminController } from './src/controllers/AdminController.js';
import { SupportController } from './src/controllers/SupportController.js';
import { NotificationController } from './src/controllers/NotificationController.js';
import { SubscriptionController } from './src/controllers/SubscriptionController.js';
import { StationBoardController } from './src/controllers/StationBoardController.js';

/**
 * @file app.js
 * @brief Main entry point for the Express server.
 * @details Sets up the app, loads the database, defines all API routes, and starts the server on port 3000.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

initDatabase();
seedDefaultUsers();

// ROTTE PUBBLICHE 

/**
 * @route GET /api/stations
 * @brief Returns all stations.
 */
app.get('/api/stations', (req, res) => {
    res.json(getStations());
});

/**
 * @route POST /api/language
 * @brief Changes the language setting.
 */
app.post('/api/language', AuthController.setLanguage);

/**
 * @route POST /api/login
 * @brief Logs in a user.
 */
app.post('/api/login', AuthController.login);

/**
 * @route POST /api/register
 * @brief Creates a new account.
 */
app.post('/api/register', AuthController.register);

/**
 * @route POST /api/search
 * @brief Searches for train trips.
 */
app.post('/api/search', TrainSearchController.search);

/**
 * @route POST /api/search-advanced
 * @brief Searches with advanced options.
 */
app.post('/api/search-advanced', TrainSearchController.searchAdvanced);

/**
 * @route GET /api/train-status/:runId
 * @brief Gets the live status of a train.
 */
app.get('/api/train-status/:runId', TrainSearchController.getTrainStatus);

/**
 * @route GET /api/predict-delay/:runId
 * @brief Predicts how late a train will be.
 */
app.get('/api/predict-delay/:runId', TrainSearchController.predictDelay);

/**
 * @route GET /api/departures/:stationId
 * @brief Gets departures for a station.
 */
app.get('/api/departures/:stationId', StationBoardController.getDepartures);

/**
 * @route POST /api/recover-password
 * @brief Sends a password recovery email.
 */
app.post('/api/recover-password', AuthController.recoverPassword);

// ROTTE PROTETTE

/**
 * @brief Verifies the auth token.
 * @details All routes below this point need a valid token.
 */
app.use(AuthController.authenticate); // da qui in avanti serve token

/**
 * @route GET /api/me
 * @brief Gets the current user's info.
 */
app.get('/api/me', UserController.getMe);

/**
 * @route GET /api/user/dashboard/:userId
 * @brief Gets the user dashboard.
 */
app.get('/api/user/dashboard/:userId', UserController.getDashboard);

/**
 * @route GET /api/user/points
 * @brief Gets the user's loyalty points.
 */
app.get('/api/user/points', UserController.getPoints);

/**
 * @route GET /api/seat-map/:runId
 * @brief Gets the seat map for a train.
 */
app.get('/api/seat-map/:runId', TicketPurchaseController.getSeatMap);

/**
 * @route POST /api/purchase
 * @brief Buys a ticket.
 */
app.post('/api/purchase', TicketPurchaseController.purchase);

/**
 * @route PUT /api/ticket
 * @brief Changes an existing ticket.
 */
app.put('/api/ticket', UserController.modifyTicket);

/**
 * @route POST /api/change-password
 * @brief Changes the user's password.
 */
app.post('/api/change-password', UserController.changePassword);

/**
 * @route POST /api/logout
 * @brief Logs out the user.
 */
app.post('/api/logout', UserController.logout);

/**
 * @route DELETE /api/account
 * @brief Deletes the user's account.
 */
app.delete('/api/account', UserController.deleteAccount);

/**
 * @route POST /api/validate
 * @brief Validates a ticket (marks it as used).
 */
app.post('/api/validate', InspectorController.validateTicket);

/**
 * @route GET /api/inspector/schedule/:inspectorId
 * @brief Gets an inspector's work schedule.
 */
app.get('/api/inspector/schedule/:inspectorId', InspectorController.getSchedule);

/**
 * @route GET /api/admin/stats
 * @brief Returns admin statistics.
 */
app.get('/api/admin/stats', AdminController.getStats);

/**
 * @route POST /api/support
 * @brief Submits a support request.
 */
app.post('/api/support', SupportController.submit);

/**
 * @route GET /api/notifications
 * @brief Gets the user's notifications.
 */
app.get('/api/notifications', NotificationController.getNotifications);

/**
 * @route PUT /api/notifications/:id/read
 * @brief Marks a notification as read.
 */
app.put('/api/notifications/:id/read', NotificationController.markAsRead);

/**
 * @route POST /api/subscription
 * @brief Buys a subscription pass.
 */
app.post('/api/subscription', SubscriptionController.purchase);

/**
 * @route POST /api/simulate-delay
 * @brief Simulates a train delay (admin).
 */
app.post('/api/simulate-delay', AdminController.simulateDelay);

/**
 * @route GET /api/routes
 * @brief Returns the list of available routes.
 */
app.get('/api/routes', SubscriptionController.getRoutes);

/**
 * @route GET /api/debug
 * @brief Debug: shows DB stats and active sessions.
 */
app.get('/api/debug', (req, res) => {
    const db = readDB();
    res.json({ stationsCount: db.stations.length, sessionsCount: AuthController.sessionCount() });
});

/**
 * @route GET /api/subscription-price
 * @brief Gets the price for a subscription.
 */
app.get('/api/subscription-price', SubscriptionController.getPrice);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin: matteo.golinelli-1@studenti.unitn.it  / password`);
    console.log(`- User: virginia.ancora@studenti.unitn.it / password`);
    console.log(`- User: caterina.alessi@studenti.unitn.it / password`);
    console.log(`- Inspector: robin.bertolini@studenti.unitn.it / password`);
});