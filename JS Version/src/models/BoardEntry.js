export class BoardEntry {
    constructor(scheduledTime, estimatedTime, platform, entryStatus) {
        this.scheduledTime = scheduledTime;
        this.estimatedTime = estimatedTime;
        this.platform = platform;
        this.entryStatus = entryStatus;
    }
}