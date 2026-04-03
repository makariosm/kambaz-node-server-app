import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  const dao = AssignmentsDao();

  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const findAssignmentById = async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await dao.findAssignmentById(assignmentId);
    if (!assignment) {
      res.sendStatus(404);
      return;
    }
    res.json(assignment);
  };

  const createAssignmentForCourse = async (req, res) => {
    const { courseId } = req.params;
    const newAssignment = await dao.createAssignment({
      ...req.body,
      course: courseId,
    });
    res.json(newAssignment);
  };

  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const updated = await dao.updateAssignment(assignmentId, req.body);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.json(updated);
  };

  const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    await dao.deleteAssignment(assignmentId);
    res.sendStatus(204);
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}
