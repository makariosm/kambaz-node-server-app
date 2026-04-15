import PazzaDiscussionsDao from "./dao.js";

export default function PazzaDiscussionRoutes(app) {
  const dao = PazzaDiscussionsDao();

  const findDiscussionsForPost = async (req, res) => {
    const { postId } = req.params;
    const discussions = await dao.findDiscussionsForPost(postId);
    res.json(discussions);
  };

  const createDiscussion = async (req, res) => {
    const { postId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newDiscussion = await dao.createDiscussion({
      ...req.body,
      post: postId,
      author: currentUser._id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
    });
    res.json(newDiscussion);
  };

  const updateDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    const updated = await dao.updateDiscussion(discussionId, req.body);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.json(updated);
  };

  const deleteDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    await dao.deleteDiscussion(discussionId);
    res.sendStatus(204);
  };

  const addReply = async (req, res) => {
    const { discussionId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const updated = await dao.addReply(discussionId, {
      ...req.body,
      author: currentUser._id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
    });
    res.json(updated);
  };

  const updateReply = async (req, res) => {
    const { discussionId, replyId } = req.params;
    const updated = await dao.updateReply(discussionId, replyId, req.body);
    res.json(updated);
  };

  const deleteReply = async (req, res) => {
    const { discussionId, replyId } = req.params;
    const updated = await dao.deleteReply(discussionId, replyId);
    res.json(updated);
  };

  app.get("/api/pazza/posts/:postId/discussions", findDiscussionsForPost);
  app.post("/api/pazza/posts/:postId/discussions", createDiscussion);
  app.put("/api/pazza/discussions/:discussionId", updateDiscussion);
  app.delete("/api/pazza/discussions/:discussionId", deleteDiscussion);
  app.post("/api/pazza/discussions/:discussionId/replies", addReply);
  app.put("/api/pazza/discussions/:discussionId/replies/:replyId", updateReply);
  app.delete("/api/pazza/discussions/:discussionId/replies/:replyId", deleteReply);
}
