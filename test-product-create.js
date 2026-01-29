// Test to isolate the issue with product creation
require('dotenv').config();
const { sequelize, connectDB } = require('./config/database');
const { User, Product } = require('./models');

async function testProductCreationDetailed() {
  try {
    console.log('Testing product creation in detail...');
    await connectDB();

    // Use the existing user
    const sampleUser = await User.findOne();
    if (!sampleUser) {
      console.log('No users found!');
      return;
    }

    console.log('User found:', sampleUser.name);

    // Test 1: Try creating with URL instead of data URL
    const testImageUrl = 'https://example.com/test-image.jpg';

    try {
      const product1 = await Product.create({
        title: 'Test Product with URL',
        description: 'Test Description with URL',
        price: 10.99,
        image: testImageUrl,
        createdBy: sampleUser.id
      });
      console.log('✓ Successfully created product with URL:', product1.title);
    } catch (error) {
      console.log('✗ Error creating product with URL:', error.message);
    }

    // Test 2: Try creating with a shorter data URL
    const shortDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

    try {
      const product2 = await Product.create({
        title: 'Test Product with Data URL',
        description: 'Test Description with Data URL',
        price: 15.99,
        image: shortDataUrl,
        createdBy: sampleUser.id
      });
      console.log('✓ Successfully created product with data URL:', product2.title);
    } catch (error) {
      console.log('✗ Error creating product with data URL:', error.message);
    }

    await sequelize.close();
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testProductCreationDetailed();