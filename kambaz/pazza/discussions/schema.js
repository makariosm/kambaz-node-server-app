import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  _id: String,
  text: String,
  author: String,
  authorName: String,
  createdAt: { type: Date, default: Date.now },
});

const pazzaDiscussionSchema = new mongoose.Schema(
  {
    _id: String,
    post: { type: String, ref: "PazzaPostModel" },
    text: String,
    author: { type: String, ref: "UserModel" },
    authorName: String,
    resolved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    replies: [replySchema],
  },
  { collection: "pazza_discussions" }
);
export default pazzaDiscussionSchema;
