/**
 * @file Request to modify a ticket.
 */
export class TicketChangeRequest {
    /** @type {Date} */ newDate;
    /** @type {string} */ newTime;
    /** @type {string} */ changeType; // 'full' or 'time-only'

    validateAgainstThreshold(departureTime) {
        const hoursLeft = (departureTime - new Date()) / (1000 * 3600);
        return hoursLeft > 24 ? 'full' : 'time-only';
    }
}