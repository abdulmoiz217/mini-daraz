const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  shippingAddress: DataTypes.JSONB,
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentResult: DataTypes.JSONB, // Store payment details as JSON
  itemsPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  taxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  shippingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paidAt: DataTypes.DATE,
  isDelivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deliveredAt: DataTypes.DATE
}, {
  timestamps: true
});

// Define associations
Order.associate = (models) => {
  Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'orderItems' });
};

module.exports = Order;