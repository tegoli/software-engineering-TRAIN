export class TravelDocument {
    /** @type {number} */ documentId;
    /** @type {Date} */ issueDate;
    /** @type {number} */ price;
    /** @type {string} */ status; // 'active', 'used', 'expired'
    /** @type {string} */ qrCode;

    validate() {
        // implemented by subclasses
        throw new Error('Not implemented');
    }

    isActive(currentDate) {
        return this.status === 'active';
    }
}