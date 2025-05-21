// Function to display product details
function displayProductDetails(product) {
    document.title = `${product.name} - ShopStyle`;
    
    // Get containers
    const productContent = document.querySelector('.product-detail-content');
    const mainImage = document.getElementById('main-product-image');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    
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
    
    // Update main image
    mainImage.src = product.images && product.images.length > 0 ? product.images[0] : product.imageUrl;
    mainImage.alt = product.name;
    
    // Create thumbnails
    if (product.images && product.images.length > 0) {
        thumbnailContainer.innerHTML = '';
        product.images.forEach((imageUrl, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
            thumbnail.innerHTML = `<img src="${imageUrl}" alt="${product.name} - Image ${index + 1}">`;
            thumbnail.addEventListener('click', () => {
                // Update main image
                mainImage.src = imageUrl;
                
                // Update active thumbnail
                document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                thumbnail.classList.add('active');
            });
            thumbnailContainer.appendChild(thumbnail);
        });
    } else {
        // No thumbnails available
        thumbnailContainer.innerHTML = '';
    }
    
    // Update product info
    const productInfo = document.querySelector('.product-info');
    
    if (productInfo) {
        productInfo.innerHTML = `
            <h1 class="product-title">${product.name}</h1>
            <div class="product-meta">
                <div class="product-rating">
                    ${generateRatingStars(product.rating || 0)}
                    <span class="review-count">(${product.reviewCount || 0} reviews)</span>
                </div>
                ${product.brand ? `<div class="product-brand">Brand: <span>${product.brand}</span></div>` : ''}
                ${product.stock ? `
                    <div class="product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        <i class="fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </div>
                ` : ''}
            </div>
            
            <div class="product-price">
                ${isOnSale ? 
                    `<span class="original-price">${formattedRegularPrice}</span>
                     <span class="sale-price">${formattedSalePrice}</span>` : 
                    `<span class="regular-price">${formattedRegularPrice}</span>`
                }
            </div>
            
            <p class="product-description">${product.description}</p>
            
            ${product.colors && product.colors.length > 0 ? `
                <div class="product-colors">
                    <h3>Colors:</h3>
                    <div class="color-options">
                        ${product.colors.map(color => `
                            <div class="color-option" data-color="${color}">
                                <div class="color-swatch" style="background-color: ${color}"></div>
                                <span>${capitalizeFirstLetter(color)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${product.sizes && product.sizes.length > 0 ? `
                <div class="product-sizes">
                    <h3>Size:</h3>
                    <div class="size-options">
                        ${product.sizes.map(size => `
                            <div class="size-option" data-size="${size}">
                                ${size}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="product-actions">
                <div class="quantity-control">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" value="1" min="1" max="${product.stock || 10}" class="quantity-input">
                    <button class="quantity-btn plus">+</button>
                </div>
                <button class="primary-btn add-to-cart-btn" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="icon-btn wishlist-btn" data-product-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            
            <div class="product-share">
                <h3>Share:</h3>
                <div class="social-share">
                    <a href="#" class="social-icon" title="Share on Facebook">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" class="social-icon" title="Share on Twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="#" class="social-icon" title="Share on Pinterest">
                        <i class="fab fa-pinterest-p"></i>
                    </a>
                    <a href="#" class="social-icon" title="Share on Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                </div>
            </div>
        `;
        
        // Set up events for the product details page
        setupProductDetails(product);
    }
    
    // Update tabs content
    updateProductTabs(product);
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

// Function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to set up product details events
function setupProductDetails(product) {
    // Color options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
        });
    });
    
    // Size options
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
        });
    });
    
    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const selectedColor = document.querySelector('.color-option.active');
            const selectedSize = document.querySelector('.size-option.active');
            const quantity = parseInt(document.querySelector('.quantity-input').value);
            
            // Validate selections if options exist
            if (product.colors && product.colors.length > 0 && !selectedColor) {
                showError('Please select a color');
                return;
            }
            
            if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                showError('Please select a size');
                return;
            }
            
            // Create product variation object
            const productVariation = {
                id: product.id,
                color: selectedColor ? selectedColor.dataset.color : null,
                size: selectedSize ? selectedSize.dataset.size : null,
                quantity: quantity
            };
            
            // Add to cart
            addToCart(productVariation);
        });
    }
    
    // Wishlist button
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            toggleWishlistItem(product.id);
        });
    }
}

