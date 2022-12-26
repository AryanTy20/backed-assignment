import mongoose from "mongoose";

/* Creating a new schema for the refresh token. */
const refreshSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Refreshtoken", refreshSchema);
