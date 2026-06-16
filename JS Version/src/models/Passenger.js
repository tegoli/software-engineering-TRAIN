import { RegisteredUser } from './RegisteredUser.js';
import { TicketPurchaseController } from '../controllers/TicketPurchaseController.js';
import { getDashboard } from '../controllers/UserDashboardController.js';

/**
 * @class Passenger
 * @extends RegisteredUser
 * @brief A user who buys train tickets and uses the app.
 * @details Has loyalty points and can search trips, buy tickets, change bookings, check train status, contact support, and view past trips.
 */
export class Passenger extends RegisteredUser {
    /** @brief Points the passenger earns for discounts or upgrades.
     * @type {number} 
     */ 
    loyaltyPoints;

    /**
     * @brief Searches for available train trips matching the given criteria.
     * @param {Object} criteria - What the user is looking for.
     * @return {Object} Available trips and pricing info.
     */
    selectTrainOptions(criteria) {
        return TicketPurchaseController.preparePurchase(criteria);
    }

    /**
     * @brief Pays for the selected tickets.
     * @param {Object} details - Payment info like card details.
     * @return {Promise<Object>} The payment result with receipt info.
     */
    async confirmPayment(details) {
        return TicketPurchaseController.processPayment(details);
    }

    /**
     * @brief Gets the ticket info so the user can change their booking.
     * @param {number|string} ticketId - The ID of the ticket to change.
     * @return {Object} The ticket details with allowed changes.
     */
    selectTicketModify(ticketId) {
        return TicketManagementController.getTicketForModify(ticketId);
    }

    /**
     * @brief Saves the changes made to an existing ticket.
     * @param {Object} newDetails - The new travel details after changes.
     * @return {Promise<Object>} Confirmation that the changes went through.
     */
    async confirmChange(newDetails) {
        return TicketManagementController.updateTicket(newDetails);
    }

    /**
     * @brief Asks the system about delays and platform info for a train.
     * @param {number|string} trainId - The train to check the status of.
     * @return {Promise<Object>} Current status with delays and platforms.
     */
    async requestTrainStatus(trainId) {
        return TrainSearchController.getTrainStatus(trainId);
    }

    /**
     * @brief Sends a message to customer support about an issue.
     * @param {string} text - The problem the user wants to report.
     * @return {Promise<Object>} Confirmation with the ticket number.
     */
    async contactCustomerService(text) {
        return SupportController.submitRequest(this.userId, text);
    }

    /**
     * @brief Shows all the trips the user has taken before.
     * @return {Array<Object>} List of past trips and their details.
     */
    viewBookingHistory() {
        return getDashboard(this.userId).history;
    }

    /**
     * @brief Returns how many loyalty points the user currently has.
     * @return {number} The user's current loyalty point balance.
     */
    viewLoyaltyPointsBalance() {
        return this.loyaltyPoints;
    }
}
