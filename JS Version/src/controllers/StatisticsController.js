import { readDB } from '../database/db.js';

/**
 * @const StatisticsController
 * @brief Handles basic statistics for the admin dashboard.
 * @details Computes total revenue, bookings, delayed trains and active users.
 */
export const StatisticsController = {
    /**
     * @brief Returns basic platform statistics.
     * @details Calculates total revenue from payments, number of bookings,
     * delayed train runs and active passenger accounts.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @return {void}
     */
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