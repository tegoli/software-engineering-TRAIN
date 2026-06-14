export class Notification {
    /** @type {number} */ notificationId;
    /** @type {string} */ message;
    /** @type {Date} */ notificationDate;
    /** @type {string} */ notificationType; // 'delay', 'cancellation'

    pushInAppAlert(userId) {
        // send alert via WebSocket
    }

    sendEmailNotification(email) {
        // send email via SMTP
    }
}