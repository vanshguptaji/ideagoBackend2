import mongoose, { Schema, Model } from "mongoose";
import { IProject } from "../types/user.types";
import dotenv from "dotenv";
dotenv.config();

const projectSchema = new Schema<IProject>({
    projectImage:{
        type: String,
        required: true,
        trim: true,
    }, 
    Title:{
        type: String,
        required: true,
        trim: true,
    }, 
    description:{
        type: String,
        required: true,
        trim: true,
    },
    location:{
        type: String,
        trim: true,
    }, 
    clientName:{
        type: String,
        trim: true,
    }, 
    Service:{
        type: String,
        required: true,
        trim: true,
    }, 
    Category:{
        type: String,
        required: true,
        trim: true,
    }}
)


const Project: Model<IProject> = mongoose.model<IProject>("Project", projectSchema);
export default Project;