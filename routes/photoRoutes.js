import express from "express";

import { protect, admin } from "../middlewares/authMiddleware.js";
import { createPhoto, getPhotosThumb, deletePhoto, getPhoto, getPhotos, updatePhoto, addLike, removeLike, addComment, removeComment, addReply, removeReply, likeComment, removeCommentLike } from "../controllers/photoControllers.js";

const router = express.Router();

router.route("/").get(getPhotos).post(protect, admin, createPhoto);
router.route("/thumb").get(getPhotosThumb).post(protect, admin, createPhoto);
router
  .route("/:id")
  .get(getPhoto)
  .put(protect, admin, updatePhoto)
  .delete(protect, admin, deletePhoto);
router.put("/like/:id", protect, addLike);
router.put("/removeLike/:id", protect, removeLike);
router.put("/addComment/:id", protect, addComment);
router.put("/removeComment/:id", protect, removeComment);
router.put("/addReply/:id", protect, addReply);
router.put("/removeReply/:id", protect, removeReply);
router.put("/likeComment/:id", protect, likeComment);
router.put("/removeCommentLike/:id", protect, removeCommentLike);

export default router;
