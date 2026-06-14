/**
 * @file Result of a payment request.
 */
export class PaymentResult {
    /** @type {boolean} */ authorized = false;
    /** @type {string} */ transactionCode = '';
    /** @type {string} */ message = '';

    constructor(authorized, transactionCode, message) {
        this.authorized = authorized;
        this.transactionCode = transactionCode;
        this.message = message;
    }
}