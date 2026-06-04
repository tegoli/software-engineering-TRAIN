export class PaymentGatewayAPI {
    authorize(amount) { console.log(`Autorizzato ${amount}`); return true; }
    refund(amount) { console.log(`Rimborsato ${amount}`); }
}