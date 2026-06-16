import { readDB } from '../database/db.js';

/**
 * @const ScheduleController
 * @brief Handles inspector shift schedules.
 * @details Returns the work schedule for a specific inspector, enriched with train info.
 */
export const ScheduleController = {
    /**
     * @brief Gets the shift schedule for an inspector.
     * @details Checks that the requester is the inspector themselves, then returns
     * their shifts with train and route details.
     * @param {Object} req - Express request with inspectorId as a route parameter.
     * @param {Object} res - Express response object.
     * @return {Object|void} 403 if not authorized, otherwise the list of shifts.
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