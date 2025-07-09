const fetch = require('node-fetch');

async function testOrder() {
  try {
    console.log('Testing order placement...');
    
    const orderData = {
      email: "test@example.com",
      fullname: "Test User",
      phone: "123456789",
      address: "Test Address",
      items: [
        {
          name: "Test Product",
          quantity: 1,
          price: 25.99
        }
      ],
      subtotal: 25.99,
      shipping: 10,
      tax: 2.60,
      total: 38.59
    };
    
    console.log('Sending order:', orderData);
    
    const response = await fetch('http://localhost:3000/api/place-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    console.log('Response:', result);
    
    // Check if order was saved
    console.log('Checking orders...');
    const ordersResponse = await fetch('http://localhost:3000/api/orders');
    const orders = await ordersResponse.json();
    console.log('All orders:', orders);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testOrder();
