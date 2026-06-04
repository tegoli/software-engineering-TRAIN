export class AccountController {
    changePassword(oldPass, newPass) { console.log('Password cambiata'); }
    checkActiveBookings(userId) { return false; }
    confirmDeletion() { console.log('Conferma eliminazione'); }
    hardDelete(userId) { console.log(`Utente ${userId} eliminato`); }
    requestPasswordRecovery() { console.log('Recupero password richiesto'); }
    verifyIdentity(userId) { return true; }
    sendResetLink(email) { console.log(`Link reset inviato a ${email}`); }
    noData() { console.log('Nessun dato'); }
    showErrorMessage() { console.log('Errore'); }
}