import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function PazzaPostsDao() {
  function findPostsForCourse(courseId) {
    return model.find({ course: courseId }).sort({ createdAt: -1 });
  }

  function findPostById(postId) {
    return model.findById(postId);
  }

  function createPost(post) {
    const newPost = { ...post, _id: uuidv4(), createdAt: new Date() };
    return model.create(newPost);
  }

  function updatePost(postId, postUpdates) {
    return model.findByIdAndUpdate(postId, { $set: postUpdates }, { new: true });
  }

  function deletePost(postId) {
    return model.deleteOne({ _id: postId });
  }

  function addView(postId, userId) {
    return model.findByIdAndUpdate(
      postId,
      { $addToSet: { viewedBy: userId }, $inc: { views: 1 } },
      { new: true }
    );
  }

  function deletePostsForCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  return {
    findPostsForCourse,
    findPostById,
    createPost,
    updatePost,
    deletePost,
    addView,
    deletePostsForCourse,
  };
}
