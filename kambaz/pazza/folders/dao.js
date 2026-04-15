import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function PazzaFoldersDao() {
  function findFoldersForCourse(courseId) {
    return model.find({ course: courseId });
  }

  function createFolder(folder) {
    const newFolder = { ...folder, _id: uuidv4() };
    return model.create(newFolder);
  }

  function updateFolder(folderId, updates) {
    return model.findByIdAndUpdate(folderId, { $set: updates }, { new: true });
  }

  function deleteFolder(folderId) {
    return model.deleteOne({ _id: folderId });
  }

  function deleteFoldersForCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  function initializeDefaultFolders(courseId) {
    const defaultFolders = [
      "hw1", "hw2", "hw3", "hw4", "hw5", "hw6",
      "project", "exam", "logistics", "other", "office_hours",
    ];
    const folders = defaultFolders.map((name) => ({
      _id: uuidv4(),
      course: courseId,
      name,
    }));
    return model.insertMany(folders);
  }

  return {
    findFoldersForCourse,
    createFolder,
    updateFolder,
    deleteFolder,
    deleteFoldersForCourse,
    initializeDefaultFolders,
  };
}
