// Product Detail JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        loadProductDetails(productId);
    } else {
        showError('Product not found!');
    }
      // Load utility functions
    loadExternalScript('../scripts/product-detail-functions.js')
        .then(() => {
            setupTabs();
            setupReviewModal();
            setupQuantityControls();
            
            // Update cart count on load
            updateCartCount();
        });
});

// Function to load external scripts
function loadExternalScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Function to load product details from API
async function loadProductDetails(productId) {
    try {
        // Show loading state
        document.querySelector('.product-detail-content').innerHTML = `
            <div class="loading-spinner"></div>
        `;
        
        // Fetch product details from API
        const response = await fetch('/api/products/' + productId);
        
        if (!response.ok) {
            throw new Error('Product not found');
        }
        
        const product = await response.json();
        displayProductDetails(product);
        
        // Load related products
        loadRelatedProducts(product.categories || product.tags);
        
        // Check if product is in wishlist
        checkWishlistStatus(productId);
        
        // Load related products
        loadRelatedProducts(product.category);
    } catch (error) {
        // For demo, use dummy data if API fails
        console.error('Error loading product details:', error);
        const dummyProduct = getDummyProduct(productId);
        displayProductDetails(dummyProduct);
        loadRelatedProducts('fashion');
    }
}

// Function to display product details
function displayProductDetails(product) {
    // Set page title
    document.title = `${product.name} - ShopStyle`;
    
    // Set main product image
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    // Set product thumbnails
    const thumbnailContainer = document.getElementById('thumbnail-container');
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="${product.name} - Image ${index + 1}">`;
        thumbnail.addEventListener('click', () => {
            // Update main image when thumbnail is clicked
            mainImage.src = image;
            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // Set product name
    document.getElementById('product-name').textContent = product.name;
    
    // Set product SKU
    document.getElementById('product-sku').textContent = product.sku || `SKU${product.id}`;
    
    // Set product price
    if (product.salePrice) {
        document.getElementById('original-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('current-price').textContent = `$${product.salePrice.toFixed(2)}`;
    } else {
        document.getElementById('original-price').textContent = '';
        document.getElementById('current-price').textContent = `$${product.price.toFixed(2)}`;
    }
    
    // Set product rating
    const ratingElement = document.getElementById('product-rating');
    const rating = product.rating || 0;
    ratingElement.innerHTML = generateStarRating(rating);
    document.getElementById('review-count').textContent = `(${product.reviewCount || 0} reviews)`;
    
    // Set product description
    document.getElementById('product-description').innerHTML = product.shortDescription || 'No description available.';
    document.getElementById('full-description').innerHTML = product.description || product.shortDescription || 'No description available.';
    
    // Set up size options if available
    const sizeOptions = document.getElementById('size-options');
    if (product.sizes && product.sizes.length > 0) {
        sizeOptions.innerHTML = '';
        product.sizes.forEach(size => {
            const sizeElement = document.createElement('div');
            sizeElement.className = 'size-option';
            sizeElement.textContent = size;
            sizeElement.addEventListener('click', () => {
                // Toggle selection
                document.querySelectorAll('.size-option').forEach(option => option.classList.remove('selected'));
                sizeElement.classList.add('selected');
            });
            sizeOptions.appendChild(sizeElement);
        });
    } else {
        sizeOptions.innerHTML = '<p>One size fits all</p>';
    }
    
    // Set up color options if available
    const colorOptions = document.getElementById('color-options');
    if (product.colors && product.colors.length > 0) {
        colorOptions.innerHTML = '';
        product.colors.forEach(color => {
            const colorElement = document.createElement('div');
            colorElement.className = 'color-option';
            colorElement.style.backgroundColor = color;
            colorElement.setAttribute('data-color', color);
            colorElement.addEventListener('click', () => {
                // Toggle selection
                document.querySelectorAll('.color-option').forEach(option => option.classList.remove('selected'));
                colorElement.classList.add('selected');
            });
            colorOptions.appendChild(colorElement);
        });
    } else {
        colorOptions.innerHTML = '<p>Only one color available</p>';
    }
    
    // Set up specifications
    const specsTableBody = document.getElementById('specs-table-body');
    if (product.specifications && Object.keys(product.specifications).length > 0) {
        specsTableBody.innerHTML = '';
        for (const [key, value] of Object.entries(product.specifications)) {
            specsTableBody.innerHTML += `
                <tr>
                    <td>${key}</td>
                    <td>${value}</td>
                </tr>
            `;
        }
    } else {
        specsTableBody.innerHTML = '<tr><td colspan="2">No specifications available</td></tr>';
    }
    
    // Set up reviews
    setupReviews(product.reviews || []);
    
    // Set up Add to Cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value) || 1;
        const selectedSize = document.querySelector('.size-option.selected')?.textContent || 'One Size';
        const selectedColor = document.querySelector('.color-option.selected')?.getAttribute('data-color') || 'Default';
        
        addToCart({
            id: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            image: product.images[0],
            quantity: quantity,
            size: selectedSize,
            color: selectedColor
        });
        
        alert(`${quantity} x ${product.name} added to cart!`);
    });
    
    // Set up Add to Wishlist button
    const addToWishlistBtn = document.getElementById('add-to-wishlist-btn');
    addToWishlistBtn.addEventListener('click', () => {
        addToWishlist(product.id);
        alert(`${product.name} added to wishlist!`);
    });
}

// Function to generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Function to set up reviews
function setupReviews(reviews) {
    const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
    
    document.getElementById('average-rating').textContent = averageRating.toFixed(1);
    document.getElementById('average-rating-stars').innerHTML = generateStarRating(averageRating);
    document.getElementById('total-reviews').textContent = reviews.length;
    
    // Set up rating breakdown
    const ratingBreakdownEl = document.getElementById('rating-breakdown');
    ratingBreakdownEl.innerHTML = '';
    
    // Count reviews for each rating
    const ratingCounts = [0, 0, 0, 0, 0];  // For 5, 4, 3, 2, 1 stars
    reviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
            ratingCounts[5 - Math.round(review.rating)]++;
        }
    });
    
    // Generate rating breakdown
    for (let i = 5; i >= 1; i--) {
        const count = ratingCounts[5 - i];
        const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        
        ratingBreakdownEl.innerHTML += `
            <div class="rating-row">
                <div class="rating-label">${i} <i class="fas fa-star"></i></div>
                <div class="rating-bar">
                    <div class="rating-fill" style="width: ${percent}%"></div>
                </div>
                <div class="rating-percent">${count}</div>
            </div>
        `;
    }
    
    // Display reviews
    const reviewsListEl = document.getElementById('reviews-list');
    if (reviews.length > 0) {
        reviewsListEl.innerHTML = '';
        reviews.forEach(review => {
            const date = new Date(review.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            reviewsListEl.innerHTML += `
                <div class="review-item">
                    <div class="review-header">
                        <div class="review-author">${review.author}</div>
                        <div class="review-date">${date}</div>
                    </div>
                    <div class="rating-stars">${generateStarRating(review.rating)}</div>
                    <div class="review-title">${review.title}</div>
                    <div class="review-content">${review.content}</div>
                </div>
            `;
        });
    } else {
        reviewsListEl.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
    }
}

// Function to load related products
async function loadRelatedProducts(category) {
    try {
        // In a real application, this would be an API call
        // For now, simulate with local products data
        const response = await fetch(`/api/products?category=${category}&limit=4`);
        
        if (!response.ok) {
            throw new Error('Failed to load related products');
        }
        
        const products = await response.json();
        displayRelatedProducts(products);
    } catch (error) {
        // For demo, use dummy data if API fails
        console.error('Error loading related products:', error);
        const dummyProducts = getDummyRelatedProducts();
        displayRelatedProducts(dummyProducts);
    }
}

// Function to display related products
function displayRelatedProducts(products) {
    const relatedProductsContainer = document.getElementById('related-products');
    relatedProductsContainer.innerHTML = '';
    
    products.forEach(product => {
        relatedProductsContainer.innerHTML += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.images[0]}" alt="${product.name}">
                    <div class="product-actions">
                        <button class="wishlist-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></button>
                        <button class="quickview-btn" aria-label="Quick view"><i class="far fa-eye"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-rating">
                        ${generateStarRating(product.rating || 0)}
                        <span>(${product.reviewCount || 0})</span>
                    </div>
                    <div class="product-price">
                        ${product.salePrice ? 
                            `<span class="original-price">$${product.price.toFixed(2)}</span>
                             <span class="price">$${product.salePrice.toFixed(2)}</span>` : 
                            `<span class="price">$${product.price.toFixed(2)}</span>`
                        }
                    </div>
                    <a href="product-detail.html?id=${product.id}" class="view-product-btn">View Details</a>
                </div>
            </div>
        `;
    });
}

