package org.example.util;



import org.example.enums.ChangeType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;


/**
 * Rappresenta la richiesta di modifica di un biglietto già acquistato.
 * Utilizzata in UC9 – Ticket Management.
 */
public class TicketChangeRequest {
    private LocalDate newDate;
    private LocalTime newTime;
    private ChangeType changeType;

    public TicketChangeRequest() {}

    public TicketChangeRequest(LocalDate newDate, LocalTime newTime, ChangeType changeType) {
        this.newDate = newDate;
        this.newTime = newTime;
        this.changeType = changeType;
    }


    public boolean validateAgainstThreshold(LocalDateTime departureTime) {
        // TODO: implementare la logica (es. se >24h full mod, altrimenti solo time)
        return true;
    }

    public LocalDate getNewDate() { return newDate; }
    public void setNewDate(LocalDate newDate) { this.newDate = newDate; }
    public LocalTime getNewTime() { return newTime; }
    public void setNewTime(LocalTime newTime) { this.newTime = newTime; }
    public ChangeType getChangeType() { return changeType; }
    public void setChangeType(ChangeType changeType) { this.changeType = changeType; }
}
