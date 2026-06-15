/**
 * @class ValidationResult
 * @brief Stores the result of a validation check.
 * @details Has flags for pass/fail and a message string so
 * validation responses look the same everywhere.
 */
export class ValidationResult {
    /**
     * @brief Makes a new validation result.
     * @param {boolean} [valid=false] - Whether the check passed.
     * @param {string} [message=''] - Error or success message.
     */
    constructor(valid = false, message = '') {
        /** @type {boolean} */ this.valid = valid;
        /** @type {string} */ this.message = message;
    }
}