// Function to update product tabs content
function updateProductTabs(product) {
    // Specifications tab
    const specificationsContainer = document.getElementById('specifications-content');
    if (specificationsContainer && product.specifications) {
        let specHtml = '<table class="specs-table">';
        
        for (const [key, value] of Object.entries(product.specifications)) {
            specHtml += `
                <tr>
                    <th>${capitalizeFirstLetter(key)}</th>
                    <td>${value}</td>
                </tr>
            `;
        }
        
        specHtml += '</table>';
        specificationsContainer.innerHTML = specHtml;
    }
    
    // Reviews tab
    const reviewsContainer = document.getElementById('reviews-content');
    if (reviewsContainer) {
        if (product.reviews && product.reviews.length > 0) {
            let reviewsHtml = '';
            
            product.reviews.forEach(review => {
                reviewsHtml += `
                    <div class="review-item">
                        <div class="review-header">
                            <div class="review-author">${review.user}</div>
                            <div class="review-date">${formatDate(review.date)}</div>
                        </div>
                        <div class="review-rating">${generateRatingStars(review.rating)}</div>
                        <div class="review-content">
                            <p>${review.comment}</p>
                        </div>
                    </div>
                `;
            });
            
            reviewsContainer.innerHTML = `
                <div class="reviews-summary">
                    <div class="average-rating">
                        <div class="rating-number">${product.rating.toFixed(1)}</div>
                        <div class="rating-stars">${generateRatingStars(product.rating)}</div>
                        <div class="rating-count">${product.reviewCount} Reviews</div>
                    </div>
                    <div class="write-review">
                        <button id="write-review-btn" class="secondary-btn">Write a Review</button>
                    </div>
                </div>
                <div class="reviews-list">
                    ${reviewsHtml}
                </div>
            `;
            
            // Set up write review button
            document.getElementById('write-review-btn').addEventListener('click', () => {
                openReviewModal(product.id);
            });
        } else {
            reviewsContainer.innerHTML = `
                <div class="no-reviews">
                    <p>This product has no reviews yet.</p>
                    <button id="write-review-btn" class="primary-btn">Be the first to write a review</button>
                </div>
            `;
            
            // Set up write review button
            document.getElementById('write-review-btn').addEventListener('click', () => {
                openReviewModal(product.id);
            });
        }
    }
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to setup tabs
function setupTabs() {
    const tabLinks = document.querySelectorAll('.product-tabs .tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all tabs
            tabLinks.forEach(tab => tab.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            link.classList.add('active');
            const contentId = link.getAttribute('data-tab');
            document.getElementById(contentId).classList.add('active');
        });
    });
}

