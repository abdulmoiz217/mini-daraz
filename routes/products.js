const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getMyProducts } = require('../controllers/productController');
const auth = require('../middleware/auth');

// @route   GET /api/products
// @desc    Fetch all products
// @access  Public
router.route('/').get(getProducts).post(auth, createProduct);

// @route   GET /api/products/my-products
// @desc    Fetch user's products
// @access  Private
router.route('/my-products').get(auth, getMyProducts);

// @route   GET /api/products/:id
// @desc    Fetch single product
// @access  Public
router.route('/:id').get(getProductById).put(auth, updateProduct).delete(auth, deleteProduct);

module.exports = router;