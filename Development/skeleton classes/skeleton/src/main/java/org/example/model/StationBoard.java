package org.example.model;


import org.example.enums.BoardType;
import java.time.LocalDateTime;

public class StationBoard {
    private int boardId;
    private BoardType boardType;
    private LocalDateTime lastUpdate;

    // UC6 – Boards Visualization
    public void updateDisplay() { /* TODO */ }
}
