// Products page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load products from API
    loadProducts();
    
    // Setup filter toggles
    setupFilterToggles();
    
    // Handle filter changes
    setupFilterListeners();
});

// Function to load products from API
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products. Please try again later.');
    }
}

// Function to display products in the product grid
function displayProducts(products) {
    const productsContainer = document.querySelector('.product-grid');
    
    if (!productsContainer) {
        console.error('Product container not found');
        return;
    }
    
    // Clear existing products
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<div class="no-products">No products found.</div>';
        return;
    }
    
    // Create product cards
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// Function to create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    
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
    
    card.innerHTML = `
        <div class="product-image">
            <a href="product-detail.html?id=${product.id}">
                <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
            </a>
            
            <div class="product-actions">
                <button class="action-btn add-to-wishlist" title="Add to Wishlist" data-product-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
                <button class="action-btn quick-view" title="Quick View" data-product-id="${product.id}">
                    <i class="far fa-eye"></i>
                </button>
                <button class="action-btn add-to-cart" title="Add to Cart" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
            
            ${isOnSale ? '<span class="sale-badge">Sale</span>' : ''}
        </div>
        
        <div class="product-info">
            <h3 class="product-name">
                <a href="product-detail.html?id=${product.id}">${product.name}</a>
            </h3>
            <div class="product-price">
                ${isOnSale ? 
                    `<span class="original-price">${formattedRegularPrice}</span>
                     <span class="sale-price">${formattedSalePrice}</span>` : 
                    `<span class="regular-price">${formattedRegularPrice}</span>`
                }
            </div>
            <div class="product-rating">
                ${generateRatingStars(product.rating || 0)}
                <span class="rating-count">(${product.reviewCount || 0})</span>
            </div>
        </div>
    `;
    
    // Add event listeners to action buttons
    setupProductCardEvents(card);
    
    return card;
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

// Function to set up event listeners for product card actions
function setupProductCardEvents(card) {
    const productId = card.dataset.productId;
    
    // Wishlist button
    const wishlistBtn = card.querySelector('.add-to-wishlist');
    wishlistBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleWishlistItem(productId);
    });
    
    // Quick view button
    const quickViewBtn = card.querySelector('.quick-view');
    quickViewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openQuickView(productId);
    });
    
    // Add to cart button
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addToCart(productId, 1);
    });
}

// Function to toggle wishlist item
function toggleWishlistItem(productId) {
    // Get existing wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Check if product is already in wishlist
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        // Add to wishlist
        wishlist.push(productId);
        showNotification('Product added to wishlist!', 'success');
        
        // Update button visual state
        const wishlistBtn = document.querySelector(`.add-to-wishlist[data-product-id="${productId}"]`);
        if (wishlistBtn) {
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
            wishlistBtn.classList.add('active');
        }
    } else {
        // Remove from wishlist
        wishlist.splice(index, 1);
        showNotification('Product removed from wishlist!', 'info');
        
        // Update button visual state
        const wishlistBtn = document.querySelector(`.add-to-wishlist[data-product-id="${productId}"]`);
        if (wishlistBtn) {
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
            wishlistBtn.classList.remove('active');
        }
    }
    
    // Save updated wishlist to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Function to open quick view modal
