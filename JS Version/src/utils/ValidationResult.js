/**
 * @file ValidationResult.js
 * @brief Represents the result of a ticket validation.
 * @details Stores whether the ticket is valid, if it was already used, and a message.
 */
export class ValidationResult {
    /** * @brief True if the ticket is valid.
     * @type {boolean} 
     */ 
    valid = false;

    /** * @brief True if the ticket was already validated.
     * @type {boolean} 
     */ 
    alreadyValidated = false;

    /** * @brief A message describing the result.
     * @type {string} 
     */ 
    message = '';

    /**
     * @brief Creates a new ValidationResult.
     * @param {boolean} [valid=false] - Whether the ticket is valid.
     * @param {string} [message=''] - A description of the result.
     */
    constructor(valid = false, message = '') {
        this.valid = valid;
        this.message = message;
    }
}
