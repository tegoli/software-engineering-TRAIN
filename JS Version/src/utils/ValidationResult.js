/**
 * @file ValidationResult.js
 * @brief Represents the data payload structure returned from an official ticket validation event.
 * @details Models validation state properties, handling state flags that separate valid transit 
 * permissions, duplicate check warnings, and readable status log reports.
 */
export class ValidationResult {
    /** * @brief Core status flag confirming if the pass is currently authorized for active boarding.
     * @type {boolean} 
     */ 
    valid = false;

    /** * @brief Anti-fraud security property signaling if the asset was previously scanned and set to a used state.
     * @type {boolean} 
     */ 
    alreadyValidated = false;

    /** * @brief Detailed message string containing error details or successful validation clearance reports.
     * @type {string} 
     */ 
    message = '';

    /**
     * @brief Instantiates a new validation result schema layout block.
     * @param {boolean} [valid=false] - Baseline verification flag state.
     * @param {string} [message=''] - Explanatory metadata description string.
     */
    constructor(valid = false, message = '') {
        this.valid = valid;
        this.message = message;
    }
}