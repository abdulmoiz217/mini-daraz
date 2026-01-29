const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getOrders } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.route('/').post(auth, createOrder);

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.route('/myorders').get(auth, getMyOrders);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.route('/').get(auth, getOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.route('/:id').get(auth, getOrderById);

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.route('/:id/pay').put(auth, updateOrderToPaid);

// @route   PUT /api/orders/:id/deliver
// @desc    Update order to delivered
// @access  Private/Admin
router.route('/:id/deliver').put(auth, updateOrderToDelivered);

module.exports = router;