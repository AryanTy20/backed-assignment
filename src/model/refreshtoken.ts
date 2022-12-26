import mongoose from "mongoose";

const refreshSchema = new mongoose.Schema({
  id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

export default mongoose.model("RefreshToken", refreshSchema);