// Function to set up tabs
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Hide all tab panes
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Deactivate all tab buttons
            tabBtns.forEach(btn => btn.classList.remove('active'));
            
            // Show selected tab pane
            document.getElementById(tabId).classList.add('active');
            
            // Activate selected tab button
            btn.classList.add('active');
        });
    });
}

// Function to set up review modal
function setupReviewModal() {
    const modal = document.getElementById('review-modal');
    const openModalBtn = document.getElementById('write-review-btn');
    const closeBtn = document.querySelector('.close-modal');
    const starRating = document.querySelector('.star-rating');
    const ratingInput = document.getElementById('rating-value');
    const reviewForm = document.getElementById('review-form');
    
    // Open modal
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Star rating functionality
    if (starRating) {
        const stars = starRating.querySelectorAll('i');
        
        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.getAttribute('data-rating');
                highlightStars(stars, rating);
            });
            
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                ratingInput.value = rating;
                highlightStars(stars, rating, true);
            });
        });
        
        starRating.addEventListener('mouseout', () => {
            const selectedRating = ratingInput.value;
            highlightStars(stars, selectedRating, true);
        });
    }
    
    // Review form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('review-name').value;
            const rating = parseInt(ratingInput.value);
            const title = document.getElementById('review-title').value;
            const content = document.getElementById('review-content').value;
            
            if (!name || !rating || !title || !content) {
                alert('Please fill in all fields and select a rating.');
                return;
            }
            
            // In a real application, this would be sent to an API
            alert('Thank you for your review! It will be published after moderation.');
            modal.style.display = 'none';
            reviewForm.reset();
            
            // For demo purposes, add the review immediately
            const reviewsListEl = document.getElementById('reviews-list');
            const emptyMessage = reviewsListEl.querySelector('p');
            if (emptyMessage) {
                reviewsListEl.innerHTML = '';
            }
            
            reviewsListEl.innerHTML += `
                <div class="review-item">
                    <div class="review-header">
                        <div class="review-author">${name}</div>
                        <div class="review-date">${new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</div>
                    </div>
                    <div class="rating-stars">${generateStarRating(rating)}</div>
                    <div class="review-title">${title}</div>
                    <div class="review-content">${content}</div>
                </div>
            `;
            
            // Update review count
            const totalReviewsEl = document.getElementById('total-reviews');
            const currentCount = parseInt(totalReviewsEl.textContent);
            totalReviewsEl.textContent = currentCount + 1;
        });
    }
    
    // Helper function for star rating
    function highlightStars(stars, rating, permanent = false) {
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                if (!permanent) {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            }
        });
    }
}

