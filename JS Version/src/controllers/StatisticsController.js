export class StatisticsController {
    viewStatistics() { console.log('Visualizza statistiche'); }
    requestType() { console.log('Richiedi tipo statistiche'); }
    selectType(type) { console.log(`Tipo selezionato: ${type}`); }
    retrieveData(type, filters) { console.log(`Recupero dati per ${type}`, filters); }
    requestFilters() { console.log('Richiedi filtri'); }
    applyFilters() { console.log('Filtri applicati'); }
    noData() { return false; }
    showErrorMessage(message) { console.error(message); }
}