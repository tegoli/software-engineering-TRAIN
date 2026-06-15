import { RegisteredUser } from './RegisteredUser.js';
import { TicketPurchaseController } from '../controllers/TicketPurchaseController.js';
import { getDashboard } from '../controllers/UserDashboardController.js';

/**
 * @class Passenger
 * @extends RegisteredUser
 * @brief Domain actor model representing a registered customer navigating the transit service application.
 * @details Extends basic profile behaviors by attaching loyalty reward structures and providing direct 
 * operational linkages to checkout workflows, itinerary adjustment pipelines, live system telemetry searches, 
 * support ticket creation, and centralized dashboard account summaries.
 */
export class Passenger extends RegisteredUser {
    /** * @brief Cumulative reward points currency tally tracked to apply promotional benefits, upgrades, or tier discounts.
     * @type {number} 
     */ 
    loyaltyPoints;

    /**
     * @brief Forwards structural search constraints to orchestrate baseline route checkout options.
     * @details Handshakes with the TicketPurchaseController to extract valid itineraries, seat matrix structures, 
     * and tariff configurations matching the targeted travel query coordinates.
     * @param {Object} criteria - Search constraints matching destination nodes, times, and travel classes.
     * @return {Object} Structured metadata payload outlining available reservation options and initial pricing steps.
     */
    selectTrainOptions(criteria) {
        return TicketPurchaseController.preparePurchase(criteria);
    }

    /**
     * @brief Dispatches localized billing details down-pipe to execute formal asset checkout loops.
     * @details Initiates asynchronous transaction validation checks and security token processing passes 
     * to acquire reservation funds and commit the finalized document assets to the ledger.
     * @param {Object} details - Tokenized reference data, preferred payment channels, and billing criteria objects.
     * @return {Promise<Object>} Asynchronous handler carrying transactional execution results and receipt tracking codes.
     */
    async confirmPayment(details) {
        return TicketPurchaseController.processPayment(details);
    }

    /**
     * @brief Fetches a target travel asset structure to evaluate rule parameters for post-sale revisions.
     * @details Queries down-pipe structures to extract current ticket metadata rows and confirm whether chronological 
     * policy thresholds allow structural time or parameter adjustments.
     * @param {number|string} ticketId - Unique database primary key matching the specific travel document targeted for revision.
     * @return {Object} The isolated target travel document entity populated with structural parameter limits.
     */
    selectTicketModify(ticketId) {
        return TicketManagementController.getTicketForModify(ticketId);
    }

    /**
     * @brief Commits verified parameter updates directly to an existing reservation ledger record.
     * @details Submits the altered booking changes asynchronously to transactional controllers to overwrite the previous travel 
     * metrics, reallocate seat arrays, and distribute revised confirmation files.
     * @param {Object} newDetails - Structured payload object containing the newly targeted travel parameters.
     * @return {Promise<Object>} Asynchronous confirmation mapping completion status metadata.
     */
    async confirmChange(newDetails) {
        return TicketManagementController.updateTicket(newDetails);
    }

    /**
     * @brief Queries real-time network tracking matrices to extract active delay logs and platform statuses.
     * @details Handshakes asynchronously with searching modules to resolve down-line track assignments and operational deviation offsets.
     * @param {number|string} trainId - Unique asset identification key mapping to the physical rolling stock unit.
     * @return {Promise<Object>} Real-time tracking snapshot detailing active delays, track designations, and scheduled nodes.
     */
    async requestTrainStatus(trainId) {
        return TrainSearchController.getTrainStatus(trainId);
    }

    /**
     * @brief Generates a new operational customer care assistance ticket inside systemic support queues.
     * @details Packages text entries alongside the profile identifier token, routing the resulting claim metadata structure 
     * into active triage lists for customer representative auditing.
     * @param {string} text - Detailed narrative text block describing the customer's core problem or grievance.
     * @return {Promise<Object>} Asynchronous acknowledgement tracking receipt status codes and ticket indices.
     */
    async contactCustomerService(text) {
        return SupportController.submitRequest(this.userId, text);
    }

    /**
     * @brief Extracts historical transactional receipts and archive travel itineraries linked to this profile node.
     * @details Interrogates the user dashboard data aggregator to filter out historic reservation records 
     * and compile them into a chronological history matrix.
     * @return {Array<Object>} Historic collection list containing past trip records and invoice metadata objects.
     */
    viewBookingHistory() {
        return getDashboard(this.userId).history;
    }

    /**
     * @brief Evaluates internal balance properties to supply active reward metrics to client view models.
     * @details Exposes current loyalty ledger values for display within individual account widgets or promotional checkouts.
     * @return {number} Total count of active unspent loyalty points attached to this user account context.
     */
    viewLoyaltyPointsBalance() {
        return this.loyaltyPoints;
    }
}