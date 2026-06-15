import { TravelDocument } from './TravelDocument.js';

/**
 * @class Subscription
 * @extends TravelDocument
 * @brief A travel pass that lasts for a set amount of time.
 * @details Works like a regular ticket but has a start date, end date, and how many days it's good for.
 */
export class Subscription extends TravelDocument {
    /** * @brief Primary key for this subscription in the database.
     * @type {number} 
     */ 
    subscriptionId;

    /** * @brief When the subscription starts being valid.
     * @type {Date} 
     */ 
    startDate;

    /** * @brief When the subscription stops being valid.
     * @type {Date} 
     */ 
    endDate;

    /** * @brief How many days the subscription lasts.
     * @type {number} 
     */ 
    durationDays;

    /**
     * @brief Extends the subscription by adding more days.
     * @details Updates the duration and pushes the end date forward by the given number of days.
     * @param {number} durationDays - How many days to add on.
     * @return {void}
     */
    renew(durationDays) {
        this.durationDays = durationDays;
        this.endDate = new Date(Date.now() + durationDays * 86400000);
        // save to DB
    }
}
