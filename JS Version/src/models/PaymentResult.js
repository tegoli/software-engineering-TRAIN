export class PaymentResult {
    constructor(authorized = false, transactionCode = '', message = '') {
        this.authorized = authorized;
        this.transactionCode = transactionCode;
        this.message = message;
    }
}