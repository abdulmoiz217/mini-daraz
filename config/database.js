const { Sequelize } = require('sequelize');
require('dotenv').config(); // Make sure dotenv is loaded in this file too

// Create Sequelize instance with NeonDB-compatible configuration based on successful test
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://username:password@localhost:5432/ecommerce', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    application_name: 'ecommerce-app'
  },
  logging: false, // Disable logging to prevent console spam
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL database');

    // Sync all models
    await sequelize.sync({ alter: true }); // alter: true will update tables if needed
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };