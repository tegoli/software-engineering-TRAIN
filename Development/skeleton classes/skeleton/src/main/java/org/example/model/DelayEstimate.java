package org.example.model;


public class DelayEstimate {
    private int estimateId;
    private int delayMinutes;
    private double confidence;

    // UC5 – Check Train Status
    public int getDelayPrediction(int trainId) { return this.delayMinutes; }
}
