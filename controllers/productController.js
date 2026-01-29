const { Product, User } = require('../models');
const { Op } = require('sequelize');
const neonApiService = require('../services/neonApiService');

// Determine whether to use REST API or direct database connection
const USE_REST_API = process.env.USE_NEON_REST_API === 'true';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    if (USE_REST_API) {
      // Use REST API
      const products = await neonApiService.getAllProducts();
      res.json({
        products,
        page: 1,
        pages: 1,
        total: products.length
      });
    } else {
      // Use direct database connection
      const page = parseInt(req.query.pageNumber) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (req.query.keyword) {
        whereClause.title = {
          [Op.iLike]: `%${req.query.keyword}%` // PostgreSQL case-insensitive search
        };
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where: whereClause,
        limit: limit,
        offset: offset,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }]
      });

      const pages = Math.ceil(count / limit);

      res.json({
        products,
        page,
        pages,
        total: count
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    if (USE_REST_API) {
      // Use REST API
      const products = await neonApiService.getProductById(req.params.id);
      if (products && products.length > 0) {
        res.json(products[0]);
      } else {
        res.status(404).json({ msg: 'Product not found' });
      }
    } else {
      // Use direct database connection
      const product = await Product.findByPk(req.params.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }]
      });

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ msg: 'Product not found' });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);

    const { title, description, price, image } = req.body;

    // Validate required fields
    if (!title || !description || !price || !image) {
      return res.status(400).json({
        msg: 'Missing required fields',
        required: { title: !!title, description: !!description, price: !!price, image: !!image }
      });
    }

    if (USE_REST_API) {
      // Use REST API
      const productData = {
        title,
        description,
        price: parseFloat(price),
        image,
        created_by: req.user.id
      };

      const product = await neonApiService.createProduct(productData);
      res.status(201).json(Array.isArray(product) ? product[0] : product);
    } else {
      // Use direct database connection
      console.log('Creating product with validated data:', { title, description, price, image: typeof image });

      const product = await Product.create({
        title,
        description,
        price: parseFloat(price), // Ensure price is a number
        image,
        createdBy: req.user.id
      });

      console.log('Product created successfully:', product.id);
      res.status(201).json(product);
    }
  } catch (error) {
    console.error('Error creating product:', error.message);
    console.error('Error details:', error);
    res.status(500).json({
      msg: 'Server error',
      error: error.message,
      details: error.errors || 'No validation errors'
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;

    if (USE_REST_API) {
      // Use REST API
      const productData = {};
      if (title) productData.title = title;
      if (description) productData.description = description;
      if (price) productData.price = parseFloat(price);
      if (image) productData.image = image;

      // First get the product to check ownership
      const products = await neonApiService.getProductById(req.params.id);
      if (!products || products.length === 0) {
        return res.status(404).json({ msg: 'Product not found' });
      }

      const product = products[0];
      if (product.created_by !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized to update this product' });
      }

      const updatedProduct = await neonApiService.updateProduct(req.params.id, productData);
      res.json(Array.isArray(updatedProduct) ? updatedProduct[0] : updatedProduct);
    } else {
      // Use direct database connection
      const product = await Product.findByPk(req.params.id);

      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }

      // Check if user owns the product
      if (product.createdBy !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized to update this product' });
      }

      await product.update({
        title: title || product.title,
        description: description || product.description,
        price: price || product.price,
        image: image || product.image
      });

      res.json(product);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Fetch user's products
// @route   GET /api/products/my-products
// @access  Private
const getMyProducts = async (req, res) => {
  try {
    if (USE_REST_API) {
      // Use REST API
      const products = await neonApiService.getProductsByUserId(req.user.id);
      res.json({ products });
    } else {
      // Use direct database connection
      const products = await Product.findAll({
        where: { createdBy: req.user.id },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }],
        order: [['createdAt', 'DESC']] // Order by newest first
      });

      res.json({ products });
    }
  } catch (error) {
    console.error('Error in getMyProducts:', error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    if (USE_REST_API) {
      // Use REST API
      // First get the product to check ownership
      const products = await neonApiService.getProductById(req.params.id);
      if (!products || products.length === 0) {
        return res.status(404).json({ msg: 'Product not found' });
      }

      const product = products[0];
      if (product.created_by !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized to delete this product' });
      }

      await neonApiService.deleteProduct(req.params.id);
      res.json({ msg: 'Product removed' });
    } else {
      // Use direct database connection
      const product = await Product.findByPk(req.params.id);

      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }

      // Check if user owns the product
      if (product.createdBy !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized to delete this product' });
      }

      await product.destroy();
      res.json({ msg: 'Product removed' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
};