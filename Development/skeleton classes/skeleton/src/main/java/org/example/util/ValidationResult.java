package org.example.util;


public class ValidationResult {
    private boolean valid;
    private boolean alreadyValidated;
    private String message;

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }
    public boolean isAlreadyValidated() { return alreadyValidated; }
    public void setAlreadyValidated(boolean alreadyValidated) { this.alreadyValidated = alreadyValidated; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}