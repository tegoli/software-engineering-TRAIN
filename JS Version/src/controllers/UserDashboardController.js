import { readDB } from '../database/db.js';

/**
 * @const UserDashboardController
 * @brief Builds dashboard data for a user.
 * @details Returns active tickets, booking history and loyalty points for a given user.
 */
export const UserDashboardController = {
    /**
     * @brief Gets the dashboard for a user.
     * @details Fetches the user's active tickets, booking history and loyalty points.
     * @param {number} userId - The ID of the user.
     * @return {Object} Dashboard data with activeTickets, history and loyaltyPoints, or an error.
     */
    getDashboard(userId) {
        const db = readDB();
        const user = db.users.find(u => u.userId === userId);
        if (!user) return { error: 'User not found' };

        const tickets = db.tickets.filter(t => t.userId === userId);
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

        return {
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
        };
    }
};