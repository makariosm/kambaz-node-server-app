import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function PazzaDiscussionsDao() {
  function findDiscussionsForPost(postId) {
    return model.find({ post: postId }).sort({ createdAt: 1 });
  }

  function createDiscussion(discussion) {
    const newDiscussion = { ...discussion, _id: uuidv4(), createdAt: new Date(), replies: [] };
    return model.create(newDiscussion);
  }

  function updateDiscussion(discussionId, updates) {
    return model.findByIdAndUpdate(discussionId, { $set: updates }, { new: true });
  }

  function deleteDiscussion(discussionId) {
    return model.deleteOne({ _id: discussionId });
  }

  function addReply(discussionId, reply) {
    const newReply = { ...reply, _id: uuidv4(), createdAt: new Date() };
    return model.findByIdAndUpdate(
      discussionId,
      { $push: { replies: newReply } },
      { new: true }
    );
  }

  function updateReply(discussionId, replyId, updates) {
    return model.findOneAndUpdate(
      { _id: discussionId, "replies._id": replyId },
      { $set: { "replies.$.text": updates.text } },
      { new: true }
    );
  }

  function deleteReply(discussionId, replyId) {
    return model.findByIdAndUpdate(
      discussionId,
      { $pull: { replies: { _id: replyId } } },
      { new: true }
    );
  }

  function deleteDiscussionsForPost(postId) {
    return model.deleteMany({ post: postId });
  }

  return {
    findDiscussionsForPost,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
    addReply,
    updateReply,
    deleteReply,
    deleteDiscussionsForPost,
  };
}
