// Cart functionality
let cartModal = null;

// Initialize cart on page load
function initCart() {
    console.log('Initializing cart...');
    setupCartListeners();
    createCartModal();
    updateCartDisplay();
}

// Setup cart event listeners
function setupCartListeners() {
    const cartButton = document.querySelector('.cart-button');
    if (!cartButton) {
        console.error('Cart button not found');
        return;
    }

    // Remove existing listeners to prevent duplicates
    const newCartButton = cartButton.cloneNode(true);
    cartButton.parentNode.replaceChild(newCartButton, cartButton);

    // Add click event to cart button
    newCartButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleCart();
    });

    // Add click event to close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartModal && cartModal.classList.contains('active')) {
            const cartContent = cartModal.querySelector('.cart-modal-content');
            if (!cartContent.contains(e.target) && !newCartButton.contains(e.target)) {
                cartModal.classList.remove('active');
            }
        }
    });

    // Add escape key listener
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartModal && cartModal.classList.contains('active')) {
            cartModal.classList.remove('active');
        }
    });
}

// Update cart display
function updateCartDisplay() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    updateCartCount(totalItems);
}

// Update cart count display
function updateCartCount(count) {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'block' : 'none';
    }
}

// Toggle cart visibility
function toggleCart() {
    console.log('Toggling cart...');
    if (!cartModal) {
        createCartModal();
    }
    cartModal.classList.toggle('active');
}

// Create cart modal
function createCartModal() {
    // Remove existing modal if any
    if (cartModal) {
        cartModal.remove();
    }

    cartModal = document.createElement('div');
    cartModal.id = 'cart-modal';
    cartModal.className = 'cart-modal';
    
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    cartModal.innerHTML = `
        <div class="cart-modal-content">
            <div class="cart-modal-header">
                <h3>Shopping Cart</h3>
                <button class="close-cart" aria-label="Close cart">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="cart-items">
                ${cartItems.length === 0 ? 
                    '<p class="empty-cart">Your cart is empty</p>' : 
                    cartItems.map(item => `
                        <div class="cart-item">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="cart-item-details">
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                    <span>${item.quantity || 1}</span>
                                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                                </div>
                            </div>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('')}
            </div>
            ${cartItems.length > 0 ? 
                `<div class="cart-footer">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <button class="checkout-button">Checkout</button>
                </div>` : ''
            }
        </div>
    `;

    document.body.appendChild(cartModal);

    // Add event listeners for cart interactions
    if (cartItems.length > 0) {
        // Quantity buttons
        cartModal.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const isPlus = this.classList.contains('plus');
                updateItemQuantity(id, isPlus);
            });
        });

        // Remove buttons
        cartModal.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                removeFromCart(id);
            });
        });
    }

    // Add event listener to close button
    const closeButton = cartModal.querySelector('.close-cart');
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            cartModal.classList.remove('active');
        });
    }

    // Prevent clicks inside modal from closing it
    const modalContent = cartModal.querySelector('.cart-modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Update item quantity
function updateItemQuantity(id, increase) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        if (increase) {
            cartItems[itemIndex].quantity = (cartItems[itemIndex].quantity || 1) + 1;
        } else {
            cartItems[itemIndex].quantity = Math.max(1, (cartItems[itemIndex].quantity || 1) - 1);
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay();
        createCartModal();
        cartModal.classList.add('active');
    }
}

// Remove item from cart
function removeFromCart(id) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
    createCartModal();
    cartModal.classList.add('active');
}

// Add to cart function
function addToCart(product) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
    
    // Show success message
    showNotification('Added to cart!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Export functions for use in other files
window.initCart = initCart;
window.addToCart = addToCart;
window.updateCartDisplay = updateCartDisplay; 