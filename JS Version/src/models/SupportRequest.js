export class SupportRequest {
    /** @type {number} */ requestId;
    /** @type {string} */ requestType; // 'refund', 'info', 'complaint'
    /** @type {string} */ description;
    /** @type {string} */ status; // 'open', 'closed'
    /** @type {Date} */ creationDate;

    submit() {
        this.status = 'open';
        // save to DB
    }

    close() {
        this.status = 'closed';
    }
}