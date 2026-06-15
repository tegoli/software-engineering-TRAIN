import { TravelDocument } from './TravelDocument.js';

/**
 * @class Subscription
 * @extends TravelDocument
 * @brief Domain entity model representing a recurring, time-bound transit pass asset.
 * @details Extends the core TravelDocument framework by embedding explicit validity windows, 
 * tracking duration parameters, and exposing structural lifecycles to calculate continuous operational 
 * renewal structures across the transit clearinghouse network.
 */
export class Subscription extends TravelDocument {
    /** * @brief Unique database record primary key mapping this subscription to the data ledger.
     * @type {number} 
     */ 
    subscriptionId;

    /** * @brief Calendar date indicating the exact start of the authorized transit validity window.
     * @type {Date} 
     */ 
    startDate;

    /** * @brief Calendar date tracking the expiration threshold after which the document becomes invalid.
     * @type {Date} 
     */ 
    endDate;

    /** * @brief Total number of consecutive calendar days allocated to the current active validity cycle.
     * @type {number} 
     */ 
    durationDays;

    /**
     * @brief Extends the operational lifecycle of the subscription by a specified block of valid days.
     * @details Updates internal duration metrics and projects a new future termination timestamp calculated 
     * by stacking millisecond offsets onto the active system clock baseline, staging records for database update loops.
     * @param {number} durationDays - Total count of consecutive calendar days to add to the asset term.
     * @return {void}
     */
    renew(durationDays) {
        this.durationDays = durationDays;
        this.endDate = new Date(Date.now() + durationDays * 86400000);
        // save to DB
    }
}