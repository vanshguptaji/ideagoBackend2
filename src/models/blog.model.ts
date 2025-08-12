import mongoose, { Schema, Model } from "mongoose";
import { IBlogsAndArticles } from "../types/user.types";
import dotenv from "dotenv";
dotenv.config();

const blogSchema = new Schema<IBlogsAndArticles>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        trim: true,
    },
    blogImage: {
        type: String,
        required: true,
        trim: true,
    }
})

const Blog: Model<IBlogsAndArticles> = mongoose.model<IBlogsAndArticles>("Blog", blogSchema);
export default Blog;