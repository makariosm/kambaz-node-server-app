import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("PazzaDiscussionModel", schema);
export default model;
