package org.example.controller;

import org.example.enums.Language;
import org.example.model.StatisticsReport;
import org.example.util.StatisticsFilter;

public class ApplicationInterface {
    // Raccoglie e coordina i controller (attributi omessi per brevità)
    public void displayDashboard(StatisticsReport stats) { /* TODO */ }
    public void displayData(StatisticsReport data, StatisticsFilter filters) { /* TODO */ }
    public void showError(String message) { /* TODO */ }
    public boolean showConfirmation(String message) { return false; }
    public void updatedUI(Language lang) { /* TODO */ }
}
