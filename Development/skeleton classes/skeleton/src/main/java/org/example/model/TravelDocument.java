package org.example.model;

import org.example.enums.DocumentStatus;
import java.time.LocalDateTime;

public abstract class TravelDocument {
    protected int documentId;
    protected LocalDateTime issueDate;
    protected double price;
    protected DocumentStatus status;
    protected String qrCode;

    // UC12 – Inspector Operations
    public void validate() { /* TODO */ }

    // UC9 / UC12
    public boolean isActive(LocalDateTime currentDate) { return false; }
}