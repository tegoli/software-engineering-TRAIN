export class NotificationController {
    reportDelay(trainId, delayTime) { console.log(`Ritardo segnalato per treno ${trainId}: ${delayTime} min`); }
    getAffectedUsers(trainId) { console.log(`Utenti affetti da treno ${trainId}`); }
    pushInAppAlert(userId, message) { console.log(`Alert in-app a ${userId}: ${message}`); }
    sendEmailNotification(email, message) { console.log(`Email a ${email}: ${message}`); }
    manualInput(ticketId) { console.log(`Input manuale biglietto ${ticketId}`); }
    validateDocument(documentId) { console.log(`Documento ${documentId} validato`); }
    alreadyValid(ticketId) { return false; }
    invalid(ticketId) { console.log(`Biglietto ${ticketId} non valido`); }
    updateOccupancy(nCoach, nPassengers) { console.log(`Occupazione coach ${nCoach}: ${nPassengers} passeggeri`); }
}