import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken as any, getUser);
router.get("/:id/friends", verifyToken as any, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken as any, addRemoveFriend);

export default router;
