package org.example.model;

import org.example.enums.AccountStatus;


public class RegisteredUser extends User {
    protected String passwordHash;
    protected AccountStatus accountStatus;
    protected int failedLoginAttempts;

    // UC2 – Authentication
    public void login(String email, String password) { /* TODO */ }
    public void logout() { /* TODO */ }

    // UC10 – Account Management
    public void changePassword(String oldPass, String newPass) { /* TODO */ }
    public void requestPasswordRecovery(String email) { /* TODO */ }
    public void eliminateAccount() { /* TODO */ }

    // UC8 / UC9 – Dashboard / Ticket Management
    public void viewActiveDocuments() { /* TODO */ }
}