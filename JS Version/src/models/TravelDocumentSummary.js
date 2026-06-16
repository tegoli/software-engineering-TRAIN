/**
 * @class TravelDocumentSummary
 * @brief Holds summary data about a user's active travel documents.
 * @details Puts together ticket info, active passes, and subscription stuff
 * so it can be shown in a dashboard or nav bar.
 */
export class TravelDocumentSummary {
    /** * @brief How many valid and unexpired travel documents the user has.
     * @type {number} 
     */ 
    activeCount;

    /** * @brief Short info records for each travel document.
     * @type {Array} 
     */ 
    summaries;
}
