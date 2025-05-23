import { Router } from "express";
import { pool } from "../config/db.js";
import { authenticateAdminToken } from "../middlewares/jwtauth.js";
import { queries } from "../queries/queries.js";
import dotenv from "dotenv";
import { saveImgOnDisk } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../functions/imageUploader.js";

const router = Router();
router.post(
  "/addPost",
  authenticateAdminToken,
  saveImgOnDisk.single("image"),
  async (req, res) => {
    const { title, description, content, tags, category } = req.body;
    const { id } = req.admin;

    const localFilePath = req.file?.path;
    if (!localFilePath) {
      return res.status(400).json({ message: "No banner uploaded" });
    }

    // Upload to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
    console.log(cloudinaryResponse);
    if (!cloudinaryResponse) {
      return res.status(500).json({ message: "Failed to upload image" });
    }

    // Parse tags string to array
    let parsedTags = [];
    try {
      parsedTags = JSON.parse(tags);
      if (!Array.isArray(parsedTags)) throw new Error();
    } catch (e) {
      return res.status(400).json({ message: "Invalid tags format" });
    }

    try {
      const { rows } = await pool.query(queries.addPost, [
        id,
        title,
        description,
        content,
        cloudinaryResponse,
        parsedTags, // should be a real JS array
        category,
      ]);

      if (rows.length === 0) {
        return res.status(400).json({
          message: "Failed to add post",
        });
      }

      return res.status(200).json({
        message: "Post added successfully",
        post: rows[0],
      });
    } catch (error) {
      console.error("Error adding post:", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

export default router;
