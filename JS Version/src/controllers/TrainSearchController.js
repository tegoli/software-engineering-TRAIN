export class TrainSearchController {
    search(criteria, mapOpt) { console.log('Ricerca treni', criteria); }
    resolve(coords) { console.log('Risolvi coordinate', coords); }
    queryTrains(stationCodes, date, travelClass) { }
    getDelayPredictions(trainIds) { return []; }
    displayResults(trainList, predictions) { }
    requestLiveBoard(stationName) { }
    refreshData() { }
    requestTrainStatus(trainId) { }
}