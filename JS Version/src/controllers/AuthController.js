export class AuthController {
    register(name, email, password) { console.log(`Registra ${name}`); }
    checkEmailUnique(email) { return true; }
    createAccount(userData) { console.log('Account creato', userData); }
    login(email, password) { console.log(`Login tentativo: ${email}`); }
    validateCredentials(email, password) { return true; }
    createSession(email) { console.log(`Sessione creata per ${email}`); }
    incrementFailedAttempts(email) { }
    checkFailCount(email) { return 0; }
    lockAccount(email) { console.log(`Account bloccato: ${email}`); }
    logout() { console.log('Logout'); }
    terminateSession(token) { }
    validateChange(oldPass, newPass) { return true; }
    verifyComplexity(password) { return password.length >= 8; }
    updateCredentials(userId, newPass) { }
    triggerResetLink(email) { }
}