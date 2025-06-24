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

    // Add event listeners for quantity buttons in cart sidebar if present
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) {
        setupCartSidebarListeners();
    }
}

// Setup listeners for cart sidebar (if present)
function setupCartSidebarListeners() {
    document.addEventListener('click', function(e) {
        // Handle plus button
        if (e.target.classList.contains('plus') || e.target.closest('button.plus')) {
            const button = e.target.classList.contains('plus') ? e.target : e.target.closest('button.plus');
            const productId = parseInt(button.getAttribute('data-id'));
            if (productId) {
                updateItemQuantity(productId, true);
                e.preventDefault();
            }
        }
        
        // Handle minus button
        if (e.target.classList.contains('minus') || e.target.closest('button.minus')) {
            const button = e.target.classList.contains('minus') ? e.target : e.target.closest('button.minus');
            const productId = parseInt(button.getAttribute('data-id'));
            if (productId) {
                updateItemQuantity(productId, false);
                e.preventDefault();
            }
        }
        
        // Handle trash/remove button
        if (e.target.classList.contains('fa-trash') || e.target.closest('button.remove-item')) {
            const button = e.target.closest('button.remove-item') || e.target.closest('button');
            const productId = parseInt(button.getAttribute('data-id'));
            if (productId) {
                removeFromCart(productId);
                e.preventDefault();
            }
        }
        
        // Handle checkout button in sidebar
        if (e.target.classList.contains('checkout-btn')) {
            proceedToCheckout();
            e.preventDefault();
        }
    });
}

// Update cart display
function updateCartDisplay() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    updateCartCount(totalItems);
    console.log('Cart updated, items:', cartItems);
    
    // Update cart sidebar if present
    updateCartSidebar();
    
    // Always re-create cart modal to ensure it's up to date
    createCartModal();
    
    // Update cart modal visibility if necessary
    if (cartModal && cartModal.classList.contains('active')) {
        cartModal.classList.add('active');
    }
}

// Update cart sidebar contents
function updateCartSidebar() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (!cartSidebar) return;
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = cartSidebar.querySelector('.cart-items');
    const totalAmountElement = cartSidebar.querySelector('.total-amount');
    
    if (cartItemsContainer) {
        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        
        // Update total amount
        if (totalAmountElement) {
            totalAmountElement.textContent = `$${total.toFixed(2)}`;
        }
        
        // Update cart items
        cartItemsContainer.innerHTML = cartItems.length === 0 ? 
            '<p class="empty-cart">Your cart is empty</p>' : 
            cartItems.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                        <div class="quantity-control">
                            <button class="minus" data-id="${item.id}">-</button>
                            <span>${item.quantity || 1}</span>
                            <button class="plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
    }
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
    
    // Toggle cart sidebar if present
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
    
    // Debug: log cart contents when opening
    if ((cartModal && cartModal.classList.contains('active')) || 
        (cartSidebar && cartSidebar.classList.contains('active'))) {
        console.log('Cart opened, contents:', JSON.parse(localStorage.getItem('cartItems')) || []);
    }
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
    console.log('Creating cart modal with items:', cartItems);
    
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
        
        // Checkout button
        const checkoutButton = cartModal.querySelector('.checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', proceedToCheckout);
        }
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

// Proceed to checkout
function proceedToCheckout() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems.length === 0) {
        alert('Your cart is empty. Add items to your cart before checkout.');
        return;
    }
    
    // Hide cart modal if it's open
    if (cartModal) {
        cartModal.classList.remove('active');
    }
    
    // Hide cart sidebar if it's present and open
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
    }
    
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    if (!token) {
        // If not logged in, ask user if they want to login first
        if (confirm('Please login to continue with checkout. Would you like to login now?')) {
            const baseUrl = window.location.pathname.includes('/pages/') ? '../pages/' : 'pages/';
            window.location.href = baseUrl + 'login.html?redirect=checkout';
            return;
        }
    }
    
    // Navigate to checkout page
    const baseUrl = window.location.pathname.includes('/pages/') ? './' : 'pages/';
    window.location.href = baseUrl + 'checkout.html';
}

// Update item quantity
function updateItemQuantity(id, increase) {
    console.log(`Updating quantity for product ID ${id}, ${increase ? 'increasing' : 'decreasing'}`);
    
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
        
        // Update cart modal if it exists and is active
        if (cartModal && cartModal.classList.contains('active')) {
            createCartModal();
            cartModal.classList.add('active');
        }
    }
}

// Remove item from cart
function removeFromCart(id) {
    console.log(`Removing product ID ${id} from cart`);
    
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
    
    // Update cart modal if it exists and is active
    if (cartModal && cartModal.classList.contains('active')) {
        createCartModal();
        cartModal.classList.add('active');
    }
}

// Add to cart function
function addToCart(product) {
    console.log('Adding to cart:', product);
    // Validate product object has required properties
    if (!product || !product.id || !product.name || !product.price) {
        console.error('Invalid product data', product);
        return;
    }
    
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
    
    // Show cart modal after adding
    createCartModal();
    cartModal.classList.add('active');
    
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