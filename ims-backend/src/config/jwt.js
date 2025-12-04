// src/config/jwt.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

/**
 * Sign a JWT with default options.
 * @param {object} payload - Data to embed in the token (e.g. { userId, email, role }).
 * @param {object} [options] - Extra jwt.sign options (overrides defaults).
 */
function signToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    ...options,
  });
}

/**
 * Verify and decode a JWT.
 * @param {string} token - The JWT string (without "Bearer ").
 * @returns {object} decoded payload
 * @throws if token is invalid or expired
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  signToken,
  verifyToken,
};
