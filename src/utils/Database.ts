import mongoose from "mongoose";
import { DB_URL } from "../config";

/**
 * It connects to the database using the DB_URL constant
 */
export const DbConnect = async () => {
  mongoose
    .connect(DB_URL as string)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));
};
