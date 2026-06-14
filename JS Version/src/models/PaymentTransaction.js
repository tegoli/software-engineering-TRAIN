export class PaymentTransaction {
    /** @type {number} */ paymentId;
    /** @type {number} */ amount;
    /** @type {Date} */ paymentDate;
    /** @type {string} */ paymentStatus; // 'pending', 'completed', 'failed'

    authorize(amount) {
        // call external API
        this.amount = amount;
        this.paymentStatus = 'completed';
    }

    refund(amount) {
        // process refund
        this.paymentStatus = 'refunded';
    }
}