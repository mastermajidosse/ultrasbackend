import express from "express";

import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  createVideo,
  deleteVideo,
  getVideo,
  getVideos,
  updateVideo,
} from "../controllers/videoControllers.js";

const router = express.Router();

router.route("/").get(getVideos).post(protect, admin, createVideo);
router
  .route("/:id")
  .get(getVideo)
  .put(protect, admin, updateVideo)
  .delete(protect, admin, deleteVideo);

export default router;
