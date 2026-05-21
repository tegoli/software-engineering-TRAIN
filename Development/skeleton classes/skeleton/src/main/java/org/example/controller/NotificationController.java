package org.example.controller;


public class NotificationController {
    // UC7 – Receive Notifications
    public void reportDelay(int trainId, int delayTime) { /* TODO */ }
    public void getAffectedUsers(int trainId) { /* TODO */ }
    public void pushInAppAlert(int userId, String message) { /* TODO */ }
    public void sendEmailNotification(String email, String message) { /* TODO */ }
    public void manualInput(int ticketId) { /* TODO */ }
    public void validateDocument(int documentId) { /* TODO */ }
    public boolean alreadyValid(int ticketId) { return false; }
    public void invalid(int ticketId) { /* TODO */ }
    public void updateOccupancy(int nCoach, int nPassengers) { /* TODO */ }
}
