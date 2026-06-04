export class Notification {
    constructor(notificationId, message, notificationDate, notificationType) {
        this.notificationId = notificationId;
        this.message = message;
        this.notificationDate = notificationDate;
        this.notificationType = notificationType;
    }
    pushInAppAlert() { console.log(`Notifica in-app: ${this.message}`); }
    sendEmailNotification() { console.log(`Email: ${this.message}`); }
}