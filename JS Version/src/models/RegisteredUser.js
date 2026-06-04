import { User } from './User.js';

export class RegisteredUser extends User {
    constructor(userId, name, surname, email, preferredLanguage, passwordHash, accountStatus, failedLoginAttempts) {
        super(userId, name, surname, email, preferredLanguage);
        this.passwordHash = passwordHash;
        this.accountStatus = accountStatus;
        this.failedLoginAttempts = failedLoginAttempts;
    }
    login(email, password) { console.log('login'); }
    logout() { console.log('logout'); }
    changePassword(oldPass, newPass) { }
    requestPasswordRecovery(email) { }
    eliminateAccount() { }
    viewActiveDocuments() { }
}