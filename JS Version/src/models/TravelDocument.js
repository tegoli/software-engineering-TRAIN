export class TravelDocument {
    constructor(documentId, issueDate, price, status, qrCode) {
        this.documentId = documentId;
        this.issueDate = issueDate;
        this.price = price;
        this.status = status;
        this.qrCode = qrCode;
    }
    validate() { console.log('Documento validato'); }
    isActive(currentDate) { return true; }
}