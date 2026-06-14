import { readDB, writeDB } from '../database/db.js';

export const SupportController = {
    submit(req, res) {
        const { requestType, ticketRef, description } = req.body;
        const db = readDB();
        const newId = Math.max(...db.supportRequests.map(r => r.requestId), 0) + 1;
        db.supportRequests.push({
            requestId: newId,
            userId: req.user.userId,
            requestType,
            description,
            status: 'open',
            creationDate: new Date().toISOString(),
            resolution: null
        });
        writeDB(db);
        res.json({ success: true, message: 'Richiesta inviata' });
    }
};