package org.example.database;


import org.example.model.UserProfile;
import org.example.util.StatisticsFilter;

public class UserDatabase {
    // UC2, UC10, UC15, UC14
    public void createAccount(UserProfile userData) { /* TODO */ }
    public void updateCredentials(int userId, String newPass) { /* TODO */ }
    public void hardDelete(int userId) { /* TODO */ }
    public void savePreference(int userId, String lang) { /* TODO */ }
    public void retrieveData(String type) { /* TODO */ }
    public void requestFilters() { /* TODO */ }
    public void applyFilters(StatisticsFilter filters) { /* TODO */ }
    public boolean noData() { return false; }
    public void showErrorMessage() { /* TODO */ }
}