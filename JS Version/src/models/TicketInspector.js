import { RegisteredUser } from './RegisteredUser.js';
import { ValidationController } from '../controllers/ValidationController.js';
import { ScheduleController } from '../controllers/ScheduleController.js';

export class TicketInspector extends RegisteredUser {
    /** @type {string} */ inspectorCode;

    accessSystem() {
        // returns true if credentials valid
        return true;
    }

    selectValidation() {
        return ValidationController.openValidationPanel();
    }

    manualInput(ticketId) {
        return ValidationController.validateTicketById(ticketId);
    }

    ticketData(ticketId) {
        return ValidationController.getTicketDetails(ticketId);
    }

    selectTrackOccupancy() {
        return OccupancyPanel.show();
    }

    updateOccupancy(coachNumber, nPassengers) {
        return ValidationController.updateOccupancy(coachNumber, nPassengers);
    }

    viewSchedule(inputId) {
        return ScheduleController.getScheduleForInspector(this.userId);
    }
}