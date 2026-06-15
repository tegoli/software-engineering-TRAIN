/**
 * @file Stop.js
 * @brief Domain entity model representing an explicit schedule checkpoint or station stop along a train route.
 * @details Captures critical itinerary stop sequence orders, scheduled versus real-time arrival/departure metrics, 
 * and platform track assignments to supply tracking boards and routing matrix engines.
 */
export class Stop {
    /** * @brief Sequential position index tracking this stop's location along the linear journey timeline.
     * @type {number} 
     */ 
    stopOrder;

    /** * @brief Unique database identifier key linking this stop entry to a physical train station node.
     * @type {number} 
     */ 
    stationId;

    /** * @brief Target arrival time published in the master timetable layout formatted in 'HH:MM' precision.
     * @type {string} 
     */ 
    scheduledArrival;   // HH:MM

    /** * @brief Target departure time published in the master timetable layout formatted in 'HH:MM' precision.
     * @type {string} 
     */ 
    scheduledDeparture; // HH:MM

    /** * @brief Dynamically recalculated arrival timestamp estimation tracking live network speed fluctuations.
     * @type {string} 
     */ 
    estimatedArrival;

    /** * @brief Dynamically recalculated departure timestamp estimation tracking live network speed fluctuations.
     * @type {string} 
     */ 
    estimatedDeparture;

    /** * @brief Designated platform or track assignment identifier where the physical rolling stock assets dock.
     * @type {string} 
     */ 
    trackNumber;
}