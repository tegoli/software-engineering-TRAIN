import { readDB } from '../database/db.js';

/**
 * @const ScheduleController
 * @brief Controller object handling shift management and roster lookups for internal staff members.
 * @details Provides interfaces to securely fetch and cross-reference operational duties with relevant transport assets.
 */
export const ScheduleController = {
    /**
     * @brief Retrieves and contextually enriches the active work shift calendar for a targeted staff member.
     * @details Validates identity mappings to ensure the active requester matches the requested employee data context.
     * Searches database structures, maps associated train run vectors, handles route descriptions, and aggregates active rolling stock designations.
     * @param {Object} req - Express request object housing the routing parameter `inspectorId` alongside token authorization boundaries.
     * @param {Object} res - Express response delivery map handling error outputs or providing data arrays.
     * @return {Object|void} Sends a 403 response if identity ownership bounds are violated, otherwise dispatches shifts array.
     */
    getSchedule(req, res) {
        const inspectorId = parseInt(req.params.inspectorId);
        if (req.user.userId !== inspectorId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const db = readDB();
        const shifts = db.shiftSchedules.filter(s => s.staffId === inspectorId);
        const enriched = shifts.map(s => {
            const run = db.trainRuns.find(r => r.runId === s.trainRunId);
            const route = db.routes.find(r => r.routeId === run?.routeId);
            const train = db.trains.find(t => t.trainId === run?.trainId);
            return {
                date: s.date,
                startTime: s.startTime,
                endTime: s.endTime,
                route: s.assignedRoute,
                trainCode: train?.trainCode,
                trainType: train?.trainType
            };
        });
        res.json({ shifts: enriched });
    }
};