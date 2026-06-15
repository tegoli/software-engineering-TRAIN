import { readDB } from '../database/db.js';

/**
 * @const StationBoardController
 * @brief Controller object handling operational tracking boards for physical train stations.
 * @details Computes scheduling tables dynamically to mimic real-time physical arrival and departure monitors.
 */
export const StationBoardController = {
    /**
     * @brief Generates a chronological list of train departures for a specific station and date.
     * @details Extracts individual transit stop sequences, maps endpoint destination terminals, attaches delay 
     * profiles, and applies alphabetical sorting based on targeted timing variables.
     * @param {Object} req - Express request object containing path parameter `stationId` and an optional `date` query variable.
     * @param {Object} res - Express response delivery map returning structured board configuration arrays.
     * @return {void}
     */
    getDepartures(req, res) {
        const stationId = parseInt(req.params.stationId);
        const requestedDate = req.query.date || new Date().toISOString().slice(0,10);
        const db = readDB();
        const departures = [];
        for (const run of db.trainRuns) {
            if (run.departureDateTime.slice(0,10) !== requestedDate) continue;
            const route = db.routes.find(r => r.routeId === run.routeId);
            const stop = route?.stops.find(s => s.stationId === stationId && s.scheduledDeparture);
            if (!stop) continue;
            const train = db.trains.find(t => t.trainId === run.trainId);
            const destinationStop = route.stops[route.stops.length-1];
            const destStation = db.stations.find(s => s.stationId === destinationStop.stationId);
            departures.push({
                trainCode: train.trainCode,
                destination: destStation.name,
                scheduledDeparture: stop.scheduledDeparture,
                track: stop.trackNumber,
                status: run.status,
                delay: run.currentDelayMinutes || 0
            });
        }
        departures.sort((a,b) => a.scheduledDeparture.localeCompare(b.scheduledDeparture));
        res.json(departures);
    }
};