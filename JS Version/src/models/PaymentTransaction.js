export class PaymentTransaction {
    constructor(paymentId, amount, paymentDate, paymentStatus) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentStatus = paymentStatus;
    }
    authorize(amount) { console.log(`Autorizzazione pagamento di ${amount}`); }
    refund(amount) { console.log(`Rimborso di ${amount}`); }
}