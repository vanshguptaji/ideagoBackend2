import { Router } from "express";
import { createBlog, editBlog, getBlogById, getAllBlogs, deleteBlog } from "../controllers/Blogs.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

// Create a blog (with image upload)
router.post("/", upload.single("blogImage"), createBlog);

// Edit a blog (with optional image upload)
router.put("/:blogId", upload.single("blogImage"), editBlog);

// Get a blog by ID
router.get("/:blogId", getBlogById);

// Get all blogs
router.get("/", getAllBlogs);

// Delete a blog
router.delete("/:blogId", deleteBlog);

export default router;