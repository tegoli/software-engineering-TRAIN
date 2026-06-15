/**
 * @class TravelDocumentSummary
 * @brief Structured data transfer object containing consolidated metrics for active transit assets.
 * @details Compiles high-level ticket summaries, active travel pass counts, and subscription status 
 * parameters into a lightweight data structure ideal for dashboard widgets or user navigation bars.
 */
export class TravelDocumentSummary {
    /** * @brief Total number of valid, unexpired, or currently active transit credentials.
     * @type {number} 
     */ 
    activeCount;

    /** * @brief Collection of concise metadata records summarizing each travel credential (e.g., origin, destination, validity window).
     * @type {Array} 
     */ 
    summaries;
}