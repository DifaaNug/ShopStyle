console.log('Starting server with detailed logging...');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// Middleware logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  
  if (req.method === 'POST' && req.path.includes('place-order')) {
    console.log('🔥 POST request to place-order detected!');
  }
  next();
});

app.use(cors());
app.use(bodyParser.json());

// Array to store all orders (starts empty, populated by placing orders)
const orders = [];

console.log('Orders array initialized with length:', orders.length);

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('TEST ENDPOINT CALLED');
  res.json({ message: 'Server is working!', ordersCount: orders.length });
});

// GET all orders
app.get('/api/orders', (req, res) => {
  console.log('=== GET ORDERS REQUEST ===');
  console.log('Current orders in memory:', orders.length);
  orders.forEach((order, index) => {
    console.log(`Order ${index + 1}: ${order.orderId} - ${order.email}`);
  });
  res.json(orders);
});

// POST place order
app.post('/api/place-order', async (req, res) => {
  console.log('🚀 === PLACE ORDER REQUEST RECEIVED ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const orderId = `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now().toString().substr(-6)}`;
    console.log('Generated order ID:', orderId);
    
    const orderData = {
      orderId: orderId,
      email: req.body.email,
      fullname: req.body.fullname,
      address: req.body.address,
      phone: req.body.phone || '',
      items: req.body.items,
      subtotal: req.body.subtotal,
      shipping: req.body.shipping,
      tax: req.body.tax,
      total: req.body.total,
      status: 'Processing',
      date: new Date().toISOString()
    };
    
    console.log('💾 Saving order to orders array...');
    console.log('Order data:', JSON.stringify(orderData, null, 2));
    
    orders.push(orderData);
    
    console.log('✅ ORDER SAVED SUCCESSFULLY');
    console.log('Order ID saved:', orderData.orderId);
    console.log('Total orders in array:', orders.length);
    
    res.json({
      success: true,
      message: 'Order placed successfully!',
      orderId: orderData.orderId
    });
    
  } catch (error) {
    console.error('❌ Error processing order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process order'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('=== SERVER STARTED SUCCESSFULLY ===');
});
