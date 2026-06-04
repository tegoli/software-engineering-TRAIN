import { RegisteredUser } from './RegisteredUser.js';

export class TicketInspector extends RegisteredUser {
    constructor(...args) {
        super(...args);
        this.inspectorCode = '';
    }
    accessSystem() { }
    selectValidation() { }
    manualInput(ticketId) { }
    ticketData(ticketId) { }
    selectTrackOccupancy() { }
    updateOccupancy(coachNumber, nPassengers) { }
    viewSchedule(inputId) { }
}