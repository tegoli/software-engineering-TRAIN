export class PaymentDetails {
    constructor(paymentMethod, tokenizedReference) {
        this.paymentMethod = paymentMethod;
        this.tokenizedReference = tokenizedReference;
    }
    validate() {
        return this.paymentMethod && this.tokenizedReference;
    }
}