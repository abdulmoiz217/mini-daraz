// Quick test to see what happens when adding a product with image data URL
require('dotenv').config();
const { sequelize, connectDB } = require('./config/database');
const { User, Product } = require('./models');

async function testProductCreation() {
  try {
    console.log('Testing product creation with image...');
    await connectDB();

    // Use a sample user ID from our earlier test (the abdulmoiz user)
    const sampleUser = await User.findOne();
    if (!sampleUser) {
      console.log('No users found. Creating a test user...');
      const testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Created test user:', testUser.id);
    } else {
      console.log('Using existing user:', sampleUser.name);

      // Try creating a product with a small data URL to test
      const testDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='; // 1x1 transparent pixel

      try {
        const product = await Product.create({
          title: 'Test Product',
          description: 'Test Description',
          price: 10.99,
          image: testDataUrl,
          createdBy: sampleUser.id
        });
        console.log('Successfully created product:', product.title);
      } catch (error) {
        console.log('Error creating product:', error.message);
        console.log('Error details:', error.errors);
      }
    }

    await sequelize.close();
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testProductCreation();