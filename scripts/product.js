// Sample product data
const products = [
    {
        id: 1,
        name: "Premium Leather Jacket",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
        category: "clothing",
        rating: 4.5,
        isNew: true
    },
    {
        id: 2,
        name: "Designer Handbag",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
        category: "bags",
        rating: 4.8,
        isNew: false
    },
    {
        id: 3,
        name: "Luxury Watch",
        price: 999.99,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
        category: "watches",
        rating: 4.9,
        isNew: true
    },
    {
        id: 4,
        name: "Branded Sneakers",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        category: "shoes",
        rating: 4.7,
        isNew: false
    },
    {
        id: 5,
        name: "Fashion Sunglasses",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
        category: "accessories",
        rating: 4.6,
        isNew: true
    }
];

// Function to create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.isNew ? '<span class="badge new">New</span>' : ''}
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <div class="product-rating">
                ${createRatingStars(product.rating)}
            </div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" data-product-id="${product.id}">
                Add to Cart
            </button>
        </div>
    `;
    return card;
}

// Function to create rating stars
function createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Function to load products into the grid
function loadProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    products.forEach(product => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Function to handle adding to cart
function addToCart(event) {
    const productId = event.target.dataset.productId;
    const product = products.find(p => p.id === parseInt(productId));
    
    if (product) {
        // Get existing cart items from localStorage
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Check if product already exists in cart
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            // If product exists, increment quantity
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            // If product doesn't exist, add it with quantity 1
            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update cart count in navbar
        updateCartCount();
        
        // Show success message
        showNotification('Added to cart!');
    }
}

// Function to update cart count in navbar
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    
    // Update cart count element
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add animation class
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount(); // Initialize cart count
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 