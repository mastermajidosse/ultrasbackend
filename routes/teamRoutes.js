import express from "express";

import { protect, admin } from "../middlewares/authMiddleware.js";
import { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam } from "../controllers/teamController.js";

const router = express.Router();

router.route("/").get(getAllTeams).post(protect, admin, createTeam);
router
  .route("/:id")
  .get(getTeamById)
  .put(protect, admin, updateTeam)
  .delete(protect, admin, deleteTeam);

export default router;
