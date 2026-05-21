package org.example.model;


public class TicketInspector extends RegisteredUser {
    private String inspectorCode;

    // UC12 – Inspector Operations
    public void accessSystem() { /* TODO */ }
    public void selectValidation() { /* TODO */ }
    public void manualInput(int ticketId) { /* TODO */ }
    public void ticketData(int ticketId) { /* TODO */ }
    public void selectTrackOccupancy() { /* TODO */ }
    public void updateOccupancy(int coachNumber, int nPassengers) { /* TODO */ }

    // UC13 – Shift Schedule Visualization
    public void viewSchedule(int inputId) { /* TODO */ }
}
