package org.example.util;


public class PaymentResult {
    private boolean authorized;
    private String transactionCode;
    private String message;


    public boolean isAuthorized() { return authorized; }
    public void setAuthorized(boolean authorized) { this.authorized = authorized; }
    public String getTransactionCode() { return transactionCode; }
    public void setTransactionCode(String transactionCode) { this.transactionCode = transactionCode; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}