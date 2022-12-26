import mongoose from "mongoose";
import { DB_URL } from "../config";

export const DbConnect = async () => {
  mongoose
    .connect(DB_URL as string)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));
};
