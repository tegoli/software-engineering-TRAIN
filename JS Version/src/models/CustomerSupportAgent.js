import { RegisteredUser } from './RegisteredUser.js';

/**
 * @class CustomerSupportAgent
 * @extends RegisteredUser
 * @brief A customer service worker who can look up users and handle tickets.
 * @details Adds extra permissions so staff can view profiles, update tickets, check loyalty points, and see work schedules.
 */
export class CustomerSupportAgent extends RegisteredUser {
    /** @brief Employee ID number for this support agent.
     * @type {string} 
     */ 
    staffCode;

    /**
     * @brief Looks up a customer's account details from the database.
     * @param {number|string} userId - The customer's ID to look up.
     * @return {Object} The customer's profile data from the database.
     */
    viewUserProfile(userId) {
        const { getUserById } = require('../database/db.js');
        return getUserById(userId);
    }

    /**
     * @brief Edits or updates an existing support ticket.
     * @param {number|string} requestId - The ID of the ticket to update.
     * @return {Object} The updated ticket with new status info.
     */
    manageSupportRequest(requestId) {
        const { updateSupportRequest } = require('../database/db.js');
        return updateSupportRequest(requestId);
    }

    /**
     * @brief Checks how many loyalty points a customer has.
     * @param {number|string} userId - The customer's ID to check.
     * @return {number|undefined} The customer's loyalty points, or undefined.
     */
    viewLoyaltyPointsBalance(userId) {
        const { getUserById } = require('../database/db.js');
        return getUserById(userId)?.loyaltyPoints;
    }

    /**
     * @brief Gets the work schedule for a staff member.
     * @param {number|string} staffId - The staff member's ID.
     * @return {Array<Object>} List of shifts with times and duties.
     */
    viewSchedule(staffId) {
        const { getSupportSchedule } = require('../database/db.js');
        return getSupportSchedule(staffId);
    }
}
