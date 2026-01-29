// Debug script to test the exact API call that happens when adding a product
require('dotenv').config();
const express = require('express');
const { sequelize, connectDB } = require('./config/database');
const { User, Product } = require('./models');
const jwt = require('jsonwebtoken');

// Simulate the exact scenario that happens when the frontend makes an API call
async function debugProductCreation() {
  try {
    console.log('Debugging product creation API call...\n');
    await connectDB();

    // Find an existing user to simulate the logged-in user
    const user = await User.findOne();
    if (!user) {
      console.log('No users found in database!');
      return;
    }

    console.log('Found user:', user.name, user.email);

    // Create a mock JWT token like the one the frontend would send
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'defaultSecretKey');
    console.log('Generated mock token for user:', user.id);

    // Decode the token to verify it contains the right user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');
    console.log('Decoded token user ID:', decoded.user.id);

    // Simulate the exact request that would come from the frontend
    const newProductData = {
      title: 'Test Product from Frontend',
      description: 'This is a test product to debug the API call',
      price: 29.99,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' // Small data URL
    };

    console.log('\nSimulating API call with data:');
    console.log('- Title:', newProductData.title);
    console.log('- Description:', newProductData.description);
    console.log('- Price:', newProductData.price);
    console.log('- Image length:', newProductData.image.length, 'characters');

    // Try to create the product as the authenticated user would
    const product = await Product.create({
      ...newProductData,
      createdBy: decoded.user.id  // This is how the controller sets it
    });

    console.log('\n✅ SUCCESS: Product created successfully!');
    console.log('Product ID:', product.id);
    console.log('Product title:', product.title);
    console.log('Created by user ID:', product.createdBy);

    await sequelize.close();
  } catch (error) {
    console.log('\n❌ ERROR occurred:');
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    console.log('Error details:', error.errors || 'No specific validation errors');
  }
}

debugProductCreation();