// Function to setup review modal
function setupReviewModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.id = 'review-modal';
    modal.className = 'review-modal';
    modal.innerHTML = `
        <div class="review-modal-content">
            <button class="close-modal">&times;</button>
            <h2>Write a Review</h2>
            <form id="review-form">
                <input type="hidden" id="product-id">
                
                <div class="form-group">
                    <label for="review-name">Name</label>
                    <input type="text" id="review-name" required>
                </div>
                
                <div class="form-group">
                    <label for="review-email">Email</label>
                    <input type="email" id="review-email" required>
                </div>
                
                <div class="form-group">
                    <label>Rating</label>
                    <div class="rating-input">
                        <i class="far fa-star" data-rating="1"></i>
                        <i class="far fa-star" data-rating="2"></i>
                        <i class="far fa-star" data-rating="3"></i>
                        <i class="far fa-star" data-rating="4"></i>
                        <i class="far fa-star" data-rating="5"></i>
                    </div>
                    <input type="hidden" id="review-rating" required>
                </div>
                
                <div class="form-group">
                    <label for="review-comment">Your Review</label>
                    <textarea id="review-comment" rows="5" required></textarea>
                </div>
                
                <button type="submit" class="primary-btn">Submit Review</button>
            </form>
        </div>
    `;
    
    // Append modal to body
    document.body.appendChild(modal);
    
    // Setup modal close button
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        closeReviewModal();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeReviewModal();
        }
    });
    
    // Setup star rating
    const ratingStars = modal.querySelectorAll('.rating-input i');
    const ratingInput = document.getElementById('review-rating');
    
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            updateStars(ratingStars, rating);
        });
        
        star.addEventListener('mouseleave', () => {
            const rating = parseInt(ratingInput.value) || 0;
            updateStars(ratingStars, rating);
        });
        
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            ratingInput.value = rating;
            updateStars(ratingStars, rating);
        });
    });
    
    // Handle form submit
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const productId = document.getElementById('product-id').value;
        const name = document.getElementById('review-name').value;
        const email = document.getElementById('review-email').value;
        const rating = parseInt(document.getElementById('review-rating').value);
        const comment = document.getElementById('review-comment').value;
        
        // Validate form
        if (!productId || !name || !email || !rating || !comment) {
            showError('Please fill all fields');
            return;
        }
        
        // Submit review
        submitReview({
            productId,
            name,
            email,
            rating,
            comment
        });
    });
}

// Function to update stars display
function updateStars(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

// Function to open review modal
function openReviewModal(productId) {
    const modal = document.getElementById('review-modal');
    document.getElementById('product-id').value = productId;
    
    // Reset form
    document.getElementById('review-form').reset();
    updateStars(document.querySelectorAll('.rating-input i'), 0);
    
    // Show modal
    modal.classList.add('open');
    document.body.classList.add('modal-open');
}

// Function to close review modal
function closeReviewModal() {
    const modal = document.getElementById('review-modal');
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
}

// Function to submit review
function submitReview(reviewData) {
    // In a real application, this would be an API call
    // For now, just show success message and close modal
    showNotification('Thank you! Your review has been submitted.', 'success');
    closeReviewModal();
}

// Function to setup quantity controls
function setupQuantityControls() {
    document.addEventListener('click', function(e) {
        // Minus button
        if (e.target.classList.contains('quantity-btn') && e.target.classList.contains('minus')) {
            const input = e.target.nextElementSibling;
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
            }
        }
        
        // Plus button
        if (e.target.classList.contains('quantity-btn') && e.target.classList.contains('plus')) {
            const input = e.target.previousElementSibling;
            let value = parseInt(input.value);
            let max = parseInt(input.getAttribute('max'));
            if (value < max) {
                input.value = value + 1;
            }
        }
    });
}

// Function to load related products
async function loadRelatedProducts(categories) {
    if (!categories || categories.length === 0) {
        return;
    }
    
    try {
        // Get related products container
        const relatedContainer = document.querySelector('.related-products .product-grid');
        
        if (!relatedContainer) {
            return;
        }
        
        // Show loading state
        relatedContainer.innerHTML = '<div class="loading-spinner"></div>';
        
        // In a real application, this would be a filtered API call
        // Here we'll just use a general request and filter locally
        const response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error('Failed to load related products');
        }
        
        const products = await response.json();
        
        // Filter to get related products
        const currentProductId = new URLSearchParams(window.location.search).get('id');
        const relatedProducts = products.filter(product => {
            // Don't include current product
            if (product.id.toString() === currentProductId) {
                return false;
            }
            
            // Check if product shares at least one category/tag
            const productCategories = product.categories || product.tags || [];
            return categories.some(cat => productCategories.includes(cat));
        });
        
        // Limit to 4 related products
        const limitedRelatedProducts = relatedProducts.slice(0, 4);
        
        if (limitedRelatedProducts.length === 0) {
            relatedContainer.innerHTML = '<p class="no-products">No related products found.</p>';
            return;
        }
        
        // Display related products
        relatedContainer.innerHTML = '';
        limitedRelatedProducts.forEach(product => {
            const productCard = createProductCard(product);
            relatedContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}

// Function to create a product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Check if product is on sale
    const isOnSale = product.salePrice && product.salePrice < product.price;
    
    card.innerHTML = `
        <div class="product-image">
            <a href="product-detail.html?id=${product.id}">
                <img src="${product.imageUrl}" alt="${product.name}">
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
                    `<span class="original-price">$${product.price.toFixed(2)}</span>
                     <span class="sale-price">$${product.salePrice.toFixed(2)}</span>` : 
                    `<span class="regular-price">$${product.price.toFixed(2)}</span>`
                }
            </div>
            <div class="product-rating">
                ${generateRatingStars(product.rating || 0)}
                <span class="rating-count">(${product.reviewCount || 0})</span>
            </div>
        </div>
    `;
    
    // Set up card action buttons
    setupCardActionButtons(card);
    
    return card;
}

// Function to setup card action buttons
function setupCardActionButtons(card) {
    // Wishlist button
    const wishlistBtn = card.querySelector('.add-to-wishlist');
    wishlistBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = wishlistBtn.dataset.productId;
        toggleWishlistItem(productId);
    });
    
    // Quick view button
    const quickViewBtn = card.querySelector('.quick-view');
    quickViewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = quickViewBtn.dataset.productId;
        openQuickView(productId);
    });
    
    // Add to cart button
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = addToCartBtn.dataset.productId;
        addToCart({ id: productId, quantity: 1 });
    });
}

