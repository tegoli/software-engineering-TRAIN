import { readDB, writeDB } from '../database/db.js';

/**
 * @const SupportController
 * @brief Handles customer support requests.
 * @details Allows users to submit support requests which are stored in the database.
 */
export const SupportController = {
    /**
     * @brief Submits a new support request.
     * @details Creates a support ticket with the given type and description,
     * linked to the authenticated user.
     * @param {Object} req - Express request with requestType and description in the body.
     * @param {Object} res - Express response object.
     * @return {void}
     */
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