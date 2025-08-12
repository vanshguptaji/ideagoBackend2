import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if(!localFilePath) {
            throw new Error("No file path provided for upload");
        }

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        fs.unlinkSync(localFilePath);
        return result;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        if (error instanceof Error) {
            console.error("Error uploading to Cloudinary:", error.message);
        } else {
            console.error("Error uploading to Cloudinary:", error);
        }
        console.error("Error uploading to Cloudinary:", error);
        throw new Error("Failed to upload file to Cloudinary");
    }
}

export { uploadOnCloudinary };