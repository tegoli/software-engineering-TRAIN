import { readDB, writeDB } from '../database/db.js';

/**
 * @const NotificationController
 * @brief Handles user notifications: fetching and marking as read.
 * @details Returns notifications for the logged-in user and allows marking them as read.
 */
export const NotificationController = {
    /**
     * @brief Gets all notifications for the authenticated user.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @return {void}
     */
    getNotifications(req, res) {
        const db = readDB();
        const userNotifs = db.notifications.filter(n => n.userId === req.user.userId);
        res.json({ notifications: userNotifs });
    },

    /**
     * @brief Marks a notification as read.
     * @details Checks that the notification belongs to the current user before updating it.
     * @param {Object} req - Express request with notification id as a route parameter.
     * @param {Object} res - Express response object.
     * @return {Object|void} 404 if the notification is not found, otherwise success.
     */
    markAsRead(req, res) {
        const notifId = parseInt(req.params.id);
        const db = readDB();
        const notif = db.notifications.find(n => n.notificationId === notifId && n.userId === req.user.userId);
        if (!notif) return res.status(404).json({ error: 'Notifica non trovata' });
        notif.read = true;
        writeDB(db);
        res.json({ success: true });
    }
};