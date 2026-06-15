/**
 * @file OccupancyPanel.js
 * @brief Panel used by inspectors to track and update train occupancy.
 * @details Provides static methods to get coach occupancy data for display.
 */
export class OccupancyPanel {
    /** @type {number} */ panelId;

    /**
     * @brief Returns the initial occupancy panel data.
     * @return {Object} An object with coach and passenger count.
     */
    static show() {
        return { coach: 1, passengers: 0 };
    }
}
