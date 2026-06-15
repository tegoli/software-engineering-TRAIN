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
 * @brief Application entry point and routing orchestration engine for the Transit Management Server.
 * @details Initializes standard local in-memory mock databases, binds systemic REST endpoint pathways, 
 * mounts static client interface directories, manages multi-tier session state access middleware, 
 * and maps internal business controllers to programmatic HTTP verb execution layers.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

initDatabase();
seedDefaultUsers();

// ==================== ROTTE PUBBLICHE ====================

/**
 * @route GET /api/stations
 * @brief Retrieves the master list of all geographical train stations and platforms from storage.
 */
app.get('/api/stations', (req, res) => {
    res.json(getStations());
});

/**
 * @route POST /api/language
 * @brief Sets or alters the internationalization (i18n) locale preference code for the current context.
 */
app.post('/api/language', AuthController.setLanguage);

/**
 * @route POST /api/login
 * @brief Authenticates matching credentials and provisions session identifiers for secure profiles.
 */
app.post('/api/login', AuthController.login);

/**
 * @route POST /api/register
 * @brief Registers a new consumer profile within the relational system configuration data store.
 */
app.post('/api/register', AuthController.register);

/**
 * @route POST /api/search
 * @brief Performs a traditional direct transit itinerary search matching user structural parameters.
 */
app.post('/api/search', TrainSearchController.search);

/**
 * @route POST /api/search-advanced
 * @brief Executes a comprehensive routing search tracking direct runs alongside multi-segment transfers.
 */
app.post('/api/search-advanced', TrainSearchController.searchAdvanced);

/**
 * @route GET /api/train-status/:runId
 * @brief Queries real-time status details, current delays, and next step sequences for an in-transit train run.
 */
app.get('/api/train-status/:runId', TrainSearchController.getTrainStatus);

/**
 * @route GET /api/predict-delay/:runId
 * @brief Serves telemetry projections regarding arrival time offsets via historical database lookup logic.
 */
app.get('/api/predict-delay/:runId', TrainSearchController.predictDelay);

/**
 * @route GET /api/departures/:stationId
 * @brief Compiles a virtual schedule arrival and departure billboard view tailored for an explicit station node.
 */
app.get('/api/departures/:stationId', StationBoardController.getDepartures);

/**
 * @route POST /api/recover-password
 * @brief Validates profile details to trigger security credential password recovery notification workflows.
 */
app.post('/api/recover-password', AuthController.recoverPassword);

// ==================== ROTTE PROTETTE ====================

/**
 * @brief Intercepts lifecycle execution to enforce authorization checks past this boundary point.
 * @details Validates bearer authorization headers against active cryptographic context structures.
 */
app.use(AuthController.authenticate); // da qui in avanti serve token

/**
 * @route GET /api/me
 * @brief Extracts the identity configuration attributes and authorization role parameters of the active caller.
 */
app.get('/api/me', UserController.getMe);

/**
 * @route GET /api/user/dashboard/:userId
 * @brief Compiles an administrative or personal panel view tracking valid user assets and historic profiles.
 */
app.get('/api/user/dashboard/:userId', UserController.getDashboard);

/**
 * @route GET /api/user/points
 * @brief Collects the current cumulative loyalty point metrics associated with the authenticated session holder.
 */
app.get('/api/user/points', UserController.getPoints);

/**
 * @route GET /api/seat-map/:runId
 * @brief Returns the grid array map visualization of available versus occupied vehicle cabin seating positions.
 */
app.get('/api/seat-map/:runId', TicketPurchaseController.getSeatMap);

/**
 * @route POST /api/purchase
 * @brief Handles financial authorization routing, points calculations, and booking generations for a chosen trip.
 */
app.post('/api/purchase', TicketPurchaseController.purchase);

/**
 * @route PUT /api/ticket
 * @brief Modifies existing booking dates or schedules subject to pre-departure time-lock limits.
 */
app.put('/api/ticket', UserController.modifyTicket);

/**
 * @route POST /api/change-password
 * @brief Changes account access credentials after verifying old security passwords match system records.
 */
app.post('/api/change-password', UserController.changePassword);

/**
 * @route POST /api/logout
 * @brief Deactivates authorization records to safely invalidate active session keys.
 */
app.post('/api/logout', UserController.logout);

/**
 * @route DELETE /api/account
 * @brief Purges account listings from data records if no active travel passes are left pending.
 */
app.delete('/api/account', UserController.deleteAccount);

/**
 * @route POST /api/validate
 * @brief Updates individual ticket state definitions from active to used upon transit personnel checks.
 */
app.post('/api/validate', InspectorController.validateTicket);

/**
 * @route GET /api/inspector/schedule/:inspectorId
 * @brief Pulls assigned duty structures and line operations rosters linked to specific employee signatures.
 */
app.get('/api/inspector/schedule/:inspectorId', InspectorController.getSchedule);

/**
 * @route GET /api/admin/stats
 * @brief Compiles analytical system business metrics including overall passenger totals, popular corridors, and revenues.
 */
app.get('/api/admin/stats', AdminController.getStats);

/**
 * @route POST /api/support
 * @brief Registers user feedback threads or operational technical issue descriptions for resolution queues.
 */
app.post('/api/support', SupportController.submit);

/**
 * @route GET /api/notifications
 * @brief Returns a collection of dispatch announcements and alert objects directed to the active customer.
 */
app.get('/api/notifications', NotificationController.getNotifications);

/**
 * @route PUT /api/notifications/:id/read
 * @brief Flags historical alert items to read states to remove unread notification signals.
 */
app.put('/api/notifications/:id/read', NotificationController.markAsRead);

/**
 * @route POST /api/subscription
 * @brief Processes payments and registers continuous pass durations on preferred routes.
 */
app.post('/api/subscription', SubscriptionController.purchase);

/**
 * @route POST /api/simulate-delay
 * @brief Adjusts scheduling records directly to reflect unexpected operational service offsets.
 */
app.post('/api/simulate-delay', AdminController.simulateDelay);

/**
 * @route GET /api/routes
 * @brief Exposes the dictionary collection tracking configured transit corridor routes across networks.
 */
app.get('/api/routes', SubscriptionController.getRoutes);

/**
 * @route GET /api/debug
 * @brief Diagnostics checkpoint endpoint transmitting metrics on stored profile numbers and active session maps.
 */
app.get('/api/debug', (req, res) => {
    const db = readDB();
    res.json({ stationsCount: db.stations.length, sessionsCount: AuthController.sessionCount() });
});

/**
 * @route GET /api/subscription-price
 * @brief Resolves mathematical calculation grids to return tier pricing rates for standard recurring memberships.
 */
app.get('/api/subscription-price', SubscriptionController.getPrice);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin: matteo.golinelli-1@studenti.unitn.it  / password`);
    console.log(`🧪 User: virginia.ancora@studenti.unitn.it / password`);
    console.log(`🧪 User: caterina.alessi@studenti.unitn.it / password`);
    console.log(`🧪 Inspector: robin.bertolini@studenti.unitn.it / password`);
});