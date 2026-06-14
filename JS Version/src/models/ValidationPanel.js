/**
 * @brief Panel for inspector to validate tickets.
 */
export class ValidationPanel {
    /** @type {number} */ panelId;

    static open() {
        return { scannerReady: true };
    }
}