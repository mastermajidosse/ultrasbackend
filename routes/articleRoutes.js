import express from "express";

import {
  getArticles,
  createArticle,
  updateArticle,
  addLike,
  removeLike,
  addComment,
  removeComment,
  addReply,
  removeReply,
  likeComment,
  removeCommentLike,
  getArticle,
  deleteArticle,
} from "../controllers/articleControllers.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getArticles).post(protect, admin, createArticle);
router
  .route("/:id")
  .get(getArticle)
  .put(protect, admin, updateArticle)
  .delete(protect, admin, deleteArticle);

router.put("/like/:id", protect, addLike);
router.put("/removeLike/:id", protect, removeLike);
router.put("/addComment/:id", protect, addComment);
router.put("/removeComment/:id", protect, removeComment);
router.put("/likeComment/:id", protect, likeComment);
router.put("/removeCommentLike/:id", protect, removeCommentLike);
router.put("/addReply/:id", protect, addReply);
router.put("/removeReply/:id", protect, removeReply);


export default router;
