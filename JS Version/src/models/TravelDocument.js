/**
 * @class TravelDocument
 * @brief Base class for all types of travel tickets and passes.
 * @details Defines common fields like price, issue date, and status that all ticket types share.
 */
export class TravelDocument {
    /** * @brief Unique ID for this document.
     * @type {number} 
     */ 
    documentId;

    /** * @brief When the document was issued.
     * @type {Date} 
     */ 
    issueDate;

    /** * @brief How much the document cost.
     * @type {number} 
     */ 
    price;

    /** * @brief Current state of the document.
     * @type {string} 
     */ 
    status; // 'active', 'used', 'expired'

    /** * @brief QR code string used for scanning at the gate.
     * @type {string} 
     */ 
    qrCode;

    /**
     * @brief Checks if the ticket is valid for travel.
     * @details Subclasses must override this to check route and time rules.
     * @abstract
     * @throws {Error} Throws an operational exception if invoked directly without concrete subtype implementation.
     * @return {ValidationResult}
     */
    validate() {
        // implemented by subclasses
        throw new Error('Not implemented');
    }

    /**
     * @brief Checks if the document can be used for boarding right now.
     * @details Looks at the status field to see if the document is active.
     * @param {Date} currentDate - Current date for checking validity.
     * @return {boolean} True if the document is active.
     */
    isActive(currentDate) {
        return this.status === 'active';
    }
}
