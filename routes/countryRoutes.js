import express from "express";

import { protect, admin } from "../middlewares/authMiddleware.js";
import { createCountry, getAllCountries, getCountryById, deleteCountry, updateCountry } from "../controllers/countryController.js";

const router = express.Router();

router.route("/").get(getAllCountries).post(protect, admin, createCountry);
router
  .route("/:id")
  .get(getCountryById)
  .put(protect, admin, updateCountry)
  .delete(protect, admin, deleteCountry);

export default router;
