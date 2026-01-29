const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User'); // Import User model for association

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Title is required' },
      len: {
        args: [0, 100],
        msg: 'Title cannot exceed 100 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Description is required' }
    }
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      notNull: { msg: 'Price is required' },
      min: {
        args: [0],
        msg: 'Price cannot be negative'
      }
    }
  },
  image: {
    type: DataTypes.TEXT,  // Changed from STRING to TEXT to accommodate large data URLs
    allowNull: false,
    validate: {
      notNull: { msg: 'Image is required' }
    }
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  timestamps: true
});

// Define associations
Product.associate = (models) => {
  Product.belongsTo(models.User, { foreignKey: 'createdBy', as: 'user' });
};

module.exports = Product;