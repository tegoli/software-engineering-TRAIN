package org.example.model;


import org.example.enums.TrainRunStatus;
import java.time.LocalDate;

public class TrainRun {
    private int runId;
    private LocalDate departureDate;
    private TrainRunStatus status;
    private int currentDelayMinutes;

    // UC5 – Check Train Status
    public void reportDelay(int trainId, int delayTime) { /* TODO */ }

    // UC5 / UC6 – Refresh data
    public void refreshData() { /* TODO */ }
}
