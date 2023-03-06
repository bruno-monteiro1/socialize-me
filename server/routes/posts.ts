import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken as any, getFeedPosts);
router.get("/:userid/posts", verifyToken as any, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken as any, likePost);

export default router;
