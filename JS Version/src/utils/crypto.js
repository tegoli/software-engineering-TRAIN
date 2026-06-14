/**
 * @file Cryptographic utilities.
 */

import crypto from 'crypto';

/**
 * Hashes a password using SHA-256.
 * @param {string} pwd
 * @returns {string}
 */
export function hashPassword(pwd) {
    return crypto.createHash('sha256').update(pwd).digest('hex');
}

/**
 * Generates a random session token.
 * @returns {string}
 */
export function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}
