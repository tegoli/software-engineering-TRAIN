import { readDB } from '../database/db.js';
import { calculatePrice } from '../utils/geo.js';

/**
 * @brief Predicts how late a train might be.
 * @details Looks for historical delay data for this run. If there is none,
 * returns a random number between 0 and 30 as a fallback.
 * @param {number} runId - The ID of the train run.
 * @param {Object} db - The database object.
 * @return {number} The predicted delay in minutes.
 */
function getDelayPrediction(runId, db) {
    const predictions = db.delayPredictions || [];
    const historical = predictions.filter(dp => dp.runId === runId).map(dp => dp.predictedDelayMinutes);
    if (historical.length) {
        return historical[Math.floor(Math.random() * historical.length)];
    }
    return Math.floor(Math.random() * 31);
}

/**
 * @const TrainSearchController
 * @brief Handles train search, status checks and delay predictions.
 * @details Searches for direct trains and routes with one transfer, gets live train status,
 * and predicts delays based on historical data.
 */
export const TrainSearchController = {
    /**
     * @brief Searches for direct trains between two stations.
     * @details Finds matching train runs for the given date and travel class,
     * calculates duration, price, delay probability and crowding.
     * @param {Object} req - Express request with departureStationName, arrivalStationName, date and travelClass.
     * @param {Object} res - Express response object.
     * @return {Object|void} Returns the list of trains found, or an empty array.
     */
    search(req, res) {
        const { departureStationName, arrivalStationName, date, travelClass } = req.body;
        const db = readDB();
        const fromStation = db.stations.find(s => s.name.toLowerCase() === departureStationName.toLowerCase());
        const toStation = db.stations.find(s => s.name.toLowerCase() === arrivalStationName.toLowerCase());
        if (!fromStation || !toStation) return res.json({ trains: [] });
        const searchDate = new Date(date);
        const results = [];
        for (const run of db.trainRuns) {
            const route = db.routes.find(r => r.routeId === run.routeId);
            if (!route) continue;
            const fromStop = route.stops.find(stop => stop.stationId === fromStation.stationId);
            const toStop = route.stops.find(stop => stop.stationId === toStation.stationId);
            if (!fromStop || !toStop || fromStop.stopOrder >= toStop.stopOrder) continue;
            const runDate = new Date(run.departureDateTime);
            if (runDate.toDateString() !== searchDate.toDateString()) continue;
            if (run.status === 'cancelled') continue;
            const train = db.trains.find(t => t.trainId === run.trainId);
            if (!train) continue;
            if (!train.serviceClasses.includes(travelClass)) continue;

            const departureDateTime = new Date(runDate);
            const [depHour, depMin] = fromStop.scheduledDeparture.split(':');
            departureDateTime.setHours(parseInt(depHour), parseInt(depMin), 0);
            const arrivalDateTime = new Date(runDate);
            const [arrHour, arrMin] = toStop.scheduledArrival.split(':');
            arrivalDateTime.setHours(parseInt(arrHour), parseInt(arrMin), 0);
            if (arrivalDateTime < departureDateTime) arrivalDateTime.setDate(arrivalDateTime.setDate() + 1);
            const durationMs = arrivalDateTime - departureDateTime;
            const durationMinutes = Math.round(durationMs / 60000);
            const price = calculatePrice(fromStation, toStation, travelClass, train.trainType);
            const currentDelay = run.currentDelayMinutes || 0;
            const predictedDelay = getDelayPrediction(run.runId, db);
            // Calcolo probabilità ritardo e affollamento (semplificato)
            let totalSeats = 0;
            if (train.coaches && train.coaches.length) {
                totalSeats = train.coaches.reduce((sum, c) => sum + (c.totalSeats || 0), 0);
            } else {
                totalSeats = 60;
            }
            const occupancySnapshots = db.occupancySnapshots ? db.occupancySnapshots.filter(o => o.runId === run.runId) : [];
            const occupiedSeats = occupancySnapshots.reduce((sum, o) => sum + (o.occupiedSeats || 0), 0);
            const crowdingProbability = totalSeats > 0 ? Math.min(100, Math.round((occupiedSeats / totalSeats) * 100)) : 0;
            const delayProbability = run.status === 'delayed' ? Math.min(80, 20 + (run.currentDelayMinutes || 0)) : Math.max(0, 5 - (run.currentDelayMinutes || 0));

            results.push({
                id: run.runId, from: fromStation.name, to: toStation.name,
                departureTime: departureDateTime.toISOString(),
                arrivalTime: arrivalDateTime.toISOString(),
                duration: `${Math.floor(durationMinutes/60)}h ${durationMinutes%60}m`,
                price, trainType: train.trainType, trainCode: train.trainCode, travelClass,
                delayProbability, crowdingProbability, currentDelay,
                predictedDelay
            });
        }
        res.json({ trains: results });
    },

    /**
     * @brief Searches for trains including routes with one transfer.
     * @details Finds direct trains first, then looks for routes with a change
     * at an intermediate station. Requires a transfer window of 20 to 120 minutes.
     * Results are sorted by departure time.
     * @param {Object} req - Express request with departureStationName, arrivalStationName, date, travelClass and maxTransfers.
     * @param {Object} res - Express response object.
     * @return {Object|void} Returns the list of trains found, or an empty array.
     */
    searchAdvanced(req, res) {
        const { departureStationName, arrivalStationName, date, travelClass, maxTransfers = 1 } = req.body;
        const db = readDB();

        const fromStation = db.stations.find(s => s.name.toLowerCase() === departureStationName.toLowerCase());
        const toStation = db.stations.find(s => s.name.toLowerCase() === arrivalStationName.toLowerCase());
        if (!fromStation || !toStation) return res.json({ trains: [] });

        const searchDate = new Date(date);
        if (isNaN(searchDate)) return res.json({ trains: [] });

        const results = [];

        // Tratte dirette
        for (const run of db.trainRuns) {
            const route = db.routes.find(r => r.routeId === run.routeId);
            if (!route) continue;
            const fromStop = route.stops.find(stop => stop.stationId === fromStation.stationId);
            const toStop = route.stops.find(stop => stop.stationId === toStation.stationId);
            if (!fromStop || !toStop || fromStop.stopOrder >= toStop.stopOrder) continue;
            const runDate = new Date(run.departureDateTime);
            if (runDate.toDateString() !== searchDate.toDateString()) continue;
            if (run.status === 'cancelled') continue;
            const train = db.trains.find(t => t.trainId === run.trainId);
            if (!train) continue;
            if (!train.serviceClasses.includes(travelClass)) continue;

            const departureDateTime = new Date(runDate);
            const [depHour, depMin] = fromStop.scheduledDeparture.split(':');
            departureDateTime.setHours(parseInt(depHour), parseInt(depMin), 0);
            const arrivalDateTime = new Date(runDate);
            const [arrHour, arrMin] = toStop.scheduledArrival.split(':');
            arrivalDateTime.setHours(parseInt(arrHour), parseInt(arrMin), 0);
            if (arrivalDateTime < departureDateTime) arrivalDateTime.setDate(arrivalDateTime.setDate() + 1);

            const durationMs = arrivalDateTime - departureDateTime;
            const durationMinutes = Math.round(durationMs / 60000);
            const price = calculatePrice(fromStation, toStation, travelClass, train.trainType);

            let totalSeats = 0;
            if (train.coaches && train.coaches.length) {
                totalSeats = train.coaches.reduce((sum, c) => sum + (c.totalSeats || 0), 0);
            } else {
                totalSeats = 60;
            }
            const occupancySnapshots = db.occupancySnapshots ? db.occupancySnapshots.filter(o => o.runId === run.runId) : [];
            const occupiedSeats = occupancySnapshots.reduce((sum, o) => sum + (o.occupiedSeats || 0), 0);
            const crowdingProbability = totalSeats > 0 ? Math.min(100, Math.round((occupiedSeats / totalSeats) * 100)) : 0;
            const delayProbability = run.status === 'delayed' ? Math.min(80, 20 + (run.currentDelayMinutes || 0)) : Math.max(0, 5 - (run.currentDelayMinutes || 0));

            results.push({
                id: run.runId, from: fromStation.name, to: toStation.name,
                departureTime: departureDateTime.toISOString(),
                arrivalTime: arrivalDateTime.toISOString(),
                durationMinutes, duration: `${Math.floor(durationMinutes/60)}h ${durationMinutes%60}m`,
                price, trainCode: train.trainCode, trainType: train.trainType, travelClass,
                transfers: 0, transferStation: null, transferDuration: null,
                delayProbability, crowdingProbability,
                segments: [{
                    runId: run.runId, trainCode: train.trainCode,
                    from: fromStation.name, to: toStation.name,
                    departureTime: departureDateTime.toISOString(),
                    arrivalTime: arrivalDateTime.toISOString(),
                    durationMinutes,
                    delayProbability, crowdingProbability
                }]
            });
        }

        // Con cambio (max 1)
        if (maxTransfers >= 1) {
            for (const intermediate of db.stations) {
                if (intermediate.stationId === fromStation.stationId || intermediate.stationId === toStation.stationId) continue;
                const leg1Options = [];
                for (const run of db.trainRuns) {
                    const route = db.routes.find(r => r.routeId === run.routeId);
                    if (!route) continue;
                    const fromStop = route.stops.find(s => s.stationId === fromStation.stationId);
                    const toStop = route.stops.find(s => s.stationId === intermediate.stationId);
                    if (!fromStop || !toStop || fromStop.stopOrder >= toStop.stopOrder) continue;
                    const runDate = new Date(run.departureDateTime);
                    if (runDate.toDateString() !== searchDate.toDateString()) continue;
                    if (run.status === 'cancelled') continue;
                    const train = db.trains.find(t => t.trainId === run.trainId);
                    if (!train) continue;
                    if (!train.serviceClasses.includes(travelClass)) continue;
                    const depTime = new Date(runDate);
                    const [depHour, depMin] = fromStop.scheduledDeparture.split(':');
                    depTime.setHours(parseInt(depHour), parseInt(depMin), 0);
                    const arrTime = new Date(runDate);
                    const [arrHour, arrMin] = toStop.scheduledArrival.split(':');
                    arrTime.setHours(parseInt(arrHour), parseInt(arrMin), 0);
                    if (arrTime < depTime) arrTime.setDate(arrTime.getDate() + 1);
                    const duration = (arrTime - depTime) / 60000;
                    const price = calculatePrice(fromStation, intermediate, travelClass, train.trainType);
                    let totalSeats = 0;
                    if (train.coaches && train.coaches.length) {
                        totalSeats = train.coaches.reduce((sum, c) => sum + (c.totalSeats || 0), 0);
                    } else {
                        totalSeats = 60;
                    }
                    const occupancySnapshots = db.occupancySnapshots ? db.occupancySnapshots.filter(o => o.runId === run.runId) : [];
                    const occupiedSeats = occupancySnapshots.reduce((sum, o) => sum + (o.occupiedSeats || 0), 0);
                    const crowding = totalSeats > 0 ? Math.min(100, Math.round((occupiedSeats / totalSeats) * 100)) : 0;
                    const delay = run.status === 'delayed' ? Math.min(80, 20 + (run.currentDelayMinutes || 0)) : Math.max(0, 5 - (run.currentDelayMinutes || 0));
                    leg1Options.push({
                        runId: run.runId, trainCode: train.trainCode,
                        from: fromStation.name, to: intermediate.name,
                        departureTime: depTime, arrivalTime: arrTime,
                        durationMinutes: duration, price,
                        delayProbability: delay, crowdingProbability: crowding
                    });
                }
                const leg2Options = [];
                for (const run of db.trainRuns) {
                    const route = db.routes.find(r => r.routeId === run.routeId);
                    if (!route) continue;
                    const fromStop = route.stops.find(s => s.stationId === intermediate.stationId);
                    const toStop = route.stops.find(s => s.stationId === toStation.stationId);
                    if (!fromStop || !toStop || fromStop.stopOrder >= toStop.stopOrder) continue;
                    const runDate = new Date(run.departureDateTime);
                    if (runDate.toDateString() !== searchDate.toDateString()) continue;
                    if (run.status === 'cancelled') continue;
                    const train = db.trains.find(t => t.trainId === run.trainId);
                    if (!train) continue;
                    if (!train.serviceClasses.includes(travelClass)) continue;
                    const depTime = new Date(runDate);
                    const [depHour, depMin] = fromStop.scheduledDeparture.split(':');
                    depTime.setHours(parseInt(depHour), parseInt(depMin), 0);
                    const arrTime = new Date(runDate);
                    const [arrHour, arrMin] = toStop.scheduledArrival.split(':');
                    arrTime.setHours(parseInt(arrHour), parseInt(arrMin), 0);
                    if (arrTime < depTime) arrTime.setDate(arrTime.getDate() + 1);
                    const duration = (arrTime - depTime) / 60000;
                    const price = calculatePrice(intermediate, toStation, travelClass, train.trainType);
                    let totalSeats = 0;
                    if (train.coaches && train.coaches.length) {
                        totalSeats = train.coaches.reduce((sum, c) => sum + (c.totalSeats || 0), 0);
                    } else {
                        totalSeats = 60;
                    }
                    const occupancySnapshots = db.occupancySnapshots ? db.occupancySnapshots.filter(o => o.runId === run.runId) : [];
                    const occupiedSeats = occupancySnapshots.reduce((sum, o) => sum + (o.occupiedSeats || 0), 0);
                    const crowding = totalSeats > 0 ? Math.min(100, Math.round((occupiedSeats / totalSeats) * 100)) : 0;
                    const delay = run.status === 'delayed' ? Math.min(80, 20 + (run.currentDelayMinutes || 0)) : Math.max(0, 5 - (run.currentDelayMinutes || 0));
                    leg2Options.push({
                        runId: run.runId, trainCode: train.trainCode,
                        from: intermediate.name, to: toStation.name,
                        departureTime: depTime, arrivalTime: arrTime,
                        durationMinutes: duration, price,
                        delayProbability: delay, crowdingProbability: crowding
                    });
                }
                for (const leg1 of leg1Options) {
                    for (const leg2 of leg2Options) {
                        const transferWait = (leg2.departureTime - leg1.arrivalTime) / 60000;
                        if (transferWait >= 20 && transferWait <= 120) {
                            const totalDuration = leg1.durationMinutes + leg2.durationMinutes + transferWait;
                            const totalPrice = leg1.price + leg2.price;
                            const delayProbability = Math.max(leg1.delayProbability || 0, leg2.delayProbability || 0);
                            const crowdingProbability = Math.max(leg1.crowdingProbability || 0, leg2.crowdingProbability || 0);
                            results.push({
                                id: null, from: fromStation.name, to: toStation.name,
                                departureTime: leg1.departureTime.toISOString(),
                                arrivalTime: leg2.arrivalTime.toISOString(),
                                durationMinutes: totalDuration,
                                duration: `${Math.floor(totalDuration/60)}h ${totalDuration%60}m`,
                                price: totalPrice,
                                trainCode: `${leg1.trainCode} → ${leg2.trainCode}`,
                                trainType: 'Con cambio',
                                travelClass: travelClass,
                                transfers: 1,
                                transferStation: intermediate.name,
                                transferDuration: Math.round(transferWait),
                                segments: [leg1, leg2],
                                delayProbability,
                                crowdingProbability
                            });
                        }
                    }
                }
            }
        }
        results.sort((a,b) => new Date(a.departureTime) - new Date(b.departureTime));
        res.json({ trains: results });
    },

    /**
     * @brief Gets the current status of a train run.
     * @details Returns the train code, delay, next station and scheduled arrival for a given runId.
     * @param {Object} req - Express request with runId as a route parameter.
     * @param {Object} res - Express response object.
     * @return {Object|void} 404 if the run is not found, otherwise the status data.
     */
    getTrainStatus(req, res) {
        const runId = parseInt(req.params.runId);
        const db = readDB();
        const run = db.trainRuns.find(r => r.runId === runId);
        if (!run) return res.status(404).json({ error: 'Treno non trovato' });
        const train = db.trains.find(t => t.trainId === run.trainId);
        if (!train) return res.status(404).json({ error: 'Train not found' });
        const route = db.routes.find(r => r.routeId === run.routeId);
        const currentStopIndex = run.actualDeparture ? 1 : 0;
        const nextStop = route?.stops[currentStopIndex];
        const nextStation = nextStop ? db.stations.find(s => s.stationId === nextStop.stationId) : null;
        res.json({
            runId: run.runId, trainCode: train.trainCode, status: run.status,
            currentDelay: run.currentDelayMinutes, lastUpdate: new Date().toISOString(),
            nextStation: nextStation?.name || 'Termine', scheduledArrival: nextStop?.scheduledArrival || '--:--'
        });
    },

    /**
     * @brief Predicts the delay for a given train run.
     * @details Uses historical data or a random estimate to predict how late the train will be.
     * @param {Object} req - Express request with runId as a route parameter.
     * @param {Object} res - Express response object.
     * @return {Object|void} 404 if the run is not found, otherwise the delay prediction.
     */
    predictDelay(req, res) {
        const runId = parseInt(req.params.runId);
        const db = readDB();
        const run = db.trainRuns.find(r => r.runId === runId);
        if (!run) return res.status(404).json({ error: 'Run non trovato' });
        const predictedDelay = getDelayPrediction(runId, db);
        res.json({
            runId: run.runId,
            trainCode: db.trains.find(t => t.trainId === run.trainId)?.trainCode,
            predictedDelayMinutes: predictedDelay,
            confidence: 0.7 + Math.random() * 0.25,
            basedOn: 'dati limitati'
        });
    }
};