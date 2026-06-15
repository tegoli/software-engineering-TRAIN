import { User } from './User.js';
import { AuthController } from '../controllers/AuthController.js';

/**
 * @class RegisteredUser
 * @extends User
 * @brief Domain actor model representing an authenticated customer or internal system profile.
 * @details Extends basic guest parameters by embedding credential hash matrices, account lockout protections, 
 * security management routines, and integration bridges to pull valid travel entitlement assets from databases.
 */
export class RegisteredUser extends User {
    /** * @brief Cryptographically encrypted password string used to verify safe profile access during authentications.
     * @type {string} 
     */ 
    passwordHash;

    /** * @brief Current identity access state constraint tracker (e.g., 'active', 'locked').
     * @type {string} 
     */ 
    accountStatus; // 'active', 'locked'

    /** * @brief Numeric tally tracking sequential incorrect credentials entered against this login vector.
     * @type {number} 
     */ 
    failedLoginAttempts;

    /**
     * @brief Dispatches authentication attributes down-pipe to resolve access token rights.
     * @details Invokes the underlying AuthController handling loop to process security matching, manage 
     * login tracking arrays, and generate cryptographically signed verification tokens.
     * @param {string} email - Unique registration identity communication address targeting a user account.
     * @param {string} password - Raw string token passphrase containing user secret entries.
     * @return {Promise<Object|boolean>} Asynchronous resolving payload conveying session tokens or access flags.
     */
    async login(email, password) {
        return AuthController.loginInternal(email, password);
    }

    /**
     * @brief Signals security registries to invalidate current cryptographic session hashes.
     * @details Informs identity control gateways to tear down authorization tracking arrays assigned to this profile context.
     * @return {void}
     */
    logout() {
        AuthController.logout(this.userId);
    }

    /**
     * @brief Evaluates existing credentials before committing structural updates to identity attributes.
     * @details Bridges securely to validation handlers to test current string sequences before safely hashing 
     * and writing new authorization structures to system records.
     * @param {string} oldPass - Active old passphrase used to confirm individual operational validation.
     * @param {string} newPass - Target replacement security passphrase string requested for future logins.
     * @return {Promise<boolean>} Asynchronous status confirmation indicating ledger write success.
     */
    async changePassword(oldPass, newPass) {
        return AuthController.changePassword(this.userId, oldPass, newPass);
    }

    /**
     * @brief Initiates defensive password reset pathways for profiles with compromised or forgotten tokens.
     * @details Instructs communication engines to bundle temporary single-use cryptographic recovery landing paths 
     * and dispatch them to verified communication addresses.
     * @param {string} email - Unique registration communication address associated with the target account profile.
     * @return {Promise<boolean>} Asynchronous acknowledgment indicating dispatch pipeline resolution.
     */
    async requestPasswordRecovery(email) {
        return AuthController.requestRecovery(email);
    }

    /**
     * @brief Executes soft or hard profile erasure loops across corporate transit metadata tables.
     * @details Clears personalized user indices, tracking flags, and identity profiles from main database layers 
     * while preserving anonymous auditing fields required by compliance guidelines.
     * @return {Promise<Object>} Asynchronous confirmation mapping completion status metadata.
     */
    async eliminateAccount() {
        return AuthController.deleteAccount(this.userId);
    }

    /**
     * @brief Pulls all unexpired booking, travel pass, and credential assets mapped to this user identifier.
     * @details Lazy-loads internal query utilities to filter operational database tables for valid ticket shapes 
     * and active chronological subscription models matching the profile context.
     * @return {Array<Object>} Collection of active valid travel entitlement and pass documentation data objects.
     */
    viewActiveDocuments() {
        // returns active tickets/subscriptions
        const { getActiveDocuments } = require('../database/db.js');
        return getActiveDocuments(this.userId);
    }
}