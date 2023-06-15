import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const prod = await Product.findById(productId)

  const order = new Order({
    user: req.user._id,
    product: productId,
    quantity,
    totalPrice:prod.price * quantity,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});


// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('user', 'id name email')
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'id name email')

  if (order && (order.user.toString() === req.user._id || req.user.isAdmin)) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name email');
  res.json(orders);
});



export { 
    createOrder,
    getMyOrders,
    getOrderById,
    getOrders
}