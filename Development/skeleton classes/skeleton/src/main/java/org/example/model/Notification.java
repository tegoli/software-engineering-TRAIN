package org.example.model;


import org.example.enums.NotificationType;
import java.time.LocalDateTime;

public class Notification {
    private int notificationId;
    private String message;
    private LocalDateTime notificationDate;
    private NotificationType notificationType;

    // UC7 – Receive Notifications
    public void pushInAppAlert() { /* TODO */ }
    public void sendEmailNotification() { /* TODO */ }
}
