import { readDB } from '../database/db.js';

export const StationBoardController = {
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