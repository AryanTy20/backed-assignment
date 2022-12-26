export interface ExtendedError extends Error {
  status: number;
}

/**
 * It creates a new Error object, extends it with a status property, and returns it
 * @param {number} status - The HTTP status code of the error.
 * @param {string} message - The error message
 * @returns A function that takes two parameters and returns an error object.
 */
export const CustomError = (status: number, message: string) => {
  const err = new Error() as ExtendedError;
  err.message = message;
  err.status = status;
  return err;
};
