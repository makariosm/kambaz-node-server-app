import mongoose from "mongoose";

const pazzaAnswerSchema = new mongoose.Schema(
  {
    _id: String,
    post: { type: String, ref: "PazzaPostModel" },
    content: String,
    author: { type: String, ref: "UserModel" },
    authorName: String,
    authorRole: String,
    type: { type: String, enum: ["student", "instructor"] },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "pazza_answers" }
);
export default pazzaAnswerSchema;
