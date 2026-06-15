/**
 * @class PaymentResult
 * @brief Holds the result of a payment after it's processed.
 * @details Contains whether the payment went through, a code from the bank, and a message about what happened.
 */
export class PaymentResult {
    /**
     * @brief Makes a new payment result object.
     * @param {boolean} [authorized=false] - Whether the payment was approved.
     * @param {string} [transactionCode=''] - Code from the payment processor.
     * @param {string} [message=''] - Status message or error reason.
     */
    constructor(authorized = false, transactionCode = '', message = '') {
        /** * @brief Whether the payment went through or not.
         * @type {boolean} 
         */
        this.authorized = authorized;

        /** * @brief Reference code to look up this payment later.
         * @type {string} 
         */
        this.transactionCode = transactionCode;

        /** * @brief Human-readable text explaining the outcome.
         * @type {string} 
         */
        this.message = message;
    }
}
