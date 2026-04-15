import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function PazzaAnswersDao() {
  function findAnswersForPost(postId) {
    return model.find({ post: postId }).sort({ createdAt: 1 });
  }

  function createAnswer(answer) {
    const newAnswer = { ...answer, _id: uuidv4(), createdAt: new Date() };
    return model.create(newAnswer);
  }

  function updateAnswer(answerId, answerUpdates) {
    return model.findByIdAndUpdate(answerId, { $set: answerUpdates }, { new: true });
  }

  function deleteAnswer(answerId) {
    return model.deleteOne({ _id: answerId });
  }

  function deleteAnswersForPost(postId) {
    return model.deleteMany({ post: postId });
  }

  function countAnswersForCourse(courseId, postIds) {
    return model.countDocuments({ post: { $in: postIds } });
  }

  function countAnswersByRole(postIds, role) {
    return model.countDocuments({ post: { $in: postIds }, type: role });
  }

  return {
    findAnswersForPost,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    deleteAnswersForPost,
    countAnswersForCourse,
    countAnswersByRole,
  };
}
