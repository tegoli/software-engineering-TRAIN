import { RegisteredUser } from './RegisteredUser.js';

export class Passenger extends RegisteredUser {
    constructor(...args) {
        super(...args);
        this.loyaltyPoints = 0;
    }
    selectTrainOptions(criteria) { }
    confirmPayment(details) { }
    selectTicketModify(ticketId) { }
    confirmChange(newDetails) { }
    requestTrainStatus(trainId) { }
    contactCustomerService(text) { }
    viewBookingHistory() { }
    viewLoyaltyPointsBalance() { }
}