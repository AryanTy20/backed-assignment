import dotenv from "dotenv";
dotenv.config();

export const { DB_URL, SIGN_TOKEN, REFRESH_TOKEN } = process.env;
