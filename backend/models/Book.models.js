import mongoose from "mongoose";
import { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);
export default mongoose.model("Books", bookSchema);
