import mongoose from "mongoose";

/* Creating a schema for the user model. */
const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    department: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
