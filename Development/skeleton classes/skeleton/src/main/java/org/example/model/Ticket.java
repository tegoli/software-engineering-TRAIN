package org.example.model;


import org.example.enums.PassengerType;
import java.time.LocalDateTime;

public class Ticket extends TravelDocument {
    private int ticketId;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private PassengerType passengerType;

    // UC9 – Ticket Management
    public long calculateTimeRemaining(LocalDateTime currentTime) { return 0; }
    public boolean allowFullModification() { return false; }
    public void restrictToTimeOnly() { /* TODO */ }
    public void updateTicket(TicketChangeRequest newDetails) { /* TODO */ }
}
