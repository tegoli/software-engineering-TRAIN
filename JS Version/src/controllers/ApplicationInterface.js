export class ApplicationInterface {
    displayDashboard(stats) { console.log('Dashboard mostrata', stats); }
    displayData(data, filters) { console.log('Dati filtrati', data); }
    showError(message) { console.error(message); }
    showConfirmation(message) { return confirm(message); } // solo browser
    updatedUI(lang) { console.log(`UI aggiornata a ${lang}`); }
}