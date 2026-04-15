import mongoose from "mongoose";

const pazzaPostSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    type: { type: String, enum: ["question", "note"], default: "question" },
    postTo: { type: String, enum: ["entireClass", "individual"], default: "entireClass" },
    selectedUsers: [String],
    folders: [String],
    summary: String,
    details: String,
    author: { type: String, ref: "UserModel" },
    authorName: String,
    authorRole: String,
    createdAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    viewedBy: [String],
  },
  { collection: "pazza_posts" }
);
export default pazzaPostSchema;
