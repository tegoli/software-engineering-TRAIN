import { readDB, writeDB, createNotification } from '../database/db.js';

/**
 * @const AdminController
 * @brief Controller object handling analytics, reporting, and operational simulations for administrators.
 * @details Extracts detailed statistics regarding global metrics, subscriptions, station congestion, 
 * and handles infrastructure events like train delay simulations and corresponding notifications.
 */
export const AdminController = {
    /**
     * @brief Computes system-wide performance and engagement analytics metrics.
     * @details Collects revenue totals, active user counts, aggregate delay statistics, top 5 highest-selling 
     * ticket routes, top 5 busiest train stations based on active routes, and subscription metrics.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to deliver JSON analytics data.
     * @return {void}
     */
    getStats(req, res) {
        const db = readDB();
        const totalRevenue = db.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalBookings = db.tickets.length;
        const delayedRuns = db.trainRuns.filter(r => r.status === 'delayed').length;
        const activeUsers = db.users.filter(u => u.accountStatus === 'active' && u.role === 'passenger').length;

        // Statistiche biglietti (tratte più comprate)
        const routeCount = {};
        for (const ticket of db.tickets) {
            const run = db.trainRuns.find(r => r.runId === ticket.runId);
            if (run) {
                const route = db.routes.find(r => r.routeId === run.routeId);
                if (route) routeCount[route.routeName] = (routeCount[route.routeName] || 0) + 1;
            }
        }
        const topRoutes = Object.entries(routeCount).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,count])=>({ name, count }));

        // Stazioni più trafficate (biglietti)
        const stationCount = {};
        for (const run of db.trainRuns) {
            const route = db.routes.find(r => r.routeId === run.routeId);
            if (route) {
                for (const stop of route.stops) {
                    const station = db.stations.find(s => s.stationId === stop.stationId);
                    if (station) stationCount[station.name] = (stationCount[station.name] || 0) + 1;
                }
            }
        }
        const topStations = Object.entries(stationCount).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,count])=>({ name, count }));

        // STATISTICHE ABBONAMENTI
        const activeSubscriptions = db.subscriptions.filter(s => s.status === 'active').length;
        const subscriptionRouteCount = {};
        for (const sub of db.subscriptions) {
            const route = db.routes.find(r => r.routeId === sub.routeId);
            if (route) subscriptionRouteCount[route.routeName] = (subscriptionRouteCount[route.routeName] || 0) + 1;
        }
        const topSubscriptionRoutes = Object.entries(subscriptionRouteCount).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,count])=>({ name, count }));

        res.json({
            revenue: totalRevenue,
            bookings: totalBookings,
            delayedTrains: delayedRuns,
            activeUsers,
            topRoutes,
            topStations,
            activeSubscriptions,
            topSubscriptionRoutes
        });
    },

    /**
     * @brief Simulates an operational delay event for a target train run.
     * @details Updates the run record state to 'delayed' with the given minute payload, identifies active 
     * unique ticket-holders booked onto that specific run, triggers immediate internal system alerts, 
     * and logs a simulated notification email output.
     * @param {Object} req - Express request object containing `runId` and `delayMinutes` inside the body.
     * @param {Object} res - Express response object used to reply with error updates or operation summaries.
     * @return {Object|void} Sends a 404 response if the train run is invalid, otherwise sends a success confirmation.
     */
    simulateDelay(req, res) {
        const { runId, delayMinutes } = req.body;
        const db = readDB();
        const run = db.trainRuns.find(r => r.runId === runId);
        if (!run) return res.status(404).json({ success: false, error: 'Run non trovato' });
        run.status = 'delayed';
        run.currentDelayMinutes = delayMinutes;
        const train = db.trains.find(t => t.trainId === run.trainId);
        const affectedTickets = db.tickets.filter(t => t.runId === runId && t.status === 'active');
        const userIds = [...new Set(affectedTickets.map(t => t.userId))];
        for (const userId of userIds) {
            createNotification(userId, `Il treno della corsa ${runId} (${train?.trainCode || '?'}) ha un ritardo di ${delayMinutes} minuti.`, 'delay_alert');
            const user = db.users.find(u => u.userId === userId);
            console.log(`[SIMULAZIONE EMAIL] A ${user?.email}: Ritardo di ${delayMinutes} minuti sul treno ${train?.trainCode || '?'}`);
        }
        writeDB(db);
        res.json({ success: true, message: `Ritardo di ${delayMinutes} minuti simulato. Notifiche inviate a ${userIds.length} utenti.` });
    }
};