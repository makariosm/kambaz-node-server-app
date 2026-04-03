import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
  const dao = EnrollmentsDao();

  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const enrollments = await dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };

  const enrollUserInCourse = async (req, res) => {
    let { userId } = req.params;
    const { courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const enrollment = await dao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  };

  const unenrollUserFromCourse = async (req, res) => {
    let { userId } = req.params;
    const { courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    await dao.unenrollUserFromCourse(userId, courseId);
    res.sendStatus(204);
  };

  app.get("/api/users/:userId/enrollments", findCoursesForEnrolledUser);
  app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
  app.delete("/api/users/:userId/courses/:courseId", unenrollUserFromCourse);
}
