import { readDB } from '../database/db.js';

/**
 * @const StationBoardController
 * @brief Handles departure boards for stations.
 * @details Returns a list of departures for a given station, sorted by departure time.
 */
export const StationBoardController = {
    /**
     * @brief Returns the departure board for a station.
     * @details Gets all train runs passing through the given station on the given date,
     * with train code, destination, scheduled time, track and delay info.
     * @param {Object} req - Express request with stationId as a route parameter and optional date query.
     * @param {Object} res - Express response object.
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
            if (!route) continue; 

            const stop = route.stops?.find(s => s.stationId === stationId && s.scheduledDeparture);
            if (!stop) continue; 

            const train = db.trains.find(t => t.trainId === run.trainId);
            if (!train) continue; 

            const stops = route.stops || [];
            if (stops.length === 0) continue; 
            const destinationStop = stops[stops.length - 1];
            const destStation = db.stations.find(s => s.stationId === destinationStop.stationId);
            const destinationName = destStation ? destStation.name : "Destinazione sconosciuta";

            // Add the departure
            departures.push({
                trainCode: train.trainCode || 'N/D',
                destination: destinationName,
                scheduledDeparture: stop.scheduledDeparture || '--',
                track: stop.trackNumber || '--',
                status: run.status || 'In orario',
                delay: run.currentDelayMinutes || 0
            });
        }

        departures.sort((a, b) => a.scheduledDeparture.localeCompare(b.scheduledDeparture));
        res.json(departures);
    }
};