export class ValidationController {
    accessSystem() { console.log('Accesso al sistema di validazione'); }
    selectValidation() { console.log('Seleziona validazione'); }
    requestData(ticketId) { console.log(`Richiesta dati biglietto ${ticketId}`); }
    ticketData(ticketId) { console.log(`Dati biglietto ${ticketId} ottenuti`); }
    manualInput(ticketId) { console.log(`Input manuale ${ticketId}`); }
    validateDocument(documentId) { console.log(`Valido documento ${documentId}`); }
    alreadyValid(ticketId) { return false; }
    valid(ticketId) { return true; }
    invalid(ticketId) { console.log(`Biglietto ${ticketId} invalido`); }
    updateOccupancy() { console.log('Aggiorna occupazione'); }
}