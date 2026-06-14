import { readDB, writeDB } from '../database/db.js';

export const NotificationController = {
    getNotifications(req, res) {
        const db = readDB();
        const userNotifs = db.notifications.filter(n => n.userId === req.user.userId);
        res.json({ notifications: userNotifs });
    },

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