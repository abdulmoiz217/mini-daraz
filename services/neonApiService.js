// services/neonApiService.js
require('dotenv').config();

class NeonApiService {
  constructor() {
    this.baseUrl = process.env.NEON_REST_API;
    this.apiKey = process.env.NEON_API_KEY;
  }

  async makeRequest(endpoint, options = {}) {
    if (!this.apiKey || this.apiKey === 'your_neon_api_key_here') {
      throw new Error('NeonDB API key not configured. Please update NEON_API_KEY in .env file.');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // User operations
  async getAllUsers() {
    return this.makeRequest('/users');
  }

  async getUserById(id) {
    return this.makeRequest(`/users?id=eq.${id}`);
  }

  async createUser(userData) {
    return this.makeRequest('/users', {
      method: 'POST',
      body: JSON.stringify([userData])
    });
  }

  async updateUser(id, userData) {
    return this.makeRequest(`/users?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id) {
    return this.makeRequest(`/users?id=eq.${id}`, {
      method: 'DELETE'
    });
  }

  // Product operations
  async getAllProducts() {
    return this.makeRequest('/products');
  }

  async getProductById(id) {
    return this.makeRequest(`/products?id=eq.${id}`);
  }

  async createProduct(productData) {
    return this.makeRequest('/products', {
      method: 'POST',
      body: JSON.stringify([productData])
    });
  }

  async updateProduct(id, productData) {
    return this.makeRequest(`/products?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id) {
    return this.makeRequest(`/products?id=eq.${id}`, {
      method: 'DELETE'
    });
  }

  async getProductsByUserId(userId) {
    try {
      return await this.makeRequest(`/products?created_by=eq.${userId}`);
    } catch (error) {
      console.error('Error fetching products by user ID:', error);
      throw error;
    }
  }
}

module.exports = new NeonApiService();