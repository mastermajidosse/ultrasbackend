import express from 'express';
const router = express.Router();
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
} from '../controllers/orderControllers.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

export default router;