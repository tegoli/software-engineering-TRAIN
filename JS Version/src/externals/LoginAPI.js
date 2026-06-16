/**
 * @class LoginAPI
 * @brief Mock API that simulates an external authentication provider.
 * @methods checkEmailUnique, validateCredentials, createSession, terminateSession
 */
export class LoginAPI {
    /**
     * @brief Checks if an email is already registered.
     * @param {string} email - The email to check.
     * @return {boolean} True if the email is not in use.
     */
    checkEmailUnique(email) { return true; }

    /**
     * @brief Validates login credentials.
     * @param {string} email - The user email.
     * @param {string} password - The password.
     * @return {boolean} True if credentials match.
     */
    validateCredentials(email, password) { return true; }

    /**
     * @brief Creates a new session for the user.
     * @param {Object} userData - User data to store in the session.
     * @return {void}
     */
    createSession(userData) { console.log('Sessione esterna creata'); }

    /**
     * @brief Terminates an active session.
     * @param {string} token - The session token to invalidate.
     * @return {void}
     */
    terminateSession(token) { }
}
