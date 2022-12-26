export interface ExtendedError extends Error {
  status: number;
}

export const CustomError = (status: number, message: string) => {
  const err = new Error() as ExtendedError;
  err.message = message;
  err.status = status;
  return err;
};
