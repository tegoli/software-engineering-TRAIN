export class LoginAPI {
    checkEmailUnique(email) { return true; }
    validateCredentials(email, password) { return true; }
    createSession(userData) { console.log('Sessione esterna creata'); }
    terminateSession(token) { }
}