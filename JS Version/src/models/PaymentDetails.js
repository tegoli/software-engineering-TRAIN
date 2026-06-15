/**
 * @file PaymentDetails.js
 * @brief Data transfer object containing the necessary references and vectors to initiate a secure transaction.
 * @details Encapsulates high-level payment channels alongside tokenized proxy signatures, ensuring compliance 
 * with payment security standards by preventing raw account or card details from circulating through internal application loops.
 */
export class PaymentDetails {
    /** * @brief Designated transactional framework channel category (e.g., 'credit_card', 'paypal', 'apple_pay').
     * @type {string} 
     */ 
    paymentMethod;

    /** * @brief PCI-compliant obfuscated hash reference mapping back to raw card details stored in a secure external vault.
     * @type {string} 
     */ 
    tokenizedReference;

    /**
     * @brief Evaluates whether the critical payment properties are fully populated.
     * @details Performs basic structural validation by asserting the presence of both the processing method type 
     * and its associated security reference token before submitting the payload to downstream authorization controllers.
     * @return {boolean} True if both essential payment parameters are present and non-empty.
     */
    validate() {
        return !!this.paymentMethod && !!this.tokenizedReference;
    }
}