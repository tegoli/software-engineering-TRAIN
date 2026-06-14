import { RegisteredUser } from './RegisteredUser.js';
import { TicketPurchaseController } from '../controllers/TicketPurchaseController.js';
import { getDashboard } from '../controllers/UserDashboardController.js';

export class Passenger extends RegisteredUser {
    /** @type {number} */ loyaltyPoints;

    selectTrainOptions(criteria) {
        return TicketPurchaseController.preparePurchase(criteria);
    }

    async confirmPayment(details) {
        return TicketPurchaseController.processPayment(details);
    }

    selectTicketModify(ticketId) {
        return TicketManagementController.getTicketForModify(ticketId);
    }

    async confirmChange(newDetails) {
        return TicketManagementController.updateTicket(newDetails);
    }

    async requestTrainStatus(trainId) {
        return TrainSearchController.getTrainStatus(trainId);
    }

    async contactCustomerService(text) {
        return SupportController.submitRequest(this.userId, text);
    }

    viewBookingHistory() {
        return getDashboard(this.userId).history;
    }

    viewLoyaltyPointsBalance() {
        return this.loyaltyPoints;
    }
}