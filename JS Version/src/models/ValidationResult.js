/**
 * @class ValidationResult
 * @brief Simple data transfer model representing the structured result of an assertion or asset verification check.
 * @details Encapsulates structural flags indicating success or failure along with descriptive feedback strings, 
 * standardizing validation response formats across the architecture.
 */
export class ValidationResult {
    /**
     * @brief Instantiates a basic validation enforcement result layout.
     * @param {boolean} [valid=false] - Core processing status flag indicating if validation checks succeeded.
     * @param {string} [message=''] - Contextual message containing error summaries or success descriptions.
     */
    constructor(valid = false, message = '') {
        /** @type {boolean} */ this.valid = valid;
        /** @type {string} */ this.message = message;
    }
}