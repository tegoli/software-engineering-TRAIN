package org.example.util;


import java.time.LocalDate;

public class StatisticsFilter {
    private LocalDate date;
    private String trainLine;
    private String type;

    // getter/setter
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getTrainLine() { return trainLine; }
    public void setTrainLine(String trainLine) { this.trainLine = trainLine; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
