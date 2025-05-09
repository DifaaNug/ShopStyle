// Checkout JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initCheckout();
});

// Initialize checkout
function initCheckout() {
    // Load cart items
    loadCartItems();
    
    // Setup payment method toggles
    setupPaymentMethods();
    
    // Setup form validation and submission
    setupCheckoutForm();
    
    // Setup order modal events
    setupOrderModal();
    
    // Auto-fill user info if available
    autoFillUserInfo();
}

// Load cart items from localStorage
function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const orderItemsContainer = document.getElementById('order-items');
    
    if (cartItems.length === 0) {
        // If cart is empty, show message and disable order button
        orderItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        document.getElementById('place-order-btn').disabled = true;
        document.getElementById('place-order-btn').classList.add('disabled');
        return;
    }
    
    // Remove any existing empty cart message
    const emptyCartMessage = orderItemsContainer.querySelector('.empty-cart-message');
    if (emptyCartMessage) {
        emptyCartMessage.remove();
    }
    
    // Add items to order summary
    let orderItemsHTML = '';
    cartItems.forEach(item => {
        orderItemsHTML += `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}" class="order-item-img">
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="item-price-qty">
                        <span>$${item.price.toFixed(2)}</span>
                        <span>Qty: ${item.quantity || 1}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    orderItemsContainer.innerHTML = orderItemsHTML;
    
    // Calculate and display totals
    updateOrderTotals(cartItems);
}

// Calculate and update order totals
function updateOrderTotals(cartItems) {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = subtotal > 0 ? 10 : 0; // $10 shipping fee if cart has items
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Setup payment method toggles
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const creditCardFields = document.getElementById('credit-card-fields');
    const paypalFields = document.getElementById('paypal-fields');
    const bankTransferFields = document.getElementById('bank-transfer-fields');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all payment fields
            creditCardFields.style.display = 'none';
            paypalFields.style.display = 'none';
            bankTransferFields.style.display = 'none';
            
            // Show selected payment fields
            switch(this.value) {
                case 'credit-card':
                    creditCardFields.style.display = 'block';
                    break;
                case 'paypal':
                    paypalFields.style.display = 'block';
                    break;
                case 'bank-transfer':
                    bankTransferFields.style.display = 'block';
                    break;
            }
        });
    });
}

// Setup form validation and submission
function setupCheckoutForm() {
    const placeOrderBtn = document.getElementById('place-order-btn');
    
    placeOrderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get form data
        const form = document.getElementById('checkout-form');
        
        // Basic validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Remove error class when user types
                field.addEventListener('input', function() {
                    if (this.value.trim()) {
                        this.classList.remove('error');
                    }
                });
            } else {
                field.classList.remove('error');
            }
        });
        
        // If using credit card, validate card fields
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        if (paymentMethod === 'credit-card') {
            const cardFields = document.querySelectorAll('#credit-card-fields input');
            cardFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Remove error class when user types
                    field.addEventListener('input', function() {
                        if (this.value.trim()) {
                            this.classList.remove('error');
                        }
                    });
                } else {
                    field.classList.remove('error');
                }
            });
        }
        
        if (!isValid) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Process the order
        processOrder(form);
    });
}

// Process the order
function processOrder(form) {
    // Get form data
    const formData = new FormData(form);
    const orderData = {
        customerInfo: {
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            postal: formData.get('postal'),
            country: formData.get('country')
        },
        paymentMethod: formData.get('payment'),
        cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
        orderDate: new Date().toISOString(),
        orderId: generateOrderId(),
        status: 'Processing'
    };
    
    // Save order to localStorage for demo purposes
    saveOrder(orderData);
    
    // Show confirmation modal with email and order number
    document.getElementById('order-number').textContent = orderData.orderId;
    document.getElementById('confirmation-email').textContent = orderData.customerInfo.email;
    
    // Show the modal
    const orderModal = document.getElementById('order-modal');
    orderModal.classList.add('active');
    
    // Clear the cart
    localStorage.removeItem('cartItems');
}

// Save order to localStorage
function saveOrder(orderData) {
    // Get existing orders or initialize empty array
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Add new order
    orders.push(orderData);
    
    // Save back to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Generate a random order ID
function generateOrderId() {
    return 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase() + 
           '-' + new Date().getTime().toString().substr(-6);
}

// Setup order confirmation modal
function setupOrderModal() {
    const modal = document.getElementById('order-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const continueShopping = document.getElementById('continue-shopping');
    const viewOrder = document.getElementById('view-order');
    
    // Close modal when clicking the X
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        window.location.href = '../index.html';
    });
    
    // Continue shopping button
    continueShopping.addEventListener('click', () => {
        modal.classList.remove('active');
        window.location.href = '../pages/products.html';
    });
    
    // View order button - would go to order status page in a real app
    viewOrder.addEventListener('click', () => {
        modal.classList.remove('active');
        alert('Order tracking would be implemented in a real app');
        window.location.href = '../index.html';
    });
    
    // Close if clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            window.location.href = '../index.html';
        }
    });
}

// Auto-fill user info if available (from localStorage)
function autoFillUserInfo() {
    try {
        // Check if user is logged in
        const token = localStorage.getItem('accessToken');
        
        if (token) {
            // Get saved user info (For demo purposes only)
            const userName = localStorage.getItem('userName');
            const userEmail = localStorage.getItem('userEmail');
            
            if (userName) {
                document.getElementById('fullname').value = userName;
            }
            
            if (userEmail) {
                document.getElementById('email').value = userEmail;
            }
        }
    } catch (error) {
        console.error('Error accessing localStorage:', error);
    }
}

// Add custom validation for card number format
document.addEventListener('DOMContentLoaded', function() {
    const cardNumber = document.getElementById('card-number');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            // Remove any non-digit characters
            let value = this.value.replace(/\D/g, '');
            
            // Add spaces after every 4 digits
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            // Limit to 16 digits (19 characters with spaces)
            if (value.length > 16) {
                formattedValue = formattedValue.substr(0, 19);
            }
            
            this.value = formattedValue;
        });
    }
    
    // Format expiry date as MM/YY
    const expiry = document.getElementById('expiry');
    
    if (expiry) {
        expiry.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                value = value.substr(0, 2) + '/' + value.substr(2, 2);
            }
            
            this.value = value;
        });
    }
});