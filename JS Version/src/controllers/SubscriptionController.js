import { readDB, writeDB, createNotification } from '../database/db.js';
import { calculatePrice } from '../utils/geo.js';

/**
 * @const SubscriptionController
 * @brief Controller object handling commuter subscriptions, pricing rules, and travel routes.
 * @details Manages queries for active routes, dynamic price forecasts based on geographical coordinate spans, 
 * and transactional purchasing workflows with associated loyalty program integrations.
 */
export const SubscriptionController = {
    /**
     * @brief Retrieves all available travel routes mapping their respective starting and terminal stations.
     * @details Searches the full collection of system routes and maps station identification numbers 
     * to descriptive physical station names.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response delivery map returning structured route summary arrays.
     * @return {void}
     */
    getRoutes(req, res) {
        const db = readDB();
        const routes = db.routes.map(route => ({
            routeId: route.routeId,
            name: route.routeName,
            fromStation: db.stations.find(s => s.stationId === route.stops[0].stationId)?.name,
            toStation: db.stations.find(s => s.stationId === route.stops[route.stops.length-1].stationId)?.name
        }));
        res.json(routes);
    },

    /**
     * @brief Computes estimated pricing attributes for subscription combinations before commitment.
     * @details Parses query strings for travel parameters, extracts endpoint station metadata, 
     * and relies on internal geometric calculations to multiply regional base rates across the selected duration.
     * @param {Object} req - Express request object housing `routeId`, `months`, and `class` query tags.
     * @param {Object} res - Express response target dispatching calculated price data or 404 notifications.
     * @return {Object|void} Sends a 404 response if the route is invalid, otherwise returns the computed total price.
     */
    getPrice(req, res) {
        const { routeId, months, class: travelClass } = req.query;
        const db = readDB();
        const route = db.routes.find(r => r.routeId === parseInt(routeId));
        if (!route) return res.status(404).json({ error: 'Tratta non trovata' });
        const fromStation = db.stations.find(s => s.stationId === route.stops[0].stationId);
        const toStation = db.stations.find(s => s.stationId === route.stops[route.stops.length-1].stationId);
        const monthlyPrice = calculatePrice(fromStation, toStation, travelClass, 'Regionale');
        const totalPrice = monthlyPrice * parseInt(months);
        res.json({ price: totalPrice });
    },

    /**
     * @brief Processes purchases for travel subscriptions and creates payment logs.
     * @details Performs validation checks on user profiles and route endpoints, calculates final prices, 
     * generates date ranges, creates unique scan tracking QR codes, credits customer loyalty balances, 
     * logs completed transactional payment details, and triggers confirmation alerts.
     * @param {Object} req - Express request payload carrying `routeId`, `durationMonths`, and `travelClass`.
     * @param {Object} res - Express response endpoint providing transaction logs or error descriptors.
     * @return {Object|void} Sends a 400 response on verification constraints, or a success message upon completion.
     */
    purchase(req, res) {
        const { routeId, durationMonths, travelClass } = req.body;
        const userId = req.user.userId;
        const db = readDB();

        const user = db.users.find(u => u.userId === userId);
        if (!user) return res.status(400).json({ success: false, message: 'Utente non valido' });

        // Assicurati che routeId sia un numero
        const parsedRouteId = parseInt(routeId);
        const route = db.routes.find(r => r.routeId === parsedRouteId);
        if (!route) {
            const availableRoutes = db.routes.map(r => `${r.routeId}: ${r.routeName}`).join(', ');
            console.error(`Route not found: ${routeId} (parsed: ${parsedRouteId}). Available: ${availableRoutes}`);
            return res.status(400).json({
                success: false,
                message: `Tratta con ID ${routeId} non trovata. Tratte disponibili: ${availableRoutes}`
            });
        }

        const fromStation = db.stations.find(s => s.stationId === route.stops[0].stationId);
        const toStation = db.stations.find(s => s.stationId === route.stops[route.stops.length-1].stationId);
        const monthlyPrice = calculatePrice(fromStation, toStation, travelClass, 'Regionale');
        const totalPrice = monthlyPrice * durationMonths;

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + durationMonths);

        const newSubId = Math.max(...db.subscriptions.map(s => s.subscriptionId), 0) + 1;
        const subscription = {
            subscriptionId: newSubId,
            userId,
            routeId: parsedRouteId,
            startDate: startDate.toISOString().slice(0,10),
            endDate: endDate.toISOString().slice(0,10),
            class: travelClass,
            price: totalPrice,
            status: 'active',
            qrCode: `SUB${newSubId}${Math.random().toString(36).substring(2,8)}`
        };
        db.subscriptions.push(subscription);

        const pointsEarned = Math.floor(totalPrice);
        user.loyaltyPoints += pointsEarned;
        db.loyaltyTransactions.push({
            transactionId: Math.max(...db.loyaltyTransactions.map(l => l.transactionId), 0) + 1,
            userId,
            points: pointsEarned,
            reason: `Acquisto abbonamento #${newSubId}`,
            date: new Date().toISOString()
        });

        db.payments.push({
            paymentId: Math.max(...db.payments.map(p => p.paymentId), 0) + 1,
            userId,
            subscriptionId: newSubId,
            amount: totalPrice,
            paymentDate: new Date().toISOString(),
            paymentMethod: 'Carta di credito (simulata)',
            status: 'completed'
        });

        createNotification(userId, `Abbonamento #${newSubId} (${route.routeName}) acquistato con successo. Valido fino al ${endDate.toLocaleDateString()}. Prezzo: €${totalPrice.toFixed(2)}`, 'subscription');
        writeDB(db);
        res.json({ success: true, subscriptionId: newSubId });
    }
};