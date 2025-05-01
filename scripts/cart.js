// Cart functionality
let cartModal = null;

function initCart() {
    console.log('Initializing cart...');
    setupCartListeners();
    createCartModal();
}

function setupCartListeners() {
    const cartButton = document.querySelector('.cart-button');
    if (!cartButton) {
        console.error('Cart button not found');
        return;
    }

    // Update cart count
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    updateCartCount(cartItems.length);

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

// Update cart count display
function updateCartCount(count) {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
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
                            <span>${item.name}</span>
                            <span>$${item.price}</span>
                        </div>
                    `).join('')
                }
            </div>
            ${cartItems.length > 0 ? 
                `<div class="cart-footer">
                    <div class="cart-total">
                        Total: $${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </div>
                    <button class="checkout-button">Checkout</button>
                </div>` : ''
            }
        </div>
    `;

    document.body.appendChild(cartModal);

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

// Add test item function (for testing purposes)
window.addTestItem = function() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push({
        name: 'Test Product ' + (cartItems.length + 1),
        price: 9.99
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount(cartItems.length);
    
    // Refresh cart modal if it's open
    if (cartModal && cartModal.classList.contains('active')) {
        createCartModal();
        cartModal.classList.add('active');
    }
};

// Export initCart for use in index.html
window.initCart = initCart; 