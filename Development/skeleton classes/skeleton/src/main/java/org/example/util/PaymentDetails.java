package org.example.util;



public class PaymentDetails {
    private String paymentMethod;       // es. "Visa", "PayPal"
    private String tokenizedReference;  // riferimento temporaneo fornito dal front-end

    public PaymentDetails() {}

    public PaymentDetails(String paymentMethod, String tokenizedReference) {
        this.paymentMethod = paymentMethod;
        this.tokenizedReference = tokenizedReference;
    }

    /**
     * Controlla che i dati di pagamento siano completi.
     * @return true se validi, false altrimenti
     */
    public boolean validate() {
        return paymentMethod != null && !paymentMethod.isEmpty()
                && tokenizedReference != null && !tokenizedReference.isEmpty();
    }

    // getter e setter
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getTokenizedReference() { return tokenizedReference; }
    public void setTokenizedReference(String tokenizedReference) { this.tokenizedReference = tokenizedReference; }
}