import { readDB } from '../database/db.js';

export const StatisticsController = {
    getStatistics(req, res) {
        const db = readDB();
        const totalRevenue = db.payments.reduce((sum, p) => sum + p.amount, 0);
        const totalBookings = db.tickets.length;
        const delayedRuns = db.trainRuns.filter(r => r.status === 'delayed').length;
        const activeUsers = db.users.filter(u => u.accountStatus === 'active' && u.role === 'passenger').length;
        res.json({
            revenue: totalRevenue,
            bookings: totalBookings,
            delayedTrains: delayedRuns,
            activeUsers
        });
    }
};