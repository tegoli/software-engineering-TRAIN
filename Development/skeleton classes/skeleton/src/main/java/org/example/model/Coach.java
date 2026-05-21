package org.example.model;


import org.example.enums.TravelClass;

public class Coach {
    private int coachNumber;
    private TravelClass coachClass;
    private int maxPassengers;
    private int currentPassengers;

    // UC12 – Inspector Operations
    public void updateOccupancy(int nPassengers) { this.currentPassengers = nPassengers; }
}