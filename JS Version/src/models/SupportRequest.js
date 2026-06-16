/**
 * @class SupportRequest
 * @brief Tracks customer support tickets like refunds or complaints.
 * @details Stores info about requests people submit and
 * keeps track of whether they are open or closed.
 */
export class SupportRequest {
    /** * @brief Unique ID for this support request.
     * @type {number} 
     */ 
    requestId;

    /** * @brief Type like 'refund', 'info', or 'complaint'.
     * @type {string} 
     */ 
    requestType; // 'refund', 'info', 'complaint'

    /** * @brief Text describing what the customer needs.
     * @type {string} 
     */ 
    description;

    /** * @brief Current status like 'open' or 'closed'.
     * @type {string} 
     */ 
    status; // 'open', 'closed'

    /** * @brief When the request was created.
     * @type {Date} 
     */ 
    creationDate;

    /**
     * @brief Submits the request and sets it to open.
     * @details Changes the status to 'open' and saves
     * the request to the database for staff to see.
     * @return {void}
     */
    submit() {
        this.status = 'open';
        // save to DB
    }

    /**
     * @brief Closes the support request.
     * @details Sets the status to 'closed' so nobody
     * works on it anymore.
     * @return {void}
     */
    close() {
        this.status = 'closed';
    }
}
