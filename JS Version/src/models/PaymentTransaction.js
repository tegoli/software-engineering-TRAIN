/**
 * @class PaymentTransaction
 * @brief Represents a single payment that goes through the system.
 * @details Keeps track of the payment ID, amount, date, and status. Can authorize or refund money.
 */
export class PaymentTransaction {
    /** * @brief Unique ID for this payment in the system.
     * @type {number} 
     */ 
    paymentId;

    /** * @brief How much money is being charged.
     * @type {number} 
     */ 
    amount;

    /** * @brief When the payment was made.
     * @type {Date} 
     */ 
    paymentDate;

    /** * @brief Current status of the payment (pending, completed, failed).
     * @type {string} 
     */ 
    paymentStatus; // 'pending', 'completed', 'failed'

    /**
     * @brief Processes the payment for the given amount.
     * @details Calls the external payment API, sets the amount, and marks the status as completed.
     * @param {number} amount - The amount to charge.
     * @return {void}
     */
    authorize(amount) {
        // call external API
        this.amount = amount;
        this.paymentStatus = 'completed';
    }

    /**
     * @brief Refunds the given amount back to the customer.
     * @details Processes a reversal and sets the payment status to refunded.
     * @param {number} amount - The amount to give back.
     * @return {void}
     */
    refund(amount) {
        // process refund
        this.paymentStatus = 'refunded';
    }
}
