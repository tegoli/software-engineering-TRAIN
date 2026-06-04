export class PaymentResult {
    constructor(authorized, transactionCode, message) {
        this.authorized = authorized;
        this.transactionCode = transactionCode;
        this.message = message;
    }
}