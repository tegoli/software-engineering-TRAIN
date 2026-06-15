/**
 * @class PaymentDetails
 * @brief Represents the technical configuration parameters required to process an automated transaction.
 * @details Encapsulates sensitive transaction fields behind abstract metadata channels, tracking chosen 
 * transaction methods alongside structural token references to enforce external banking compliance boundaries.
 */
export class PaymentDetails {
    /**
     * @brief Instantiates a secure payment routing metadata tracking block.
     * @param {string} paymentMethod - The core financial system type designation flag (e.g., 'credit_card', 'digital_wallet').
     * @param {string} tokenizedReference - The unique, non-reversible cryptographic vault token replacing explicit card profiles.
     */
    constructor(paymentMethod, tokenizedReference) {
        /** @type {string} */ this.paymentMethod = paymentMethod;
        /** @type {string} */ this.tokenizedReference = tokenizedReference;
    }

    /**
     * @brief Performs baseline structural integrity validation checks against local clearing fields.
     * @details Ensures that processing routing mechanisms and token indicators exist and contain non-empty string patterns 
     * before transmitting details to the payment gateway module.
     * @return {boolean} True if both the payment channel classification and tokenized reference signatures are populated.
     */
    validate() {
        return this.paymentMethod && this.tokenizedReference;
    }
}