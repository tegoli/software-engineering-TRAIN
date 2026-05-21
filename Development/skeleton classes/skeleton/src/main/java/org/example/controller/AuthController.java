package org.example.controller;


import org.example.model.UserProfile;
import org.example.util.SessionToken;

public class AuthController {
    public void register(String name, String email, String password) { /* TODO */ }
    public boolean checkEmailUnique(String email) { return false; }
    public void createAccount(UserProfile userData) { /* TODO */ }
    public void login(String email, String password) { /* TODO */ }
    public boolean validateCredentials(String email, String password) { return false; }
    public void createSession(String email) { /* TODO */ }
    public void incrementFailedAttempts(String email) { /* TODO */ }
    public int checkFailCount(String email) { return 0; }
    public void lockAccount(String email) { /* TODO */ }
    public void logout() { /* TODO */ }
    public void terminateSession(SessionToken token) { /* TODO */ }
    public boolean validateChange(String oldPass, String newPass) { return false; }
    public boolean verifyComplexity(String password) { return false; }
    public void updateCredentials(int userId, String newPass) { /* TODO */ }
    public void triggerResetLink(String email) { /* TODO */ }
}