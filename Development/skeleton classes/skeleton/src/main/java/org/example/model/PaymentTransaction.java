package org.example.model;


import org.example.enums.PaymentStatus;
import java.time.LocalDateTime;

public class PaymentTransaction {
    private int paymentId;
    private double amount;
    private LocalDateTime paymentDate;
    private PaymentStatus paymentStatus;

    // UC4 – Purchase
    public void authorize(double amount) { /* TODO */ }

    // UC11 – Customer Support
    public void refund(double amount) { /* TODO */ }
}