function openQuickView(productId) {
    // Create and display quick view modal for the product
    fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Create modal with product details
            const modal = document.createElement('div');
            modal.className = 'quick-view-modal';
            modal.innerHTML = `
                <div class="quick-view-content">
                    <button class="close-modal">×</button>
                    <div class="quick-view-grid">
                        <div class="quick-view-image">
                            <img src="${product.imageUrl}" alt="${product.name}">
                        </div>
                        <div class="quick-view-details">
                            <h2>${product.name}</h2>
                            <div class="product-rating">
                                ${generateRatingStars(product.rating || 0)}
                                <span class="rating-count">(${product.reviewCount || 0} reviews)</span>
                            </div>
                            <div class="product-price">
                                ${product.salePrice && product.salePrice < product.price ? 
                                    `<span class="original-price">$${product.price.toFixed(2)}</span>
                                     <span class="sale-price">$${product.salePrice.toFixed(2)}</span>` : 
                                    `<span class="regular-price">$${product.price.toFixed(2)}</span>`
                                }
                            </div>
                            <p class="product-description">${product.description}</p>
                            <div class="product-actions">
                                <div class="quantity-control">
                                    <button class="quantity-btn minus">-</button>
                                    <input type="number" value="1" min="1" max="${product.stock || 10}" class="quantity-input">
                                    <button class="quantity-btn plus">+</button>
                                </div>
                                <button class="primary-btn add-to-cart-btn" data-product-id="${product.id}">
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                            </div>
                            <a href="product-detail.html?id=${product.id}" class="view-details-link">
                                View Full Details
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            // Append to body
            document.body.appendChild(modal);
            
            // Add event listeners
            setupQuickViewEvents(modal, product);
            
            // Prevent body scrolling
            document.body.classList.add('modal-open');
            
            // Show modal with animation
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        })
        .catch(error => {
            console.error('Error loading quick view:', error);
            showNotification('Failed to load product details', 'error');
        });
}

// Function to set up quick view modal events
function setupQuickViewEvents(modal, product) {
    // Close button
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => closeQuickView(modal));
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeQuickView(modal);
        }
    });
    
    // Quantity controls
    const minusBtn = modal.querySelector('.quantity-btn.minus');
    const plusBtn = modal.querySelector('.quantity-btn.plus');
    const quantityInput = modal.querySelector('.quantity-input');
    
    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        const maxValue = parseInt(quantityInput.getAttribute('max'));
        if (currentValue < maxValue) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    // Add to cart button
    const addToCartBtn = modal.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        addToCart(product.id, quantity);
        closeQuickView(modal);
    });
}

// Function to close quick view modal
function closeQuickView(modal) {
    modal.classList.remove('show');
    
    // Remove modal after animation
    setTimeout(() => {
        document.body.removeChild(modal);
        document.body.classList.remove('modal-open');
    }, 300);
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

// Function to show error message
function showError(message) {
    showNotification(message, 'error');
}

// Function to set up filter toggles
function setupFilterToggles() {
    const filterToggles = document.querySelectorAll('.filter-toggle');
    
    filterToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            toggle.classList.toggle('active');
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

// Function to set up filter listeners
function setupFilterListeners() {
    // Price range slider
    const priceRangeInputs = document.querySelectorAll('.price-range input');
    const priceValues = document.querySelectorAll('.price-values span');
    
    if (priceRangeInputs.length === 2) {
        const minPriceInput = priceRangeInputs[0];
        const maxPriceInput = priceRangeInputs[1];
        
        // Set initial values
        updatePriceRangeValues(minPriceInput, maxPriceInput, priceValues);
        
        // Add event listeners
        minPriceInput.addEventListener('input', () => {
            updatePriceRangeValues(minPriceInput, maxPriceInput, priceValues);
        });
        
        maxPriceInput.addEventListener('input', () => {
            updatePriceRangeValues(minPriceInput, maxPriceInput, priceValues);
        });
    }
    
    // Category filters
    const categoryFilters = document.querySelectorAll('.filter-item input[type="checkbox"]');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    // Clear filters button
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

// Function to update price range values
function updatePriceRangeValues(minPriceInput, maxPriceInput, priceValues) {
    // Ensure min price doesn't exceed max price
    if (parseInt(minPriceInput.value) > parseInt(maxPriceInput.value)) {
        minPriceInput.value = maxPriceInput.value;
    }
    
    // Update price value displays
    if (priceValues.length === 2) {
        priceValues[0].textContent = `$${minPriceInput.value}`;
        priceValues[1].textContent = `$${maxPriceInput.value}`;
    }
    
    // Apply filters after a short delay
    clearTimeout(window.priceFilterTimeout);
    window.priceFilterTimeout = setTimeout(applyFilters, 300);
}

// Function to apply all filters
function applyFilters() {
    // Get all filter values
    const filters = getActiveFilters();
    
    // Update URL with filter parameters
    updateUrlWithFilters(filters);
    
    // Fetch filtered products
    fetchFilteredProducts(filters);
}

// Function to get all active filters
function getActiveFilters() {
    const filters = {
        price: {
            min: 0,
            max: 1000
        },
        categories: [],
        brands: [],
        colors: [],
        sizes: [],
        rating: 0,
        sort: 'default'
    };
    
    // Get price range
    const minPriceInput = document.querySelector('.price-range input[name="min-price"]');
    const maxPriceInput = document.querySelector('.price-range input[name="max-price"]');
    
    if (minPriceInput && maxPriceInput) {
        filters.price.min = parseInt(minPriceInput.value);
        filters.price.max = parseInt(maxPriceInput.value);
    }
    
    // Get selected categories
    const categoryInputs = document.querySelectorAll('.filter-categories input:checked');
    filters.categories = Array.from(categoryInputs).map(input => input.value);
    
    // Get selected brands
    const brandInputs = document.querySelectorAll('.filter-brands input:checked');
    filters.brands = Array.from(brandInputs).map(input => input.value);
    
    // Get selected colors
    const colorInputs = document.querySelectorAll('.filter-colors input:checked');
    filters.colors = Array.from(colorInputs).map(input => input.value);
    
    // Get selected sizes
    const sizeInputs = document.querySelectorAll('.filter-sizes input:checked');
    filters.sizes = Array.from(sizeInputs).map(input => input.value);
    
    // Get minimum rating
    const ratingInputs = document.querySelectorAll('.filter-rating input:checked');
    if (ratingInputs.length > 0) {
        filters.rating = parseInt(ratingInputs[0].value);
    }
    
    // Get sort option
    const sortSelect = document.querySelector('.sort-options select');
    if (sortSelect) {
        filters.sort = sortSelect.value;
    }
    
    return filters;
}

// Function to update URL with filter parameters
function updateUrlWithFilters(filters) {
    const url = new URL(window.location.href);
    
    // Clear existing filter parameters
    url.searchParams.delete('min_price');
    url.searchParams.delete('max_price');
    url.searchParams.delete('categories');
    url.searchParams.delete('brands');
    url.searchParams.delete('colors');
    url.searchParams.delete('sizes');
    url.searchParams.delete('rating');
    url.searchParams.delete('sort');
    
    // Add new filter parameters
    url.searchParams.set('min_price', filters.price.min);
    url.searchParams.set('max_price', filters.price.max);
    
    if (filters.categories.length > 0) {
        url.searchParams.set('categories', filters.categories.join(','));
    }
    
    if (filters.brands.length > 0) {
        url.searchParams.set('brands', filters.brands.join(','));
    }
    
    if (filters.colors.length > 0) {
        url.searchParams.set('colors', filters.colors.join(','));
    }
    
    if (filters.sizes.length > 0) {
        url.searchParams.set('sizes', filters.sizes.join(','));
    }
    
    if (filters.rating > 0) {
        url.searchParams.set('rating', filters.rating);
    }
    
    if (filters.sort !== 'default') {
        url.searchParams.set('sort', filters.sort);
    }
    
    // Update URL without reloading the page
    window.history.replaceState({}, '', url);
}

// Function to fetch filtered products
async function fetchFilteredProducts(filters) {
    try {
        // Build query string from filters
        const queryParams = new URLSearchParams();
        
        queryParams.append('min_price', filters.price.min);
        queryParams.append('max_price', filters.price.max);
        
        if (filters.categories.length > 0) {
            queryParams.append('categories', filters.categories.join(','));
        }
        
        if (filters.brands.length > 0) {
            queryParams.append('brands', filters.brands.join(','));
        }
        
        if (filters.colors.length > 0) {
            queryParams.append('colors', filters.colors.join(','));
        }
        
        if (filters.sizes.length > 0) {
            queryParams.append('sizes', filters.sizes.join(','));
        }
        
        if (filters.rating > 0) {
            queryParams.append('rating', filters.rating);
        }
        
        if (filters.sort !== 'default') {
            queryParams.append('sort', filters.sort);
        }
        
        // Show loading state
        document.querySelector('.product-grid').innerHTML = '<div class="loading-spinner"></div>';
        
        // Fetch filtered products
        const response = await fetch(`/api/products/filter?${queryParams.toString()}`);
        
        if (!response.ok) {
            throw new Error('Failed to load filtered products');
        }
        
        const products = await response.json();
        
        // Display filtered products
        displayProducts(products);
        
        // Update filter counts
        updateFilterCounts(products);
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        showError('Failed to load filtered products. Please try again later.');
    }
}

// Function to update filter counts
function updateFilterCounts(products) {
    // Update category counts
    const categories = {};
    products.forEach(product => {
        product.categories.forEach(category => {
            categories[category] = (categories[category] || 0) + 1;
        });
    });
    
    // Update category count displays
    Object.entries(categories).forEach(([category, count]) => {
        const countElement = document.querySelector(`.filter-categories label[for="category-${category}"] .filter-count`);
        if (countElement) {
            countElement.textContent = `(${count})`;
        }
    });
    
    // Similarly update counts for other filter types...
}

// Function to clear all filters
function clearAllFilters() {
    // Reset checkboxes
    const checkboxes = document.querySelectorAll('.filter-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset price range
    const minPriceInput = document.querySelector('.price-range input[name="min-price"]');
    const maxPriceInput = document.querySelector('.price-range input[name="max-price"]');
    
    if (minPriceInput && maxPriceInput) {
        minPriceInput.value = minPriceInput.min;
        maxPriceInput.value = maxPriceInput.max;
        
        const priceValues = document.querySelectorAll('.price-values span');
        if (priceValues.length === 2) {
            priceValues[0].textContent = `$${minPriceInput.min}`;
            priceValues[1].textContent = `$${maxPriceInput.max}`;
        }
    }
    
    // Reset sort option
    const sortSelect = document.querySelector('.sort-options select');
    if (sortSelect) {
        sortSelect.value = 'default';
    }
    
    // Clear URL parameters and reload products
    window.history.replaceState({}, '', window.location.pathname);
    loadProducts();
}

// Update product count badge
function updateProductCount(count) {
    const productCountElement = document.querySelector('.product-count');
    if (productCountElement) {
        productCountElement.textContent = `${count} product${count !== 1 ? 's' : ''} found`;
    }
}

// Initialize the page
updateCartCount(); // Update cart count on page load
