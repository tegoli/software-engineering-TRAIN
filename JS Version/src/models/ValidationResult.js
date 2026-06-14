export class ValidationResult {
    constructor(valid = false, message = '') {
        this.valid = valid;
        this.message = message;
    }
}