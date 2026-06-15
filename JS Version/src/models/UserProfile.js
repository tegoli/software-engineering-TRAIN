/**
 * @class UserProfile
 * @brief Stores customer account data shown in the user profile area.
 * @details Keeps the user's personal info, active tickets, booking history, and loyalty points in one place.
 */
export class UserProfile {
    /** * @brief Unique ID for this profile.
     * @type {number} 
     */ 
    profileId;

    /** * @brief User info like name and email.
     * @type {Object} 
     */ 
    user;

    /** * @brief List of active tickets and subscriptions.
     * @type {Array} 
     */ 
    activeDocuments;

    /** * @brief Past bookings, including expired and cancelled ones.
     * @type {Array} 
     */ 
    bookingHistory;

    /** * @brief How many loyalty points the user has.
     * @type {number} 
     */ 
    loyaltyPoints;
}
