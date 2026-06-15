import { readDB, writeDB } from '../database/db.js';

/**
 * @const NotificationController
 * @brief Controller object handling real-time and historical notification management for users.
 * @details Manages secure reading operations, filtering items by individual account metrics, 
 * and updating internal read/unread states.
 */
export const NotificationController = {
    /**
     * @brief Retrieves all alerts or message logs belonging to the currently authenticated user.
     * @details Parses incoming session context parameters to filter global notification indexes 
     * by user identity before packing the results into a structured JSON array.
     * @param {Object} req - Express request object containing verified `user` session variables.
     * @param {Object} res - Express response object delivering parsed JSON notification arrays.
     * @return {void}
     */
    getNotifications(req, res) {
        const db = readDB();
        const userNotifs = db.notifications.filter(n => n.userId === req.user.userId);
        res.json({ notifications: userNotifs });
    },

    /**
     * @brief Marks a designated alert as read after ensuring proper user ownership boundaries.
     * @details Extracts the target notification identifier, validates ownership limits against 
     * the active requester, flips the internal `read` tracking status, and flushes structural changes back to disk.
     * @param {Object} req - Express request object with path configurations containing the target resource ID.
     * @param {Object} res - Express response target dispatching error codes or execution status updates.
     * @return {Object|void} Sends a 404 response if the item cannot be resolved, otherwise returns success status.
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