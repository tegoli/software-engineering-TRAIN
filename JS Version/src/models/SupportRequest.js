export class SupportRequest {
    constructor(requestId, requestType, description, status, creationDate) {
        this.requestId = requestId;
        this.requestType = requestType;
        this.description = description;
        this.status = status;
        this.creationDate = creationDate;
    }
    submit() { console.log('Richiesta supporto inviata'); }
    close() { this.status = 'CLOSED'; }
}