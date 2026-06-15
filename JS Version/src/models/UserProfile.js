/**
 * @class UserProfile
 * @brief Domain entity model encapsulating customer state records displayed within the secure account space.
 * @details Serves as a centralized data repository tracking core personal attributes, active transit credentials, 
 * historical transaction ledger entries, and cumulative loyalty program point balances.
 */
export class UserProfile {
    /** * @brief Unique identifier mapped directly to the user profile entry record.
     * @type {number} 
     */ 
    profileId;

    /** * @brief Underlying core user identity details such as email, name, and operational authorization roles.
     * @type {Object} 
     */ 
    user;

    /** * @brief Collection of active travel documentation, including ongoing subscriptions and valid transit tickets.
     * @type {Array} 
     */ 
    activeDocuments;

    /** * @brief Historical archive tracking completed journeys, expired reservations, and cancelled bookings.
     * @type {Array} 
     */ 
    bookingHistory;

    /** * @brief Total current balance of accrued marketing loyalty points eligible for reward conversions.
     * @type {number} 
     */ 
    loyaltyPoints;
}