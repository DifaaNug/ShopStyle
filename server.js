require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// API endpoints for products
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

app.get('/api/products/filter', (req, res) => {
  let filteredProducts = [...products];
  
  // Filter by minimum price
  if (req.query.min_price) {
    const minPrice = parseFloat(req.query.min_price);
    filteredProducts = filteredProducts.filter(p => p.salePrice ? p.salePrice >= minPrice : p.price >= minPrice);
  }
  
  // Filter by maximum price
  if (req.query.max_price) {
    const maxPrice = parseFloat(req.query.max_price);
    filteredProducts = filteredProducts.filter(p => p.salePrice ? p.salePrice <= maxPrice : p.price <= maxPrice);
  }
  
  // Filter by categories
  if (req.query.categories) {
    const categories = req.query.categories.split(',');
    filteredProducts = filteredProducts.filter(p => 
      p.categories && categories.some(cat => p.categories.includes(cat))
    );
  }
  
  // Filter by brands
  if (req.query.brands) {
    const brands = req.query.brands.split(',');
    filteredProducts = filteredProducts.filter(p => brands.includes(p.brand));
  }
  
  // Filter by colors
  if (req.query.colors) {
    const colors = req.query.colors.split(',');
    filteredProducts = filteredProducts.filter(p => 
      p.colors && colors.some(color => p.colors.includes(color))
    );
  }
  
  // Filter by sizes
  if (req.query.sizes) {
    const sizes = req.query.sizes.split(',');
    filteredProducts = filteredProducts.filter(p => 
      p.sizes && sizes.some(size => p.sizes.includes(size))
    );
  }
  
  // Filter by minimum rating
  if (req.query.rating) {
    const minRating = parseFloat(req.query.rating);
    filteredProducts = filteredProducts.filter(p => p.rating >= minRating);
  }
  
  // Sort products
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name_asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default sorting, no change
        break;
    }
  }
  
  res.json(filteredProducts);
});

// Demo user data (replace with real database in production)
const users = [
  {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: bcrypt.hashSync('test123', 8) // hashed password for demo
  }
];

