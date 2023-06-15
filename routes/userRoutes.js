import express from "express";
import { admin, protect } from "../middlewares/authMiddleware.js";
import { deleteUser, getUserById, getUserProfile, getUsers, login, register, updateUserProfile } from "../controllers/userControllers.js";


const router = express.Router();

router.route('/').get(protect,admin,getUsers)
router.route('/login').post(login)
router.route('/register').post(register)
router
  .route('/profile')
  .get(protect,getUserProfile)
  .put(protect,updateUserProfile)

router
  .route('/:id')
  .delete(protect, admin,deleteUser)
  .get(getUserById)





export default router;
