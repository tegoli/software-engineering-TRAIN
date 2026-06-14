/**
 * @file Represents the result of a ticket validation.
 */
export class ValidationResult {
    /** @type {boolean} */ valid = false;
    /** @type {boolean} */ alreadyValidated = false;
    /** @type {string} */ message = '';

    constructor(valid = false, message = '') {
        this.valid = valid;
        this.message = message;
    }
}