import { RegisteredUser } from './RegisteredUser.js';

export class CustomerSupportAgent extends RegisteredUser {
    constructor(...args) {
        super(...args);
        this.staffCode = '';
    }
    viewUserProfile(userId) { }
    manageSupportRequest(requestId) { }
    viewLoyaltyPointsBalance(userId) { }
    viewSchedule(staffId) { }
}