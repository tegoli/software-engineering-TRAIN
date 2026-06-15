/**
 * @file CryptoUtils.js
 * @brief Cryptographic and token generation utility functions for securing database records and sessions.
 * @details Leverages the native Node.js crypto module to deliver deterministic data hashing routines 
 * for protecting user account passwords and pseudo-random byte generation for session keys.
 */

import crypto from 'crypto';

/**
 * @brief Transforms a raw string password into a non-reversible cryptographic hash digest using the SHA-256 algorithm.
 * @details Converts the plaintext sequence into a fixed-length hexadecimal representation, preventing exposure 
 * of sensitive user keys within the data storage layer.
 * @param {string} pwd - The raw plaintext password string to be processed.
 * @returns {string} A 64-character hexadecimal representation string of the hashed input.
 */
export function hashPassword(pwd) {
    return crypto.createHash('sha256').update(pwd).digest('hex');
}

/**
 * @brief Generates a cryptographically strong pseudo-random session token string.
 * @details Creates high-entropy binary buffers that are cast into safe alphanumeric keys, suitable 
 * for stateless session tokens, bearer cookies, and authentication headers.
 * @returns {string} A random 64-character hexadecimal session token string.
 */
export function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}