/**
 * @class PaymentGatewayAPI
 * @brief Mock API that simulates a payment gateway.
 * @details Provides methods to authorize payments and process refunds.
 */
export class PaymentGatewayAPI {
    /**
     * @brief Authorizes a payment amount.
     * @param {number} amount - The amount to authorize.
     * @return {boolean} True if the payment is approved.
     */
    authorize(amount) { console.log(`Autorizzato ${amount}`); return true; }

    /**
     * @brief Processes a refund.
     * @param {number} amount - The amount to refund.
     * @return {void}
     */
    refund(amount) { console.log(`Rimborsato ${amount}`); }
}
