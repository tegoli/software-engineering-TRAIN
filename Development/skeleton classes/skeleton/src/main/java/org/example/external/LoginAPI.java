package org.example.external;


public class LoginAPI {
    public boolean checkEmailUnique(String email) { return false; }
    public boolean validateCredentials(String email, String password) { return false; }
    public void createSession(Object userData) { /* TODO */ }
    public void terminateSession(Object token) { /* TODO */ }
}