// Function to set up quantity controls
function setupQuantityControls() {
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('quantity');
    
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        quantityInput.value = currentValue + 1;
    });
    
    quantityInput.addEventListener('change', () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        quantityInput.value = Math.max(1, currentValue);
    });
}

// Function to add product to cart (placeholder)
function addToCart(product) {
    // Get current cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => 
        item.id === product.id && 
        item.size === product.size &&
        item.color === product.color
    );
    
    if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        cartItems[existingItemIndex].quantity += product.quantity;
    } else {
        // Add new product to cart
        cartItems.push(product);
    }
    
    // Save cart items back to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart icon count
    updateCartCount();
}

// Function to add product to wishlist (placeholder)
function addToWishlist(productId) {
    // Get current wishlist items from localStorage
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    
    // Check if product already exists in wishlist
    if (!wishlistItems.includes(productId)) {
        // Add product to wishlist
        wishlistItems.push(productId);
        
        // Save wishlist items back to localStorage
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }
}

// Function to update cart count (placeholder)
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Update cart count display
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Function to show error
function showError(message) {
    const mainContainer = document.querySelector('.product-detail-container');
    mainContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <h2>Oops!</h2>
            <p>${message}</p>
            <a href="products.html" class="primary-btn">Back to Products</a>
        </div>
    `;
}

// Dummy product for demo (when API is not available)
function getDummyProduct(id) {
    return {
        id: id || '1',
        name: 'Premium Cotton T-Shirt',
        price: 29.99,
        salePrice: 24.99,
        sku: 'TS-' + (id || '001'),
        rating: 4.5,
        reviewCount: 12,
        shortDescription: 'A comfortable cotton t-shirt that offers both style and durability for everyday wear.',
        description: `
            <p>Experience unmatched comfort with our Premium Cotton T-Shirt. Crafted from 100% organic cotton, this t-shirt is perfect for daily wear, offering breathability and softness against your skin.</p>
            <p>Features:</p>
            <ul>
                <li>100% organic cotton material</li>
                <li>Reinforced stitching for durability</li>
                <li>Pre-shrunk fabric</li>
                <li>Classic fit design</li>
                <li>Ribbed crew neck that holds its shape</li>
            </ul>
            <p>This versatile t-shirt pairs perfectly with jeans, shorts, or can be layered under a jacket for a more refined look. Available in multiple colors and sizes to suit your style.</p>
            <p>Machine washable - cold wash, tumble dry low.</p>
        `,
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
            'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800',
            'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['#FFFFFF', '#000000', '#C0C0C0', '#87CEEB', '#F08080'],
        specifications: {
            'Material': '100% Organic Cotton',
            'Weight': '180 gsm',
            'Care Instructions': 'Machine wash cold, tumble dry low',
            'Country of Origin': 'Ethically made in Portugal',
            'Style': 'Classic fit',
            'Neckline': 'Crew neck'
        },
        reviews: [
            {
                author: 'John D.',
                date: '2023-12-10',
                rating: 5,
                title: 'Best T-shirt I\'ve ever owned',
                content: 'The quality of this t-shirt is outstanding. The fabric is soft yet durable, and after several washes, it still maintains its shape and color. Highly recommend!'
            },
            {
                author: 'Sarah M.',
                date: '2023-11-22',
                rating: 4,
                title: 'Great everyday shirt',
                content: 'I bought this in multiple colors because they\'re so comfortable for daily wear. The only reason for 4 stars instead of 5 is that they run slightly large.'
            },
            {
                author: 'Mike T.',
                date: '2023-11-05',
                rating: 5,
                title: 'Perfect fit',
                content: 'Finally found a t-shirt that fits perfectly. Not too tight, not too loose. The material is breathable and very comfortable.'
            }
        ],
        category: 'clothing'
    };
}

// Dummy related products for demo
function getDummyRelatedProducts() {
    return [
        {
            id: '2',
            name: 'Classic Denim Jeans',
            price: 59.99,
            rating: 4.7,
            reviewCount: 28,
            images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800']
        },
        {
            id: '3',
            name: 'Casual Oxford Shirt',
            price: 49.99,
            salePrice: 39.99,
            rating: 4.3,
            reviewCount: 15,
            images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800']
        },
        {
            id: '4',
            name: 'Slim Fit Chino Pants',
            price: 54.99,
            rating: 4.5,
            reviewCount: 19,
            images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800']
        },
        {
            id: '5',
            name: 'Knit Pullover Sweater',
            price: 64.99,
            salePrice: 49.99,
            rating: 4.8,
            reviewCount: 22,
            images: ['https://images.unsplash.com/photo-1599719500956-d195d8566021?w=800']
        }
    ];
}
