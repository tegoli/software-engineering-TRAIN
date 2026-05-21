package org.example.model;

import org.example.enums.BoardEntryStatus;
import java.time.LocalDateTime;

public class BoardEntry {
    private LocalDateTime scheduledTime;
    private LocalDateTime estimatedTime;
    private String platform;
    private BoardEntryStatus entryStatus;

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public LocalDateTime getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(LocalDateTime estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public BoardEntryStatus getEntryStatus() {
        return entryStatus;
    }

    public void setEntryStatus(BoardEntryStatus entryStatus) {
        this.entryStatus = entryStatus;
    }
}