// Array untuk menyimpan pesanan
const orders = [
  {
    orderId: 'ORD-ABC123-789012',
    email: 'difanugrahacoba@gmail.com',
    fullname: 'Difa Nugraha',
    address: 'Jalan Contoh No. 123, Jakarta',
    items: [
      {
        name: 'Classic Blue T-Shirt',
        quantity: 2,
        price: 19.99
      },
      {
        name: 'Leather Wallet',
        quantity: 1,
        price: 24.99
      }
    ],
    subtotal: 64.97,
    shipping: 5.99,
    tax: 7.10,
    total: 78.06,
    status: 'Processing',
    date: new Date().toISOString()
  },
  {
    orderId: 'ORD-XYZ456-456789',
    email: 'test@example.com',
    fullname: 'Test User',
    address: '123 Test Street, Test City',
    items: [
      {
        name: 'Elegant Black Dress',
        quantity: 1,
        price: 49.99
      }
    ],
    subtotal: 49.99,
    shipping: 5.99,
    tax: 5.60,
    total: 61.58,
    status: 'Shipped',
    date: new Date().toISOString()
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
    categories: ['men', 'shirts', 't-shirts'],
    tags: ['men', 't-shirt', 'casual'],
    imageUrl: '../assets/products/tshirt-blue.jpg',
    images: [
      '../assets/products/tshirt-blue.jpg',
      '../assets/products/tshirt-blue-2.jpg',
      '../assets/products/tshirt-blue-3.jpg'
    ],
    stock: 50,
    brand: 'StyleBasics',
    rating: 4.5,
    reviewCount: 28,
    colors: ['blue', 'navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    specifications: {
      material: '100% Cotton',
      fit: 'Regular',
      care: 'Machine wash cold',
      origin: 'Imported'
    },
    reviews: [
      {
        id: 1,
        user: 'John D.',
        rating: 5,
        date: '2023-05-15',
        comment: 'Great quality t-shirt. Very comfortable and true to size.'
      },
      {
        id: 2,
        user: 'Sarah M.',
        rating: 4,
        date: '2023-04-22',
        comment: 'Nice fabric and color, but slightly larger than expected.'
      }
    ]
  },
  {
    id: 2,
    name: 'Elegant Black Dress',
    description: 'Elegant black dress for formal occasions',
    price: 59.99,
    salePrice: 49.99,
    category: 'clothing',
    categories: ['women', 'dresses', 'formal'],
    tags: ['women', 'dress', 'formal'],
    imageUrl: '../assets/products/dress-black.jpg',
    images: [
      '../assets/products/dress-black.jpg',
      '../assets/products/dress-black-2.jpg',
      '../assets/products/dress-black-3.jpg'
    ],
    stock: 30,
    brand: 'Eleganza',
    rating: 4.8,
    reviewCount: 42,
    colors: ['black'],
    sizes: ['XS', 'S', 'M', 'L'],
    specifications: {
      material: '95% Polyester, 5% Elastane',
      fit: 'Slim fit',
      care: 'Dry clean only',
      length: 'Midi'
    },
    reviews: [
      {
        id: 1,
        user: 'Emma L.',
        rating: 5,
        date: '2023-06-10',
        comment: 'Perfect little black dress for any occasion. Fits beautifully!'
      },
      {
        id: 2,
        user: 'Michelle R.',
        rating: 4,
        date: '2023-05-28',
        comment: 'Lovely dress, very flattering. Only giving 4 stars because the zipper feels a bit flimsy.'
      }
    ]
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

// GET all orders - public endpoint for demo purposes
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// GET specific order by ID
app.get('/api/orders/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const order = orders.find(o => o.orderId === orderId);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  res.json(order);
});

// GET orders by email - untuk mencari pesanan berdasarkan email
app.get('/api/orders-by-email/:email', (req, res) => {
  const email = req.params.email;
  console.log(`Searching for orders with email: ${email}`);
  
  // Decode email parameter if it's encoded
  const decodedEmail = decodeURIComponent(email);
  console.log(`Decoded email: ${decodedEmail}`);
  
  // Debug log all orders and their emails for comparison
  orders.forEach(order => {
    console.log(`Order ${order.orderId}, email: ${order.email}`);
  });
  
  // Find orders that match this email
  const userOrders = orders.filter(o => o.email === decodedEmail);
  console.log(`Found ${userOrders.length} orders for ${decodedEmail}`);
  
  res.json(userOrders);
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

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'crizykiller246@gmail.com',
        pass: 'yfia fand uosw mvqj'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Function to send order confirmation email
async function sendOrderConfirmationEmail(orderData) {
    try {
        const mailOptions = {
            from: {
                name: 'ShopStyle Store',
                address: 'crizykiller246@gmail.com'
            },
            to: orderData.email,
            subject: `Your ShopStyle Order Confirmation #${orderData.orderId}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: auto; padding: 20px; }
                        .header { background-color: #3498db; color: white; padding: 20px; text-align: center; }
                        .order-details { margin: 20px 0; }
                        .footer { margin-top: 30px; text-align: center; color: #666; }
                        .button { background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Thank You for Your Order!</h1>
                        </div>
                        
                        <div class="order-details">
                            <h2>Order Confirmation</h2>
                            <p>Dear ${orderData.fullname},</p>
                            <p>Your order has been successfully placed. Here are your order details:</p>
                            
                            <h3>Order Number: ${orderData.orderId}</h3>
                            <h4>Order Summary:</h4>
                            <ul>
                                ${orderData.items.map(item => `
                                    <li>${item.name} - Quantity: ${item.quantity} - $${item.price}</li>
                                `).join('')}
                            </ul>
                            
                            <p><strong>Subtotal:</strong> $${orderData.subtotal}</p>
                            <p><strong>Shipping:</strong> $${orderData.shipping}</p>
                            <p><strong>Tax:</strong> $${orderData.tax}</p>
                            <p><strong>Total:</strong> $${orderData.total}</p>
                            
                            <p><strong>Shipping Address:</strong><br>
                            ${orderData.address}</p>
                        </div>
                        
                        <div class="footer">
                            <p>If you have any questions, please contact our customer service.</p>
                            <p>© ${new Date().getFullYear()} ShopStyle. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high',
                'Content-Type': 'text/html; charset=UTF-8'
            }
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

// Handle order submission and email confirmation
app.post('/api/place-order', async (req, res) => {
  try {
    const orderData = {
      orderId: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now().toString().substr(-6)}`,
      email: req.body.email,
      fullname: req.body.fullname,
      address: req.body.address,
      items: req.body.items,
      subtotal: req.body.subtotal,
      shipping: req.body.shipping,
      tax: req.body.tax,
      total: req.body.total,
      status: 'Processing',
      date: new Date().toISOString()
    };

    // Menyimpan pesanan ke array orders
    orders.push(orderData);
    console.log('Order saved:', orderData.orderId);

    // Send confirmation email
    const emailSent = await sendOrderConfirmationEmail(orderData);

    if (emailSent) {
      res.json({
        success: true,
        message: 'Order placed successfully!',
        orderId: orderData.orderId
      });
    } else {
      throw new Error('Failed to send confirmation email');
    }
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process order'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export orders array for testing purposes
module.exports = { orders };