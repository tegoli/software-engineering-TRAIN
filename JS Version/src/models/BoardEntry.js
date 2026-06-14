/**
 * @file Single row in departure/arrival board.
 */
export class BoardEntry {
    /** @type {Date} */ scheduledTime;
    /** @type {Date} */ estimatedTime;
    /** @type {string} */ platform;
    /** @type {string} */ entryStatus; // 'on-time', 'delayed', 'cancelled'
}