package org.example.model;


public class TrainOption {
    private int optionId;
    private double totalPrice;
    private int availableSeats;

    // UC1 – Search Train
    public double displayTotal() { return this.totalPrice; }
}
