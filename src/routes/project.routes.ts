import { Router } from "express";
import {
  postNewProject,
  getProjectById,
  getAllProjects,
  deleteProject,
  updateProject,
} from "../controllers/project.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

// Create a new project (with file upload)
router.post("/", verifyJWT, upload.single("projectImage"), postNewProject);

// Update a project (with optional file upload)
router.put("/:projectId", verifyJWT, upload.single("projectImage"), updateProject);

// Get a project by ID
router.get("/:projectId", getProjectById);

// Get all projects
router.get("/", getAllProjects);

// Delete a project
router.delete("/:projectId", verifyJWT, deleteProject);

export default router;