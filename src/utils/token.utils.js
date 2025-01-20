import jwt from "jsonwebtoken";
import config from "config";

const secretKey = config.get("jwtSecret");
const tokenExpiration = config.get("tokenExpiration");

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
