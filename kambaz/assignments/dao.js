import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao() {
  function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId });
  }

  function findAssignmentById(assignmentId) {
    return model.findById(assignmentId);
  }

  function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  }

  function updateAssignment(assignmentId, assignmentUpdates) {
    return model.findByIdAndUpdate(assignmentId, { $set: assignmentUpdates }, { new: true });
  }

  function deleteAssignment(assignmentId) {
    return model.deleteOne({ _id: assignmentId });
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
