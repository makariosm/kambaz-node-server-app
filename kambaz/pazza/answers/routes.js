import PazzaAnswersDao from "./dao.js";

export default function PazzaAnswerRoutes(app) {
  const dao = PazzaAnswersDao();

  const findAnswersForPost = async (req, res) => {
    const { postId } = req.params;
    const answers = await dao.findAnswersForPost(postId);
    res.json(answers);
  };

  const createAnswer = async (req, res) => {
    const { postId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const answerType =
      currentUser.role === "FACULTY" || currentUser.role === "ADMIN"
        ? "instructor"
        : "student";
    const newAnswer = await dao.createAnswer({
      ...req.body,
      post: postId,
      author: currentUser._id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      authorRole: currentUser.role,
      type: answerType,
    });
    res.json(newAnswer);
  };

  const updateAnswer = async (req, res) => {
    const { answerId } = req.params;
    const updated = await dao.updateAnswer(answerId, req.body);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.json(updated);
  };

  const deleteAnswer = async (req, res) => {
    const { answerId } = req.params;
    await dao.deleteAnswer(answerId);
    res.sendStatus(204);
  };

  app.get("/api/pazza/posts/:postId/answers", findAnswersForPost);
  app.post("/api/pazza/posts/:postId/answers", createAnswer);
  app.put("/api/pazza/answers/:answerId", updateAnswer);
  app.delete("/api/pazza/answers/:answerId", deleteAnswer);
}
