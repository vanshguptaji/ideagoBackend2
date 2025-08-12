import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler.js";
import { IBlogsAndArticles } from "../types/user.types";
import { uploadOnCloudinary } from "../utils/cloudinary";
import Blog from "../models/blog.model";

const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, author } = req.body;
  const file = (req as any).file;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }
  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  if (!author) {
    throw new ApiError(400, "Author is required");
  }
  if (!file) {
    throw new ApiError(400, "Blog image is required");
  }

  try {
    const uploadResult = await uploadOnCloudinary(file.path);
    
    const newBlog: IBlogsAndArticles = {
      title,
      content,
      author,
      blogImage: uploadResult.secure_url,
    };

    // Assuming you have a Blog model to save the blog
    const createdBlog = await Blog.create(newBlog);

    res.status(201).json(new ApiResponse(201, createdBlog));
} catch (error) {
    throw new ApiError(500, "Failed to create blog post");
  }
});

const editBlog = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const { title, content, author } = req.body;
  const file = (req as any).file;

  if (!blogId) {
    throw new ApiError(400, "Blog ID is required");
  }
  if (!title && !content && !author && !file) {
    throw new ApiError(400, "At least one field must be provided for update");
  }

  try {
    const updateData: Partial<IBlogsAndArticles> = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (author) updateData.author = author;
    if (file) {
      const uploadResult = await uploadOnCloudinary(file.path);
      updateData.blogImage = uploadResult.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
      new: true,
    });

    if (!updatedBlog) {
      throw new ApiError(404, "Blog not found");
    }

    res.status(200).json(new ApiResponse(200, updatedBlog));
  } catch (error) {
    throw new ApiError(500, "Failed to update blog post");
  }
});

const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog ID is required");
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }
    res.status(200).json(new ApiResponse(200, blog));
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve blog post");
  }
});

const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(new ApiResponse(200, blogs));
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve blogs");
  }
});

const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog ID is required");
  }

  try {
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      throw new ApiError(404, "Blog not found");
    }
    res.status(200).json(new ApiResponse(200, "Blog deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to delete blog post");
  }
});

export { getBlogById, getAllBlogs, deleteBlog, createBlog, editBlog };
