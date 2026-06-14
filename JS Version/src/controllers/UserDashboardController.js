import { readDB } from '../database/db.js';

export const UserDashboardController = {
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