import { readDB } from '../database/db.js';

/**
 * @const UserDashboardController
 * @brief Controller object tasked with compiling and delivering summary metrics for an individual customer panel.
 * @details Queries active database segments to reconstruct comprehensive passenger contexts, aggregating active
 * travel itineraries alongside historical purchase configurations and incentive records.
 */
export const UserDashboardController = {
    /**
     * @brief Builds a complete dashboard data object containing valid passes, expired history, and loyalty parameters.
     * @details Searches matching user records before extracting operational ticket sub-states. Iterates through linked 
     * train runs, track stops, and geographical station properties to format legible terminal station locations.
     * @param {number} userId - Explicit target identifier pointing to the active profile entry.
     * @return {Object} An object holding historical summaries and active ticket listings, or error structures.
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