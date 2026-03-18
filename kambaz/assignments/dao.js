import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAssignmentsForCourse(courseId) {
    return db.assignments.filter(
      (assignment) => assignment.course === courseId,
    );
  }

  function findAssignmentById(assignmentId) {
    return db.assignments.find((assignment) => assignment._id === assignmentId);
  }

  function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  }

  function updateAssignment(assignmentId, assignmentUpdates) {
    const existing = db.assignments.find((a) => a._id === assignmentId);
    if (!existing) return null;
    const updated = { ...existing, ...assignmentUpdates };
    db.assignments = db.assignments.map((a) =>
      a._id === assignmentId ? updated : a,
    );
    return updated;
  }

  function deleteAssignment(assignmentId) {
    db.assignments = db.assignments.filter((a) => a._id !== assignmentId);
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
