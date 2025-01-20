import bcrypt from "bcrypt";

const saltRounds = 10;

/**
 * Hash password
 *
 * @param { password }
 *
 * @returns hashed password
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare password
 *
 * @param { password, hashedPassword }
 *
 * @returns boolean
 */
export const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
