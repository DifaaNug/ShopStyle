// Wishlist JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load wishlist items
    loadWishlistItems();
    
    // Update cart count
    updateCartCount();
});

// Function to load wishlist items from localStorage
async function loadWishlistItems() {
    const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const wishlistContainer = document.getElementById('wishlist-items');
    
    if (!wishlistContainer) {
        console.error('Wishlist container not found');
        return;
    }
    
    if (wishlistIds.length === 0) {
        // Show empty wishlist message
        wishlistContainer.innerHTML = `
            <div class="empty-wishlist">
                <i class="far fa-heart"></i>
                <p>Your wishlist is empty</p>
                <a href="products.html" class="primary-btn">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    // Show loading state
    wishlistContainer.innerHTML = '<div class="loading-spinner"></div>';
    
    try {
        // Fetch details for all wishlist products
        const productPromises = wishlistIds.map(id => {
            return fetch(`/api/products/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load product ${id}`);
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error(`Error loading product ${id}:`, error);
                    return null; // Return null for failed products
                });
        });
        
        // Wait for all product details to be fetched
        const products = await Promise.all(productPromises);
        
        // Filter out any null results (failed products)
        const validProducts = products.filter(product => product !== null);
        
        if (validProducts.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="empty-wishlist">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load wishlist items</p>
                    <a href="products.html" class="primary-btn">Continue Shopping</a>
                </div>
            `;
            return;
        }
        
        // Clear container
        wishlistContainer.innerHTML = '';
        
        // Create and append wishlist items
        validProducts.forEach(product => {
            const wishlistItem = createWishlistItem(product);
            wishlistContainer.appendChild(wishlistItem);
        });
        
        // Add event listeners to wishlist items
        setupWishlistEvents();
    } catch (error) {
        console.error('Error loading wishlist items:', error);
        wishlistContainer.innerHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load wishlist items</p>
                <a href="products.html" class="primary-btn">Continue Shopping</a>
            </div>
        `;
    }
}

// Function to create a wishlist item element
function createWishlistItem(product) {
    const item = document.createElement('div');
    item.className = 'wishlist-item';
    item.dataset.productId = product.id;
    
    // Check if product is on sale
    const isOnSale = product.salePrice && product.salePrice < product.price;
    
    // Format prices
    const formattedRegularPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(product.price);
    
    const formattedSalePrice = isOnSale ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(product.salePrice) : '';
    
    item.innerHTML = `
        <div class="wishlist-item-image">
            <a href="product-detail.html?id=${product.id}">
                <img src="${product.imageUrl}" alt="${product.name}">
            </a>
        </div>
        
        <div class="wishlist-item-info">
            <h3 class="wishlist-item-name">
                <a href="product-detail.html?id=${product.id}">${product.name}</a>
            </h3>
            <div class="wishlist-item-price">
                ${isOnSale ? 
                    `<span class="original-price">${formattedRegularPrice}</span>
                     <span class="sale-price">${formattedSalePrice}</span>` : 
                    `<span class="regular-price">${formattedRegularPrice}</span>`
                }
            </div>
            <div class="wishlist-item-rating">
                ${generateRatingStars(product.rating || 0)}
                <span class="rating-count">(${product.reviewCount || 0})</span>
            </div>
            <p class="wishlist-item-description">${truncateText(product.description, 120)}</p>
            <div class="wishlist-item-actions">
                <button class="primary-btn add-to-cart-btn" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="secondary-btn remove-from-wishlist" data-product-id="${product.id}">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `;
    
    return item;
}

// Function to generate rating stars HTML
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// Function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    
    if (text.length <= maxLength) {
        return text;
    }
    
    return text.slice(0, maxLength) + '...';
}

// Function to set up event listeners for wishlist items
function setupWishlistEvents() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            addToCart(productId, 1);
        });
    });
    
    // Remove from wishlist buttons
    const removeButtons = document.querySelectorAll('.remove-from-wishlist');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            removeFromWishlist(productId);
        });
    });
    
    // Clear all wishlist button
    const clearWishlistBtn = document.querySelector('.clear-wishlist');
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', clearWishlist);
    }
}

// Function to add product to cart
function addToCart(productId, quantity) {
    // Get current cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
    } else {
        // Add new item
        cart.push({
            id: productId,
            quantity: quantity
        });
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in navbar
    updateCartCount();
    
    // Show notification
    showNotification('Product added to cart!', 'success');
}

// Function to remove product from wishlist
function removeFromWishlist(productId) {
    // Get existing wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Remove product from wishlist
    const index = wishlist.indexOf(productId);
    
    if (index !== -1) {
        wishlist.splice(index, 1);
        
        // Save updated wishlist
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Remove item from DOM with animation
        const item = document.querySelector(`.wishlist-item[data-product-id="${productId}"]`);
        
        if (item) {
            item.classList.add('removing');
            
            setTimeout(() => {
                item.remove();
                
                // Check if wishlist is now empty
                if (wishlist.length === 0) {
                    document.getElementById('wishlist-items').innerHTML = `
                        <div class="empty-wishlist">
                            <i class="far fa-heart"></i>
                            <p>Your wishlist is empty</p>
                            <a href="products.html" class="primary-btn">Continue Shopping</a>
                        </div>
                    `;
                }
            }, 300);
        }
        
        // Show notification
        showNotification('Product removed from wishlist', 'info');
    }
}

// Function to clear entire wishlist
function clearWishlist() {
    // Confirm before clearing
    if (!confirm('Are you sure you want to clear your entire wishlist?')) {
        return;
    }
    
    // Clear wishlist in localStorage
    localStorage.setItem('wishlist', '[]');
    
    // Show empty wishlist message
    document.getElementById('wishlist-items').innerHTML = `
        <div class="empty-wishlist">
            <i class="far fa-heart"></i>
            <p>Your wishlist is empty</p>
            <a href="products.html" class="primary-btn">Continue Shopping</a>
        </div>
    `;
    
    // Show notification
    showNotification('Wishlist cleared', 'info');
}

// Function to update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    }
}

// Function to show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${message}
        </div>
    `;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Remove from DOM after animation
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
