import Router from "express";
import { pool } from "../config/db.js";
import { queries } from "../queries/queries.js";
import { authenticateVerifiedUserToken } from "../middlewares/jwtauth.js";
const router = Router();

router.use(authenticateVerifiedUserToken);

router.post("/addComment", async (req, res) => {
  const { post_id, content, parent_id } = req.body;
  const { id } = req.verifiedUser;

  try {
    const { rows } = await pool.query(queries.addComment, [
      id,
      post_id,
      parent_id,
      content,
    ]);

    console.log(rows[0]);

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Failed to add comment",
      });
    }

    return res.status(200).json({
      message: "Comment added successfully",
      comment: rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
