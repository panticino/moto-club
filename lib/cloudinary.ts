import { v2 as cloudinary, UploadApiOptions } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "<cloud_name>",
  api_key: process.env.CLOUDINARY_API_KEY || "<api_key>",
  api_secret: process.env.CLOUDINARY_API_SECRET || "<api_secret>",
  secure: true,
});

export type { UploadApiOptions };
export default cloudinary;
