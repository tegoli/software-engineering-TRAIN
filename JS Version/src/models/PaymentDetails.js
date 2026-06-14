/**
 * @brief Payment information needed for transaction.
 */
export class PaymentDetails {
    /** @type {string} */ paymentMethod;
    /** @type {string} */ tokenizedReference;

    validate() {
        return !!this.paymentMethod && !!this.tokenizedReference;
    }
}