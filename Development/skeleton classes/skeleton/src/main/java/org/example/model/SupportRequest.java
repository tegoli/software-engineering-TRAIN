package org.example.model;


import org.example.enums.SupportRequestType;
import org.example.enums.SupportRequestStatus;
import java.time.LocalDateTime;

public class SupportRequest {
    private int requestId;
    private SupportRequestType requestType;
    private String description;
    private SupportRequestStatus status;
    private LocalDateTime creationDate;

    // UC11 – Customer Support
    public void submit() { /* TODO */ }
    public void close() { this.status = SupportRequestStatus.CLOSED; }
}
