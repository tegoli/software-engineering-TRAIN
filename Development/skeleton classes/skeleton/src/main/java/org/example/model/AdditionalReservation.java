package org.example.model;


import org.example.enums.ReservationStatus;

public abstract class AdditionalReservation {
    protected int reservationId;
    protected ReservationStatus status;
    protected double price;

    // UC4 – Purchase
    public void confirmReservation() { /* TODO */ }

    // UC9 – Ticket Management
    public void cancelReservation() { /* TODO */ }
}
