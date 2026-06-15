/**
 * @file StatisticsFilter.js
 * @brief Configuration data transfer object used to target specific parameters within reporting modules.
 * @details Encapsulates search constraints, temporal bounds, and metric classifications to narrow down 
 * large operational datasets before chart rendering or accounting review pipelines execute.
 */
export class StatisticsFilter {
    /** * @brief Target calendar date or timeline horizon constraint used to isolate analytical data logs.
     * @type {Date} 
     */ 
    date;

    /** * @brief Specific transit corridor identifier, line tag, or route designation sequence to query.
     * @type {string} 
     */ 
    trainLine;

    /** * @brief Analytical processing track domain designator (e.g., 'revenue', 'bookings', 'delays').
     * @type {string} 
     */ 
    type; // 'revenue', 'bookings', 'delays'
}