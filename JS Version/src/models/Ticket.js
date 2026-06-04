import { TravelDocument } from './TravelDocument.js';

export class Ticket extends TravelDocument {
    constructor(...args) {
        super(...args);
        this.ticketId = null;
        this.departureTime = null;
        this.arrivalTime = null;
        this.passengerType = null;
    }
    calculateTimeRemaining(currentTime) { return 0; }
    allowFullModification() { return false; }
    restrictToTimeOnly() { }
    updateTicket(newDetails) { }
}