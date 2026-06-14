/**
 * @file Filter criteria for statistics.
 */
export class StatisticsFilter {
    /** @type {Date} */ date;
    /** @type {string} */ trainLine;
    /** @type {string} */ type; // 'revenue', 'bookings', 'delays'
}