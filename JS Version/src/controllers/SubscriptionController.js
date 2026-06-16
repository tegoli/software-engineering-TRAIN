import { readDB, writeDB, createNotification } from '../database/db.js';
import { calculatePrice } from '../utils/geo.js';

/**
 * @const SubscriptionController
 * @brief Handles subscription purchases, route listing and price calculation.
 * @details Manages the full subscription workflow: listing available routes,
 * computing prices based on distance, and processing purchases with loyalty points.
 */
export const SubscriptionController = {
    /**
     * @brief Lists all available routes with their start and end stations.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
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
     * @brief Calculates the price of a subscription.
     * @details Uses the Haversine distance to compute a monthly price,
     * then multiplies by the number of months.
     * @param {Object} req - Express request with routeId, months and class as query params.
     * @param {Object} res - Express response object.
     * @return {Object|void} 404 if the route is not found, otherwise the total price.
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
     * @brief Buys a subscription for a route.
     * @details Validates the user and route, calculates the price, creates the subscription
     * with start/end dates, awards loyalty points, and logs a payment.
     * @param {Object} req - Express request with routeId, durationMonths and travelClass.
     * @param {Object} res - Express response object.
     * @return {Object|void} 400 if validation fails, otherwise success with the subscription ID.
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