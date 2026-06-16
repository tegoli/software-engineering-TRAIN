/**
 * @file crypto.js
 * @brief Cryptographic utility functions for hashing and token generation.
 * @details Uses Node.js crypto module to hash passwords and generate random session tokens.
 */

import crypto from 'crypto';

/**
 * @brief Hashes a password using SHA-256.
 * @param {string} pwd - The password to hash.
 * @returns {string} The hashed password as a hex string.
 */
export function hashPassword(pwd) {
    return crypto.createHash('sha256').update(pwd).digest('hex');
}

/**
 * @brief Generates a random session token.
 * @returns {string} A random 64-character hex token.
 */
export function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}
