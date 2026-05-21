package org.example.model;


import java.time.LocalDate;

public class Subscription extends TravelDocument {
    private int subscriptionId;
    private LocalDate startDate;
    private LocalDate endDate;
    private int durationDays;

    // UC4 – Purchase (rinnovo)
    public void renew(int durationDays) { /* TODO */ }
}