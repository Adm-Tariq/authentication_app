import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    first_name: {
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
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
