import dotenv from "dotenv";
dotenv.config();

/* Exporting the values of the variables DB_URL, SIGN_TOKEN, and REFRESH_TOKEN from the process.env
file. */
export const { DB_URL, SIGN_TOKEN, REFRESH_TOKEN } = process.env;
