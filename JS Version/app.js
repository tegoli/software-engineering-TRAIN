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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

initDatabase();
seedDefaultUsers();

// ==================== ROTTE PUBBLICHE ====================
app.get('/api/stations', (req, res) => {
    res.json(getStations());
});

app.post('/api/language', AuthController.setLanguage);

app.post('/api/login', AuthController.login);
app.post('/api/register', AuthController.register);
app.post('/api/search', TrainSearchController.search);
app.post('/api/search-advanced', TrainSearchController.searchAdvanced);
app.get('/api/train-status/:runId', TrainSearchController.getTrainStatus);
app.get('/api/predict-delay/:runId', TrainSearchController.predictDelay);
app.get('/api/departures/:stationId', StationBoardController.getDepartures);
app.post('/api/recover-password', AuthController.recoverPassword);

// ==================== ROTTE PROTETTE ====================
app.use(AuthController.authenticate); // da qui in avanti serve token

app.get('/api/me', UserController.getMe);
app.get('/api/user/dashboard/:userId', UserController.getDashboard);
app.get('/api/user/points', UserController.getPoints);
app.get('/api/seat-map/:runId', TicketPurchaseController.getSeatMap);
app.post('/api/purchase', TicketPurchaseController.purchase);
app.put('/api/ticket', UserController.modifyTicket);
app.post('/api/change-password', UserController.changePassword);
app.post('/api/logout', UserController.logout);
app.delete('/api/account', UserController.deleteAccount);

app.post('/api/validate', InspectorController.validateTicket);
app.get('/api/inspector/schedule/:inspectorId', InspectorController.getSchedule);

app.get('/api/admin/stats', AdminController.getStats);

app.post('/api/support', SupportController.submit);

app.get('/api/notifications', NotificationController.getNotifications);
app.put('/api/notifications/:id/read', NotificationController.markAsRead);

app.post('/api/subscription', SubscriptionController.purchase);

app.post('/api/simulate-delay', AdminController.simulateDelay);
app.get('/api/routes', SubscriptionController.getRoutes);
app.get('/api/debug', (req, res) => {
    const db = readDB();
    res.json({ stationsCount: db.stations.length, sessionsCount: AuthController.sessionCount() });
});
app.get('/api/routes', SubscriptionController.getRoutes);
app.get('/api/subscription-price', SubscriptionController.getPrice);
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🔐 Admin: admin@railway.it / admin`);
    console.log(`🧪 Test: test@example.com / password`);
});