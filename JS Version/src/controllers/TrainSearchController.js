import { readDB } from '../database/db.js';
import { calculatePrice } from '../utils/geo.js';

/**
 * @brief Evaluates statistical records to predict operational train delays.
 * @details Searches internal history logs for matching transit run signatures. If historical patterns are unavailable,
 * computes an algorithmic random variance fallback within a standardized range.
 * @param {number} runId - Unique identifier signature matching the target transit run execution.
 * @param {Object} db - The in-memory schema database instance structure.
 * @return {number} Calculated offset metric describing predicted delays in elapsed minutes.
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
 * @brief Controller object handling itinerary requests, direct train matching, transfer routing, and delay modeling.
 * @details Evaluates complex layout metrics such as seating densities, stop sequencing patterns, 
 * historical data snapshots, and transfer wait constraints to serve operational timelines.
 */
export const TrainSearchController = {
    /**
     * @brief Performs a standard direct transit lookup matching provided terminal names and service parameters.
     * @details Correlates path sequences, isolates specific daily operations, enforces seating class filters, 
     * computes total duration timelines across dynamic day limits, and evaluates structural crowding risks.
     * @param {Object} req - Express request holding payload keys for target stations, dates, and seating types.
     * @param {Object} res - Express response target delivering direct route options as a JSON data package.
     * @return {Object|void} Sends an empty configuration payload if destination matches fail, otherwise returns the filtered options.
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
     * @brief Executes an advanced itinerary matrix search assessing both direct routes and single-transfer connections.
     * @details Maps out two-legged paths by cross-checking potential intermediate transfer hubs. Filters path 
     * results according to custom transfer safety margins (e.g., 20 to 120 minutes), aggregates cumulative prices, 
     * and compiles the segments into a chronologically sorted Master List.
     * @param {Object} req - Express request object containing complex target station names, limits, and configurations.
     * @param {Object} res - Express response target delivering the compiled multi-segment tracking lists.
     * @return {Object|void} Sends an empty arrays index package if base stations fail identification parameters.
     */
    searchAdvanced(req, res) {
        // Copia esatta dal tuo app.js (ricerca con cambi)
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
     * @brief Pulls telemetry status properties for a unique in-transit train run.
     * @details Evaluates live parameters such as current delay thresholds, timestamp updates, 
     * next sequential transit station tags, and expected scheduled arrival metrics.
     * @param {Object} req - Express request holding param identifier configuration properties for `runId`.
     * @param {Object} res - Express response delivery map dispatching real-time journey logs or 404 flags.
     * @return {Object|void} Sends a 404 response structure if the transit identifier cannot be pinpointed.
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
     * @brief Serves predictive telemetry projections regarding arrival delays alongside calculation trust scores.
     * @details Evaluates target indices via the internal analytical helper context to estimate arrival offsets.
     * @param {Object} req - Express request holding target run configuration tags.
     * @param {Object} res - Express response target supplying the output statistics data body.
     * @return {Object|void} Sends a 404 response payload block if the matching route instance is not found.
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