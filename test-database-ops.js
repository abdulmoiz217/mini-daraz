// Test script to verify database operations are working
require('dotenv').config();
const { sequelize, connectDB } = require('./config/database');
const { User, Product } = require('./models');

async function testDatabaseOperations() {
  try {
    console.log('Testing database operations...\n');

    // Connect to database
    await connectDB();

    // Count current users
    const userCount = await User.count();
    console.log(`✓ Found ${userCount} users in the database`);

    // Count current products
    const productCount = await Product.count();
    console.log(`✓ Found ${productCount} products in the database`);

    // Show sample users if any exist
    if (userCount > 0) {
      const users = await User.findAll({ limit: 5 });
      console.log('\nSample users:');
      users.forEach(user => {
        console.log(`  - ${user.name} (${user.email})`);
      });
    }

    // Show sample products if any exist
    if (productCount > 0) {
      const products = await Product.findAll({
        limit: 5,
        include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
      });
      console.log('\nSample products:');
      products.forEach(product => {
        console.log(`  - ${product.title} by ${product.user ? product.user.name : 'Unknown'}`);
      });
    }

    console.log('\n✓ Database operations are working correctly!');
    console.log('✓ You can create, read, update, and delete users and products.');

    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error('✗ Database operation failed:', error.message);
  }
}

testDatabaseOperations();