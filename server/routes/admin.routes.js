import { Router } from "express";
import { pool } from "../config/db.js";
import { authenticateAdminToken } from "../middlewares/jwtauth.js";
import { queries } from "../queries/queries.js";
import dotenv from "dotenv";
import { saveImgOnDisk } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../functions/imageUploader.js";
import { sendNewPostMail } from "../functions/mailer.js";
import { limitTo2in1 } from "../middlewares/rateLimiters.js";

const router = Router();

router.post(
  "/addPost",
  limitTo2in1,
  authenticateAdminToken,
  saveImgOnDisk.single("image"),
  async (req, res) => {
    const {
      title,
      description,
      content,
      tags,
      category,
      is_scheduled,
      scheduled_at,
    } = req.body;
    const { id, name, avatar } = req.admin;

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

    // Function to convert UTC to IST
    const convertUTCtoIST = (utcDateString) => {
      try {
        // Parse the UTC datetime string
        const utcDate = new Date(utcDateString);

        // IST is UTC + 5:30
        const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

        // Return as ISO string without timezone info (local time)
        return istDate.toISOString().slice(0, 19); // Remove the 'Z' at the end
      } catch (error) {
        console.error("Error converting UTC to IST:", error);
        return null;
      }
    };

    if (is_scheduled === "false" || is_scheduled === false) {
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

        res.status(200).json({
          message: "Post added successfully",
          post: rows[0],
        });
        try {
          const { rows: subscribers } = await pool.query(
            queries.getSubscribers,
            [id]
          );
          if (subscribers.length > 0) {
            await sendNewPostMail(
              subscribers.map((sub) => sub.email),
              {
                author_name: name,
                author_avatar: avatar,
                post_link: `${process.env.CLIENT_URL}/post/${rows[0].id}`,
                post_image: cloudinaryResponse,
                post_title: title,
                post_description: description,
                post_created_at: rows[0].created_at,
              }
            );
          }
        } catch (error) {
          console.log("errro in finding subscribers", error);
        }
      } catch (error) {
        console.error("Error adding post:", error);
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
    } else if (is_scheduled === "true" || is_scheduled === true) {
      try {
        // Convert UTC scheduled_at to IST
        const scheduledAtIST = convertUTCtoIST(scheduled_at);

        if (!scheduledAtIST) {
          return res.status(400).json({
            message: "Invalid scheduled_at format",
          });
        }

        console.log("Original UTC time:", scheduled_at);
        console.log("Converted IST time:", scheduledAtIST);

        const { rows } = await pool.query(queries.addScheduledPost, [
          id,
          title,
          description,
          content,
          cloudinaryResponse,
          parsedTags, // should be a real JS array
          category,
          is_scheduled,
          scheduledAtIST, // Use converted IST time instead of UTC
        ]);

        if (rows.length === 0) {
          return res.status(400).json({
            message: "Failed to add scheduled post",
          });
        }

        res.status(202).json({
          message: "Post Scheduled successfully",
          post: rows[0],
          scheduled_time_ist: scheduledAtIST, // Include converted time in response
        });
      } catch (error) {
        console.error("Error adding scheduled post:", error);
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
    }
  }
);

router.post(
  "/uploadImageForEditor",
  authenticateAdminToken,
  saveImgOnDisk.single("image"),
  async (req, res) => {
    try {
      const localFilePath = req.file?.path;
      if (!localFilePath) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      // Upload to Cloudinary
      const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
      console.log(cloudinaryResponse);
      if (!cloudinaryResponse) {
        return res.status(500).json({ message: "Failed to upload image" });
      }

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: cloudinaryResponse,
      });
    } catch (error) {
      console.error("Error uploading image for editor:", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

router.get("/getYourPosts", authenticateAdminToken, async (req, res) => {
  try {
    const { rows } = await pool.query(queries.getYourPosts, [req.admin.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put(
  "/deletePost/:postId",
  limitTo2in1,
  authenticateAdminToken,
  async (req, res) => {
    const { postId } = req.params;
    const { id } = req.admin;

    try {
      // Check if the post exists and belongs to the admin
      const { rows: postRows } = await pool.query(queries.getPostById, [
        postId,
      ]);
      if (postRows.length === 0) {
        return res
          .status(404)
          .json({ message: "Post not found or unauthorized" });
      }
      const post = postRows[0];
      // Check if the post is of user
      if (post.user_id !== id) {
        return res.status(403).json({ message: "Fuck off Mother Fucker" });
      }
      // Delete the post
      await pool.query(queries.deletePost, [postId]);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
