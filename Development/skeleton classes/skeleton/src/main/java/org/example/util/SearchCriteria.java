package org.example.util;


import org.example.enums.TrainType;
import org.example.enums.TravelClass;
import java.time.LocalDate;
import java.time.LocalTime;

public class SearchCriteria {
    private String departureStationName;
    private String arrivalStationName;
    private LocalDate date;
    private LocalTime time;
    private TrainType trainType;
    private TravelClass travelClass;
    private int passengerCount;

    public boolean validate() { return true; }
}