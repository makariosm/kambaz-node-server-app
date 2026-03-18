import { v4 as uuidv4 } from "uuid";
export default function EnrollmentsDao(db) {
  function findEnrollmentsForUser(userId) {
    const { enrollments } = db;
    return enrollments.filter((enrollment) => enrollment.user === userId);
  }

  function enrollUserInCourse(userId, courseId) {
    const { enrollments } = db;
    const existingEnrollment = enrollments.find(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === courseId,
    );
    if (existingEnrollment) {
      return existingEnrollment;
    }
    const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
    enrollments.push(newEnrollment);
    return newEnrollment;
  }

  function unenrollUserFromCourse(userId, courseId) {
    db.enrollments = db.enrollments.filter(
      (enrollment) =>
        !(enrollment.user === userId && enrollment.course === courseId),
    );
  }

  return { findEnrollmentsForUser, enrollUserInCourse, unenrollUserFromCourse };
}
