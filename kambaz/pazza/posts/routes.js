import PazzaPostsDao from "./dao.js";
import PazzaAnswersDao from "../answers/dao.js";
import PazzaDiscussionsDao from "../discussions/dao.js";

export default function PazzaPostRoutes(app) {
  const postsDao = PazzaPostsDao();
  const answersDao = PazzaAnswersDao();
  const discussionsDao = PazzaDiscussionsDao();

  const findPostsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session["currentUser"];
    const posts = await postsDao.findPostsForCourse(courseId);
    const filtered = posts.filter((post) => {
      if (post.postTo === "entireClass") return true;
      if (!currentUser) return false;
      if (post.author === currentUser._id) return true;
      if (currentUser.role === "FACULTY" || currentUser.role === "ADMIN") return true;
      if (post.selectedUsers && post.selectedUsers.includes(currentUser._id)) return true;
      return false;
    });
    res.json(filtered);
  };

  const findPostById = async (req, res) => {
    const { postId } = req.params;
    const post = await postsDao.findPostById(postId);
    if (!post) {
      res.sendStatus(404);
      return;
    }
    res.json(post);
  };

  const createPost = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newPost = await postsDao.createPost({
      ...req.body,
      course: courseId,
      author: currentUser._id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      authorRole: currentUser.role,
    });
    res.json(newPost);
  };

  const updatePost = async (req, res) => {
    const { postId } = req.params;
    const updated = await postsDao.updatePost(postId, req.body);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.json(updated);
  };

  const deletePost = async (req, res) => {
    const { postId } = req.params;
    await answersDao.deleteAnswersForPost(postId);
    await discussionsDao.deleteDiscussionsForPost(postId);
    await postsDao.deletePost(postId);
    res.sendStatus(204);
  };

  const addView = async (req, res) => {
    const { postId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const post = await postsDao.findPostById(postId);
    if (!post) {
      res.sendStatus(404);
      return;
    }
    if (post.viewedBy && post.viewedBy.includes(currentUser._id)) {
      res.json(post);
      return;
    }
    const updated = await postsDao.addView(postId, currentUser._id);
    res.json(updated);
  };

  const getStats = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session["currentUser"];
    const posts = await postsDao.findPostsForCourse(courseId);
    const postIds = posts.map((p) => p._id);

    const totalPosts = posts.length;
    const unreadPosts = currentUser
      ? posts.filter((p) => !p.viewedBy || !p.viewedBy.includes(currentUser._id)).length
      : 0;

    const answers = await Promise.all(
      postIds.map((id) => answersDao.findAnswersForPost(id))
    );
    const allAnswers = answers.flat();
    const instructorResponses = allAnswers.filter((a) => a.type === "instructor").length;
    const studentResponses = allAnswers.filter((a) => a.type === "student").length;

    const questionsWithoutAnswers = [];
    for (const post of posts) {
      if (post.type === "question") {
        const postAnswers = allAnswers.filter((a) => a.post === post._id);
        if (postAnswers.length === 0) {
          questionsWithoutAnswers.push(post._id);
        }
      }
    }

    res.json({
      totalPosts,
      unreadPosts,
      unansweredQuestions: questionsWithoutAnswers.length,
      instructorResponses,
      studentResponses,
    });
  };

  app.get("/api/courses/:courseId/pazza/posts", findPostsForCourse);
  app.post("/api/courses/:courseId/pazza/posts", createPost);
  app.get("/api/courses/:courseId/pazza/stats", getStats);
  app.get("/api/pazza/posts/:postId", findPostById);
  app.put("/api/pazza/posts/:postId", updatePost);
  app.delete("/api/pazza/posts/:postId", deletePost);
  app.put("/api/pazza/posts/:postId/view", addView);
}
