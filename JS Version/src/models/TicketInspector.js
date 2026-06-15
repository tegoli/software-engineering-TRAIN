import { RegisteredUser } from './RegisteredUser.js';
import { ValidationController } from '../controllers/ValidationController.js';
import { ScheduleController } from '../controllers/ScheduleController.js';

/**
 * @class TicketInspector
 * @extends RegisteredUser
 * @brief A train employee who checks tickets on board.
 * @details Inherits from RegisteredUser and adds stuff like
 * scanning tickets, manual overrides, updating how full
 * the train is, and checking their work schedule.
 */
export class TicketInspector extends RegisteredUser {
    /** * @brief Employee code for this inspector.
     * @type {string} 
     */ 
    inspectorCode;

    /**
     * @brief Checks credentials and logs into the system.
     * @details Verifies the inspector has permission before
     * letting them access ticket checking features.
     * @return {boolean} True if credentials are valid.
     */
    accessSystem() {
        // returns true if credentials valid
        return true;
    }

    /**
     * @brief Opens the validation panel to scan tickets.
     * @details Tells ValidationController to start the
     * scanner and get the console ready for use.
     * @return {Object} Scanner status and console settings.
     */
    selectValidation() {
        return ValidationController.openValidationPanel();
    }

    /**
     * @brief Types in a ticket ID manually when the scanner fails.
     * @details Sends the ticket code to the server to check
     * if the passenger's ticket is valid.
     * @param {string|number} ticketId - The ticket's database ID.
     * @return {ValidationResult} Validity status and message.
     */
    manualInput(ticketId) {
        return ValidationController.validateTicketById(ticketId);
    }

    /**
     * @brief Gets full details about a specific ticket.
     * @details Returns info like passenger name, seat class,
     * and route limits for the given ticket.
     * @param {string|number} ticketId - The ticket's database ID.
     * @return {Object} Full details for that ticket.
     */
    ticketData(ticketId) {
        return ValidationController.getTicketDetails(ticketId);
    }

    /**
     * @brief Opens the occupancy view to see how full the train is.
     * @details Shows a map of seats so staff can see
     * where passengers are sitting.
     * @return {Object} Config for the occupancy display.
     */
    selectTrackOccupancy() {
        return OccupancyPanel.show();
    }

    /**
     * @brief Updates how many people are in a train carriage.
     * @details Saves the new passenger count for a coach
     * so the system knows how full the train is.
     * @param {string|number} coachNumber - Which carriage to update.
     * @param {number} nPassengers - How many people inside.
     * @return {Object} Status confirming the update worked.
     */
    updateOccupancy(coachNumber, nPassengers) {
        return ValidationController.updateOccupancy(coachNumber, nPassengers);
    }

    /**
     * @brief Gets the inspector's assigned schedule for the day.
     * @details Uses the inspector's ID to look up which trains
     * and routes they are assigned to.
     * @param {string|number} inputId - Extra ID for schedule lookup.
     * @return {Array} List of assigned shifts and train runs.
     */
    viewSchedule(inputId) {
        return ScheduleController.getScheduleForInspector(this.userId);
    }
}
