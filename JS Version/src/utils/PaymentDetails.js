/**
 * @class PaymentDetails
 * @brief Contains payment information for processing a transaction.
 * @details Stores the payment method and a tokenized reference instead of raw card details.
 */
export class PaymentDetails {
    /**
     * @brief Creates a new PaymentDetails instance.
     * @param {string} paymentMethod - The payment method (e.g. 'credit_card', 'digital_wallet').
     * @param {string} tokenizedReference - A token representing the payment info.
     */
    constructor(paymentMethod, tokenizedReference) {
        /** @type {string} */ this.paymentMethod = paymentMethod;
        /** @type {string} */ this.tokenizedReference = tokenizedReference;
    }

    /**
     * @brief Checks if payment details are valid.
     * @return {boolean} True if payment method and token are set.
     */
    validate() {
        return this.paymentMethod && this.tokenizedReference;
    }
}
