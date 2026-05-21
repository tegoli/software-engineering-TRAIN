package org.example.model;


import org.example.enums.TrainType;
import org.example.enums.TravelClass;

public class Train {
    private int trainId;
    private String trainCode;
    private TrainType trainType;
    private TravelClass serviceClass;

    // UC5 – Check Train Status
    public void getLiveLocation(int trainId) { /* TODO */ }
    public int getDelayEstimate(int trainId) { return 0; }
}