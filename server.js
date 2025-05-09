require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// Demo user data (replace with real database in production)
const users = [
  {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: bcrypt.hashSync('test123', 8) // hashed password for demo
  }
];

// Demo product data
const products = [
  {
    id: 1,
    name: 'Classic Blue T-Shirt',
    description: 'Comfortable cotton t-shirt in classic blue design',
    price: 19.99,
    category: 'clothing',
    tags: ['men', 't-shirt', 'casual'],
    imageUrl: '../assets/products/tshirt-blue.jpg',
    stock: 50
  },
  {
    id: 2,
    name: 'Elegant Black Dress',
    description: 'Elegant black dress for formal occasions',
    price: 59.99,
    category: 'clothing',
    tags: ['women', 'dress', 'formal'],
    imageUrl: '../assets/products/dress-black.jpg',
    stock: 30
  },
  {
    id: 3,
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots',
    price: 24.99,
    category: 'accessories',
    tags: ['unisex', 'wallet', 'leather'],
    imageUrl: '../assets/products/wallet.jpg',
    stock: 45
  },
  {
    id: 4,
    name: 'Running Shoes',
    description: 'Lightweight running shoes with excellent cushioning',
    price: 89.99,
    category: 'footwear',
    tags: ['unisex', 'shoes', 'sports'],
    imageUrl: '../assets/products/running-shoes.jpg',
    stock: 40
  },
  {
    id: 5,
    name: 'Smartphone Case',
    description: 'Durable protective case for most smartphone models',
    price: 14.99,
    category: 'accessories',
    tags: ['electronics', 'case', 'protection'],
    imageUrl: '../assets/products/phone-case.jpg',
    stock: 100
  }
];

// Demo categories data
const categories = [
  { id: 1, name: 'clothing', description: 'Shirts, dresses, pants and more' },
  { id: 2, name: 'footwear', description: 'Shoes, sandals, and boots' },
  { id: 3, name: 'accessories', description: 'Bags, wallets, jewelry and more' },
  { id: 4, name: 'electronics', description: 'Gadgets and electronics accessories' }
];

// Shopping cart data (user_id -> cart items)
const carts = {};

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access token required' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Register endpoint
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email sudah terdaftar!' });
  }
  
  // Create new user with hashed password
  const hashedPassword = bcrypt.hashSync(password, 8);
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword
  };
    
  // Add to users array (in real app, would save to database)
  users.push(newUser);
  
  // Return success response (don't include password)
  res.status(201).json({ 
    message: 'Registrasi berhasil', 
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const validPass = bcrypt.compareSync(password, user.password);
  if (!validPass) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
  res.json({ id: user.id, name: user.name, email: user.email, accessToken: token });
});

// GET all products
app.get('/api/products', (req, res) => {
  // Optional query parameters for filtering
  const { category, search, minPrice, maxPrice } = req.query;
  
  let filteredProducts = [...products];
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }
  
  res.json(filteredProducts);
});

// GET a single product by ID
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
});

// GET all categories
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// GET a single category by ID
app.get('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const category = categories.find(c => c.id === id);
  
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  
  res.json(category);
});

// GET products by category name
app.get('/api/categories/:name/products', (req, res) => {
  const categoryName = req.params.name;
  const categoryProducts = products.filter(p => p.category === categoryName);
  
  res.json(categoryProducts);
});

// Cart endpoints - requires authentication
// GET user's cart
app.get('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const userCart = carts[userId] || [];
  res.json(userCart);
});

// POST add item to cart
app.post('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity) {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }
  
  const product = products.find(p => p.id === parseInt(productId));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  // Initialize user cart if it doesn't exist
  if (!carts[userId]) {
    carts[userId] = [];
  }
  
  // Check if product already in cart
  const existingItem = carts[userId].find(item => item.productId === parseInt(productId));
  
  if (existingItem) {
    // Update quantity if product already in cart
    existingItem.quantity = parseInt(quantity);
  } else {
    // Add new item to cart
    carts[userId].push({
      id: Date.now(), // generate unique ID
      productId: parseInt(productId),
      name: product.name,
      price: product.price,
      quantity: parseInt(quantity),
      imageUrl: product.imageUrl
    });
  }
  
  res.status(201).json(carts[userId]);
});

// PUT update cart item
app.put('/api/cart/:itemId', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const itemId = parseInt(req.params.itemId);
  const { quantity } = req.body;
  
  if (!carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  const cartItem = carts[userId].find(item => item.id === itemId);
  if (!cartItem) {
    return res.status(404).json({ message: 'Cart item not found' });
  }
  
  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    carts[userId] = carts[userId].filter(item => item.id !== itemId);
  } else {
    // Update quantity
    cartItem.quantity = parseInt(quantity);
  }
  
  res.json(carts[userId]);
});

// DELETE remove item from cart
app.delete('/api/cart/:itemId', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const itemId = parseInt(req.params.itemId);
  
  if (!carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  const initialLength = carts[userId].length;
  carts[userId] = carts[userId].filter(item => item.id !== itemId);
  
  if (carts[userId].length === initialLength) {
    return res.status(404).json({ message: 'Cart item not found' });
  }
  
  res.json({ message: 'Item removed from cart', cart: carts[userId] });
});

// Clear cart
app.delete('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  carts[userId] = [];
  res.json({ message: 'Cart cleared', cart: [] });
});

// Profile endpoint - get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Return user info without password
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Update profile endpoint
app.put('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, email } = req.body;
  
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Check if email already taken by another user
  if (email && email !== user.email) {
    const emailExists = users.find(u => u.email === email && u.id !== userId);
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    user.email = email;
  }
  
  if (name) {
    user.name = name;
  }
  
  // Return updated user without password
  const { password, ...userWithoutPassword } = user;
  res.json({ message: 'Profile updated successfully', user: userWithoutPassword });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));