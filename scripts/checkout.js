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

// Function to show error message
function showError(message) {
    const errorDiv = document.getElementById('error-messages');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        
        // Scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        console.error('Error:', message);
        alert(message);
    }
}

// Setup checkout form submission
function setupCheckoutForm() {
    console.log('Setting up checkout form...');
    
    const form = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn-summary');
    
    if (!form) {
        console.error('Checkout form not found!');
        return;
    }
    
    if (!placeOrderBtn) {
        console.error('Place order button not found!');
        return;
    }
    
    console.log('Form and button found, setting up event listener...');
    
    // Menghubungkan tombol ringkasan dengan form
    placeOrderBtn.addEventListener('click', function() {
        console.log('Summary order button clicked');
        
        // Validasi form terlebih dahulu
        if (!validateCheckoutForm()) {
            return;
        }
        
        // Jika form valid, jalankan submit
        submitCheckoutForm();
    });
    
    // Function untuk validasi form
    function validateCheckoutForm() {
        // Clear previous error messages
        const errorDiv = document.getElementById('error-messages');
        errorDiv.textContent = '';
        errorDiv.classList.remove('show');
        
        // Basic form validation
        const email = document.getElementById('email').value;
        const fullname = document.getElementById('fullname').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        
        if (!email || !fullname || !phone || !address) {
            showError('Please fill in all required fields');
            // Scroll to form
            document.querySelector('.checkout-form-container').scrollIntoView({ behavior: 'smooth' });
            return false;
        }
        
        // Get cart items and validate
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        if (cartItems.length === 0) {
            showError('Your cart is empty');
            return false;
        }
        
        return true;
    }
    
    // Function untuk submit form
    async function submitCheckoutForm() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const email = document.getElementById('email').value;
        const fullname = document.getElementById('fullname').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        const shipping = 10;
        const tax = subtotal * 0.1;
        const total = subtotal + shipping + tax;
        
        // Prepare order data
        const orderData = {
            email: email,
            fullname: fullname,
            phone: phone,
            address: address,
            items: cartItems,
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total
        };
        
        console.log('Sending order data:', orderData);
        
        try {
            // Disable the place order button while processing
            placeOrderBtn.disabled = true;
            placeOrderBtn.textContent = 'Processing...';
            
            // Send order to server
            const response = await fetch('/api/place-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            const result = await response.json();
            console.log('Server response:', result);                    if (result.success) {
                // Clear cart
                localStorage.removeItem('cartItems');
                
                // Save user email for future reference if not already saved
                if (!localStorage.getItem('userEmail')) {
                    localStorage.setItem('userEmail', email);
                }
                
                // Show success message
                const orderNumberEl = document.getElementById('order-number');
                const confirmationEmailEl = document.getElementById('confirmation-email');
                if (orderNumberEl) orderNumberEl.textContent = result.orderId;
                if (confirmationEmailEl) confirmationEmailEl.textContent = email;
                
                // Show order modal
                const orderModal = document.getElementById('order-modal');
                if (orderModal) {
                    orderModal.style.display = 'block';
                } else {
                    alert('Order placed successfully! Your order ID: ' + result.orderId);
                    window.location.href = '/';
                }
            } else {
                throw new Error(result.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            showError('Failed to place order: ' + error.message);
        } finally {
            // Re-enable the place order button
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Order';
        }
    }
}

// Function to place order and send confirmation email
async function placeOrder(orderData) {
    try {
        const response = await fetch('/api/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            // Show success modal
            const modal = document.getElementById('order-success-modal');
            const orderIdSpan = document.getElementById('order-id');
            const emailSpan = document.getElementById('confirmation-email');
            
            orderIdSpan.textContent = result.orderId;
            emailSpan.textContent = orderData.email;
            
            modal.style.display = 'block';
            
            // Clear cart
            localStorage.removeItem('cartItems');
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
    }
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
    const closeBtn = document.querySelector('.close-modal');
    const continueBtn = document.getElementById('continue-shopping');
    const viewOrderBtn = document.getElementById('view-order');
    
    if (!modal) return;
    
    // Close modal when clicking X
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            window.location.href = '/';
        });
    }
    
    // Continue shopping button
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            window.location.href = '/pages/products.html';
        });
    }
    
    // View order button (for future implementation)
    if (viewOrderBtn) {
        viewOrderBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            // Redirect to order details page (to be implemented)
            alert('Order details feature coming soon!');
            window.location.href = '/';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            window.location.href = '/';
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