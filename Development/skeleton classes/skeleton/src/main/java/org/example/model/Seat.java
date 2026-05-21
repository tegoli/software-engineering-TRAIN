package org.example.model;


import org.example.enums.SeatStatus;

public class Seat {
    private String seatNumber;
    private SeatStatus seatStatus;

    // UC4 – Purchase
    public void reserve() { this.seatStatus = SeatStatus.RESERVED; }

    // UC12 – Inspector Operations
    public void markOccupied() { this.seatStatus = SeatStatus.OCCUPIED; }
}
