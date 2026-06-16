/**
 * @class Notification
 * @brief Sends messages to users about what's happening with their trip.
 * @details Stores info about alerts and decides if they show up in the app or get sent by email.
 */
export class Notification {
    /** @brief Unique ID for this notification in the database.
     * @type {number} 
     */ 
    notificationId;

    /** @brief The text shown to the passenger.
     * @type {string} 
     */ 
    message;

    /** @brief When this notification was created.
     * @type {Date} 
     */ 
    notificationDate;

    /** @brief What kind of alert this is (e.g., 'delay', 'cancellation').
     * @type {string} 
     */ 
    notificationType; // 'delay', 'cancellation'

    /**
     * @brief Shows the alert right away in the user's app.
     * @details Sends the message over a live WebSocket connection so the user sees it immediately.
     * @param {number|string} userId - The user to send the alert to.
     * @return {void}
     */
    pushInAppAlert(userId) {
        // send alert via WebSocket
    }

    /**
     * @brief Sends the notification through email instead.
     * @details Puts the message in a queue to be sent out later by the email system.
     * @param {string} email - The user's email address.
     * @return {void}
     */
    sendEmailNotification(email) {
        // send email via SMTP
    }
}
