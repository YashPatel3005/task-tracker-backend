import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.TOKEN_EXPIRATION;

/**
 * Generate token
 *
 * @param { payload }
 *
 * @returns token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: tokenExpiration });
};
