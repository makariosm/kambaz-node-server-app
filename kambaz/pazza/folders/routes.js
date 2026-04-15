import PazzaFoldersDao from "./dao.js";

export default function PazzaFolderRoutes(app) {
  const dao = PazzaFoldersDao();

  const findFoldersForCourse = async (req, res) => {
    const { courseId } = req.params;
    let folders = await dao.findFoldersForCourse(courseId);
    if (folders.length === 0) {
      folders = await dao.initializeDefaultFolders(courseId);
    }
    res.json(folders);
  };

  const createFolder = async (req, res) => {
    const { courseId } = req.params;
    const newFolder = await dao.createFolder({
      ...req.body,
      course: courseId,
    });
    res.json(newFolder);
  };

  const updateFolder = async (req, res) => {
    const { folderId } = req.params;
    const updated = await dao.updateFolder(folderId, req.body);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.json(updated);
  };

  const deleteFolder = async (req, res) => {
    const { folderId } = req.params;
    await dao.deleteFolder(folderId);
    res.sendStatus(204);
  };

  app.get("/api/courses/:courseId/pazza/folders", findFoldersForCourse);
  app.post("/api/courses/:courseId/pazza/folders", createFolder);
  app.put("/api/pazza/folders/:folderId", updateFolder);
  app.delete("/api/pazza/folders/:folderId", deleteFolder);
}
