import { TravelDocument } from './TravelDocument.js';

export class Subscription extends TravelDocument {
    /** @type {number} */ subscriptionId;
    /** @type {Date} */ startDate;
    /** @type {Date} */ endDate;
    /** @type {number} */ durationDays;

    renew(durationDays) {
        this.durationDays = durationDays;
        this.endDate = new Date(Date.now() + durationDays * 86400000);
        // save to DB
    }
}