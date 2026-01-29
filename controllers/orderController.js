const { Order, OrderItem, User, Product } = require('../models');
const nodemailer = require('nodemailer');

// Function to send email notification to seller
const sendSellerNotification = async (seller, product, orderDetails) => {
  try {
    // Create transporter - using a mock transporter for now
    // In production, you would configure with actual email service (Gmail, SendGrid, etc.)
    let transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || '', // Your email
        pass: process.env.EMAIL_PASS || ''  // Your email password or app password
      }
    });

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER || '"Mini Daraz" <noreply@minidaraz.com>',
      to: seller.email,
      subject: `New Order for Your Product: ${product.title}`,
      html: `
        <h2>New Order Notification</h2>
        <p>Hello ${seller.name},</p>
        <p>A customer has placed an order for your product:</p>

        <h3>Product Details:</h3>
        <ul>
          <li><strong>Product:</strong> ${product.title}</li>
          <li><strong>Description:</strong> ${product.description}</li>
          <li><strong>Price:</strong> $${product.price}</li>
        </ul>

        <h3>Order Details:</h3>
        <ul>
          <li><strong>Customer:</strong> ${orderDetails.customerName}</li>
          <li><strong>Customer Email:</strong> ${orderDetails.customerEmail}</li>
          <li><strong>Order ID:</strong> ${orderDetails.orderId}</li>
          <li><strong>Quantity Ordered:</strong> ${orderDetails.quantity}</li>
          <li><strong>Total Amount:</strong> $${orderDetails.totalAmount}</li>
          <li><strong>Order Date:</strong> ${new Date().toLocaleString()}</li>
        </ul>

        <p>Please prepare the item for shipment and contact the customer if needed.</p>
        <p>Thank you for selling with Mini Daraz!</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Seller notification sent to ${seller.email} for product ${product.title}`);
  } catch (error) {
    console.error('Error sending seller notification:', error);
    // Don't throw error as this shouldn't break the order process
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ msg: 'No order items' });
    }

    const order = await Order.create({
      user_id: req.user.id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // Create order items and notify sellers
    for (const item of orderItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product,
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price
      });

      // Fetch the product and its seller to send notification
      const product = await Product.findByPk(item.product, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }]
      });

      if (product && product.user) {
        // Prepare order details for email
        const orderDetails = {
          orderId: order.id,
          customerName: req.user.name,
          customerEmail: req.user.email,
          quantity: item.qty,
          totalAmount: (item.price * item.qty).toFixed(2)
        };

        // Send notification to seller
        await sendSellerNotification(product.user, product, orderDetails);
      }
    }

    // Fetch the complete order with items
    const createdOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product'
        }]
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product'
        }]
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ msg: 'Order not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address
      };

      await order.save();

      // Fetch updated order with associations
      const updatedOrder = await Order.findByPk(order.id, {
        include: [{
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product'
          }]
        }, {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }]
      });

      res.json(updatedOrder);
    } else {
      res.status(404).json({ msg: 'Order not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      await order.save();

      // Fetch updated order with associations
      const updatedOrder = await Order.findByPk(order.id, {
        include: [{
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product'
          }]
        }, {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }]
      });

      res.json(updatedOrder);
    } else {
      res.status(404).json({ msg: 'Order not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    });
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product'
        }]
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders
};