import { readDB } from '../database/db.js';

/**
 * @const StatisticsController
 * @brief Controller object handling general platform auditing and high-level core business analytics.
 * @details Computes core operational KPIs for display across dashboard interfaces.
 */
export const StatisticsController = {
    /**
     * @brief Aggregates and returns primary system operational and financial performance indicators.
     * @details Computes cumulative platform revenues, total ticket reservations, delayed run statistics, 
     * and isolated numbers for active passenger profiles.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response target delivering the compiled business tracking object as JSON.
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