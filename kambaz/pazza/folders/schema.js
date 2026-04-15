import mongoose from "mongoose";

const pazzaFolderSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    name: String,
  },
  { collection: "pazza_folders" }
);
export default pazzaFolderSchema;
