import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler.js";
import Project from "../models/project.model";
import { uploadOnCloudinary } from "../utils/cloudinary";

const postNewProject = asyncHandler(async (req: Request, res: Response) => {
  const {
    Title,
    description,
    location,
    clientName,
    Service,
    Category,
  } = req.body;

  const file = (req as any).file;

  if (!file) {
    throw new ApiError(403, "Please provide a valid project image");
  }
  if (!Title) {
    throw new ApiError(403, "Please provide a valid title for the project");
  }
  if (!description) {
    throw new ApiError(
      403,
      "Please provide a short or long appropriate description of the project"
    );
  }
  if (!Service) {
    throw new ApiError(
      403,
      "Please provide a valid service provided by ideago in the project"
    );
  }
  if (!Category) {
    throw new ApiError(
      403,
      "Please provide a valid category type of the project enlisted here"
    );
  }

  try {
    const uploadResult = await uploadOnCloudinary(file.path);

    const newProject = await Project.create({
      projectImage: uploadResult.secure_url,
      Title,
      description,
      location,
      clientName,
      Service,
      Category,
    });

    res
      .status(201)
      .json(new ApiResponse(201, newProject, "Project created successfully."));
  } catch (error) {
    console.error("Error creating new project", error);
    throw new ApiError(
      500,
      "An error occurred while creating the project. Please try again."
    );
  }
});

const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    res.status(200).json(new ApiResponse(200, project, "Project retrieved successfully."));
  } catch (error) {
    console.error("Error retrieving project", error);
    throw new ApiError(500, "An error occurred while retrieving the project");
  }
});

const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.status(200).json(new ApiResponse(200, projects, "Projects retrieved successfully."));
  } catch (error) {
    console.error("Error retrieving projects", error);
    throw new ApiError(500, "An error occurred while retrieving projects");
  }
});

const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  try {
    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) {
      throw new ApiError(404, "Project not found");
    }
    res.status(200).json(new ApiResponse(200, "Project deleted successfully"));
  } catch (error) {
    console.error("Error deleting project", error);
    throw new ApiError(500, "An error occurred while deleting the project");
  }
});

const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const updateData = req.body;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  try {
    if ((req as any).file) {
      const uploadResult = await uploadOnCloudinary((req as any).file.path);
      updateData.projectImage = uploadResult.secure_url;
    }

    const updatedProject = await Project.findByIdAndUpdate(projectId, updateData, {
      new: true,
    });

    if (!updatedProject) {
      throw new ApiError(404, "Project not found");
    }

    res.status(200).json(new ApiResponse(200, updatedProject, "Project updated successfully"));
  } catch (error) {
    console.error("Error updating project", error);
    throw new ApiError(500, "An error occurred while updating the project");
  }
});


export {
  postNewProject,
  getProjectById,
  getAllProjects,
  deleteProject,
  updateProject,
};