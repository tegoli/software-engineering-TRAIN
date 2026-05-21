package org.example.util;

import java.time.LocalDateTime;

public class SessionToken {
    private String tokenValue;
    private LocalDateTime expirationTime;

    // UC2 – Authentication
    public boolean isExpired(LocalDateTime currentTime) {
        return currentTime.isAfter(expirationTime);
    }

    // getter/setter
    public String getTokenValue() { return tokenValue; }
    public void setTokenValue(String tokenValue) { this.tokenValue = tokenValue; }
    public LocalDateTime getExpirationTime() { return expirationTime; }
    public void setExpirationTime(LocalDateTime expirationTime) { this.expirationTime = expirationTime; }
}