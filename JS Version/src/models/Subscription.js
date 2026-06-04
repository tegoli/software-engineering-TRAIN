import { TravelDocument } from './TravelDocument.js';

export class Subscription extends TravelDocument {
    constructor(...args) {
        super(...args);
        this.subscriptionId = null;
        this.startDate = null;
        this.endDate = null;
        this.durationDays = 0;
    }
    renew(durationDays) { console.log(`Rinnovo abbonamento di ${durationDays} giorni`); }
}