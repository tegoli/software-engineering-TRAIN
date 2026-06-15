/**
 * @file PaymentDetails.js
 * @brief Holds payment info needed to process a transaction.
 * @details Stores the payment method and a token instead of raw card details, so we stay safe and compliant.
 */
export class PaymentDetails {
    /** * @brief Payment method used.
     * @type {string} 
     */ 
    paymentMethod;

    /** * @brief Secure token referencing the real card info.
     * @type {string} 
     */ 
    tokenizedReference;

    /**
     * @brief Checks that payment fields are filled in.
     * @details Makes sure both payment method and token are present before sending to the payment service.
     * @return {boolean} True if payment info is complete.
     */
    validate() {
        return !!this.paymentMethod && !!this.tokenizedReference;
    }
}
