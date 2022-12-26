import bcrypt from "bcrypt";
/**
 * It takes a password as a string, generates a salt, and then hashes the password with the salt
 * @param {string} password - The password that you want to hash.
 * @returns A hashed password
 */
export const hashedPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};
