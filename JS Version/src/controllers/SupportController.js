import { readDB, writeDB } from '../database/db.js';

/**
 * @const SupportController
 * @brief Controller object handling customer service interactions and formal system complaints.
 * @details Provides routing logic to process, catalog, and store passenger feedback or assistance queries.
 */
export const SupportController = {
    /**
     * @brief Formally submits a new customer assistance request into the central database.
     * @details Computes an auto-incremented tracking key identifier, maps request payloads against the 
     * current session holder, registers default open statuses, and timestamps the submission profile context.
     * @param {Object} req - Express request object housing body definitions like `requestType` and `description`.
     * @param {Object} res - Express response target dispatching a confirmation log or transmission receipt.
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