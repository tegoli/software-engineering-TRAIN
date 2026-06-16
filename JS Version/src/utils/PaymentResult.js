/**
 * @file PaymentResult.js
 * @brief Represents the result of a payment transaction.
 * @details Stores whether the payment was authorized, the transaction code, and a message.
 */
export class PaymentResult {
    /** * @brief True if the payment was authorized.
     * @type {boolean} 
     */ 
    authorized = false;

    /** * @brief The transaction code from the payment gateway.
     * @type {string} 
     */ 
    transactionCode = '';

    /** * @brief A message describing the result.
     * @type {string} 
     */ 
    message = '';

    /**
     * @brief Creates a new PaymentResult.
     * @param {boolean} authorized - Whether the payment was authorized.
     * @param {string} transactionCode - The transaction code.
     * @param {string} message - A description of the result.
     */
    constructor(authorized, transactionCode, message) {
        this.authorized = authorized;
        this.transactionCode = transactionCode;
        this.message = message;
    }
}
