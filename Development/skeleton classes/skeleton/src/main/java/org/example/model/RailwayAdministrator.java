package org.example.model;


import java.time.LocalDate;

public class RailwayAdministrator extends RegisteredUser {
    private String adminCode;

    // UC3 – Admin Area Access
    public void requestAdminArea() { /* TODO */ }

    // UC14 – Statistics Visualization
    public void loadStatistics() { /* TODO */ }
    public void applyFilters(LocalDate date, String trainLine) { /* TODO */ }
    public void viewStatistics() { /* TODO */ }
}