// Function to add to cart
function addToCart(productVariation) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => {
        // Compare product ID and variation (if any)
        const idMatch = item.id === productVariation.id;
        const colorMatch = item.color === productVariation.color;
        const sizeMatch = item.size === productVariation.size;
        
        return idMatch && colorMatch && sizeMatch;
    });
    
    if (existingItem) {
        // Update quantity
        existingItem.quantity += productVariation.quantity;
    } else {
        // Add new item
        cart.push(productVariation);
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification('Product added to cart', 'success');
}

// Function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    }
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
        
        // Update wishlist button
        updateWishlistButton(productId, true);
        
        // Show notification
        showNotification('Product added to wishlist', 'success');
    } else {
        // Remove from wishlist
        wishlist.splice(index, 1);
        
        // Update wishlist button
        updateWishlistButton(productId, false);
        
        // Show notification
        showNotification('Product removed from wishlist', 'info');
    }
    
    // Save updated wishlist
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Function to update wishlist button
function updateWishlistButton(productId, isInWishlist) {
    // Main wishlist button in product info
    const wishlistBtn = document.querySelector(`.wishlist-btn[data-product-id="${productId}"]`);
    if (wishlistBtn) {
        const icon = wishlistBtn.querySelector('i');
        if (isInWishlist) {
            icon.className = 'fas fa-heart';
            wishlistBtn.classList.add('active');
        } else {
            icon.className = 'far fa-heart';
            wishlistBtn.classList.remove('active');
        }
    }
    
    // Wishlist button in related products
    const relatedWishlistBtn = document.querySelector(`.add-to-wishlist[data-product-id="${productId}"]`);
    if (relatedWishlistBtn) {
        const icon = relatedWishlistBtn.querySelector('i');
        if (isInWishlist) {
            icon.className = 'fas fa-heart';
            relatedWishlistBtn.classList.add('active');
        } else {
            icon.className = 'far fa-heart';
            relatedWishlistBtn.classList.remove('active');
        }
    }
}

// Function to check if product is in wishlist
function checkWishlistStatus(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isInWishlist = wishlist.includes(productId);
    updateWishlistButton(productId, isInWishlist);
}

// Function to open quick view modal
function openQuickView(productId) {
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
            
            // Set up events
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
            showError('Failed to load product details');
        });
}

// Function to setup quick view events
function setupQuickViewEvents(modal, product) {
    // Close button
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        closeQuickView(modal);
    });
    
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
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        let max = parseInt(quantityInput.getAttribute('max'));
        if (value < max) {
            quantityInput.value = value + 1;
        }
    });
    
    // Add to cart button
    const addToCartBtn = modal.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        addToCart({ 
            id: product.id, 
            quantity: quantity 
        });
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
