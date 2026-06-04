export class ValidationResult {
    constructor(valid, alreadyValidated, message) {
        this.valid = valid;
        this.alreadyValidated = alreadyValidated;
        this.message = message;
    }
}