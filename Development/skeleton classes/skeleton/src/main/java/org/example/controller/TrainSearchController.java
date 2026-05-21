package org.example.controller;


import org.example.util.SearchCriteria;
import org.example.util.Location;
import java.time.LocalDateTime;

public class TrainSearchController {
    public void search(SearchCriteria criteria, boolean mapOpt) { /* TODO */ }
    public void resolve(Location coords) { /* TODO */ }
    public void queryTrains(String stationCodes, LocalDateTime date, String travelClass) { /* TODO */ }
    public void getDelayPredictions(String trainIds) { /* TODO */ }
    public void displayResults(Object trainList, Object predictions) { /* TODO */ }
    public void requestLiveBoard(String stationName) { /* TODO */ }
    public void refreshData() { /* TODO */ }
    public void requestTrainStatus(int trainId) { /* TODO */ }
}