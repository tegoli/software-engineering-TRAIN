import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { AuthController } from './src/controllers/AuthController.js';
import { AccountController } from './src/controllers/AccountController.js';
import { TrainSearchController } from './src/controllers/TrainSearchController.js';
import { TicketPurchaseController } from './src/controllers/TicketPurchaseController.js';
import { TicketManagementController } from './src/controllers/TicketManagementController.js';
import { ValidationController } from './src/controllers/ValidationController.js';
import { StatisticsController } from './src/controllers/StatisticsController.js';
import { NotificationController } from './src/controllers/NotificationController.js';
import { ScheduleController } from './src/controllers/ScheduleController.js';
import { LanguageController } from './src/controllers/LanguageController.js';
import { ApplicationInterface } from './src/controllers/ApplicationInterface.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inizializzazione (stub)
const authController = new AuthController();
const accountController = new AccountController();
const trainSearchController = new TrainSearchController();
const purchaseController = new TicketPurchaseController();
const ticketMgmtController = new TicketManagementController();
const validationController = new ValidationController();
const statsController = new StatisticsController();
const notifController = new NotificationController();
const scheduleController = new ScheduleController();
const langController = new LanguageController();
const appInterface = new ApplicationInterface();

// -------------------- API ROUTES (stub di test) --------------------
app.post('/api/login', (req, res) => {
    authController.login(req.body.email, req.body.password);
    res.json({ success: true, message: 'Login OK' });
});

app.post('/api/register', (req, res) => {
    authController.register(req.body.name, req.body.email, req.body.password);
    res.json({ success: true });
});

app.post('/api/search', (req, res) => {
    trainSearchController.search(req.body, false);
    res.json({ trains: [{ id: 1, from: 'Milano', to: 'Roma', time: '10:00' }] });
});

app.post('/api/purchase', (req, res) => {
    purchaseController.confirmPayment(req.body);
    res.json({ success: true, ticketId: 12345 });
});

app.post('/api/modify-ticket', (req, res) => {
    ticketMgmtController.confirmChange(req.body);
    res.json({ success: true });
});

app.post('/api/validate', (req, res) => {
    validationController.validateDocument(req.body.ticketId);
    res.json({ valid: true, message: 'Ticket valido' });
});

app.get('/api/stats', (req, res) => {
    statsController.viewStatistics();
    res.json({ revenue: 125000, bookings: 342 });
});

app.post('/api/notify-delay', (req, res) => {
    notifController.reportDelay(req.body.trainId, req.body.delayTime);
    res.json({ notified: true });
});

app.get('/api/schedule/:inspId', (req, res) => {
    scheduleController.viewSchedule(req.params.inspId);
    res.json({ shifts: [{ train: "IC501", time: "08:00" }] });
});

app.post('/api/language', (req, res) => {
    langController.selectLanguage(req.body.lang);
    res.json({ currentLang: req.body.lang });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});