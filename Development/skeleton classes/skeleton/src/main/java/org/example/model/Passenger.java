package org.example.model;


import org.example.util.SearchCriteria;
import org.example.util.PaymentDetails;
import org.example.util.TicketChangeRequest;

public class Passenger extends RegisteredUser {
    private int loyaltyPoints;

    // UC4 – Purchase
    public void selectTrainOptions(SearchCriteria criteria) { /* TODO */ }
    public void confirmPayment(PaymentDetails details) { /* TODO */ }

    // UC9 – Ticket Management
    public void selectTicketModify(int ticketId) { /* TODO */ }
    public void confirmChange(TicketChangeRequest newDetails) { /* TODO */ }

    // UC5 – Check Train Status
    public void requestTrainStatus(int trainId) { /* TODO */ }

    // UC11 – Customer Support
    public void contactCustomerService(String text) { /* TODO */ }

    // UC8 – Dashboard
    public void viewBookingHistory() { /* TODO */ }
    public void viewLoyaltyPointsBalance() { /* TODO */ }
}