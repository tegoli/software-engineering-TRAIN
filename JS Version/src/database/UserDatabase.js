export class UserDatabase {
    createAccount(userData) { console.log('Creazione utente', userData); }
    updateCredentials(userId, newPass) { }
    hardDelete(userId) { }
    savePreference(userId, lang) { }
    retrieveData(type) { }
    requestFilters() { }
    applyFilters(filters) { }
    noData() { return false; }
    showErrorMessage() { console.log('Errore DB utenti'); }
}