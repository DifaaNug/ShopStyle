// Sample product data
const products = [
    {
        id: 1,
        name: "Elegant Floral Dress",
        price: 750000,
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
        category: "Women's Fashion",
        subcategory: "Dresses",
        rating: 4.7,
        isNew: true,
        label: ["New", "Best Seller"],
        stock: "Ready",
        colors: ["Red", "Blue", "White"]
    },
    {
        id: 2,
        name: "Men's Classic Suit",
        price: 1500000,
        image: "https://images.unsplash.com/photo-1526178613658-3f1622045557?w=800",
        category: "Men's Fashion",
        subcategory: "Suits",
        rating: 4.5,
        isNew: false,
        label: ["Limited"],
        stock: "Ready",
        colors: ["Black", "Navy"]
    },
    {
        id: 3,
        name: "Designer Handbag",
        price: 1200000,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
        category: "Bags & Accessories",
        subcategory: "Handbags",
        rating: 4.8,
        isNew: false,
        label: ["Best Seller"],
        stock: "Ready",
        colors: ["Red", "Black"]
    },
    {
        id: 4,
        name: "Sporty Sneakers",
        price: 950000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        category: "Footwear",
        subcategory: "Sneakers",
        rating: 4.6,
        isNew: false,
        label: ["Sale"],
        stock: "Ready",
        colors: ["White", "Grey", "Blue"]
    },
    {
        id: 5,
        name: "Classic Sunglasses",
        price: 500000,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
        category: "Bags & Accessories",
        subcategory: "Sunglasses",
        rating: 4.4,
        isNew: true,
        label: ["New"],
        stock: "Ready",
        colors: ["Black", "Brown"]
    },
    {
        id: 6,
        name: "Elegant Scarf",
        price: 350000,
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
        category: "Bags & Accessories",
        subcategory: "Scarves",
        rating: 4.6,
        isNew: false,
        label: ["Best Seller"],
        stock: "Ready",
        colors: ["Blue", "Pink"]
    },
    {
        id: 7,
        name: "Women's Leather Jacket",
        price: 1100000,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
        category: "Women's Fashion",
        subcategory: "Outerwear",
        rating: 4.5,
        isNew: false,
        label: ["Best Seller"],
        stock: "Ready",
        colors: ["Black"]
    },
    {
        id: 8,
        name: "Men's Casual Shirt",
        price: 450000,
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
        category: "Men's Fashion",
        subcategory: "Shirts",
        rating: 4.3,
        isNew: true,
        label: ["New"],
        stock: "Ready",
        colors: ["White", "Blue"]
    },
    {
        id: 9,
        name: "Formal Leather Shoes",
        price: 2000000,
        image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800",
        category: "Footwear",
        subcategory: "Formal Shoes",
        rating: 4.5,
        isNew: false,
        label: ["Limited"],
        stock: "Ready",
        colors: ["Black", "Brown"]
    },
    {
        id: 10,
        name: "Luxury Watch",
        price: 2500000,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
        category: "Bags & Accessories",
        subcategory: "Watches",
        rating: 5.0,
        isNew: true,
        label: ["New", "Best Seller"],
        stock: "Ready",
        colors: ["Gold", "Silver"]
    },
    {
        id: 11,
        name: "Summer Midi Skirt",
        price: 420000,
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
        category: "Women's Fashion",
        subcategory: "Skirts",
        rating: 4.4,
        isNew: true,
        label: ["New"],
        stock: "Ready",
        colors: ["Yellow", "Pink"]
    },
    {
        id: 12,
        name: "Activewear Leggings",
        price: 310000,
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
        category: "Women's Fashion",
        subcategory: "Activewear",
        rating: 4.2,
        isNew: false,
        label: ["Sale"],
        stock: "Ready",
        colors: ["Black", "Grey"]
    },
    {
        id: 13,
        name: "Men's Chinos Pants",
        price: 390000,
        image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800",
        category: "Men's Fashion",
        subcategory: "Pants",
        rating: 4.3,
        isNew: false,
        label: ["Best Seller"],
        stock: "Ready",
        colors: ["Beige", "Navy"]
    },
    {
        id: 14,
        name: "Men's Sportswear Jacket",
        price: 650000,
        image: "https://images.unsplash.com/photo-1526178613658-3f1622045557?w=800",
        category: "Men's Fashion",
        subcategory: "Sportswear",
        rating: 4.6,
        isNew: true,
        label: ["New"],
        stock: "Ready",
        colors: ["Blue", "Black"]
    },
    {
        id: 15,
        name: "Classic Backpack",
        price: 480000,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
        category: "Bags & Accessories",
        subcategory: "Backpacks",
        rating: 4.5,
        isNew: false,
        label: ["Best Seller"],
        stock: "Ready",
        colors: ["Black", "Brown"]
    },
    {
        id: 16,
        name: "Elegant Wallet",
        price: 220000,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
        category: "Bags & Accessories",
        subcategory: "Wallets",
        rating: 4.4,
        isNew: false,
        label: ["Sale"],
        stock: "Ready",
        colors: ["Brown", "Navy"]
    },
    {
        id: 17,
        name: "Formal Loafers",
        price: 870000,
        image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800",
        category: "Footwear",
        subcategory: "Loafers",
        rating: 4.5,
        isNew: false,
        label: ["Limited"],
        stock: "Ready",
        colors: ["Black", "Tan"]
    },
    {
        id: 18,
        name: "Women's Heels",
        price: 690000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        category: "Footwear",
        subcategory: "Heels",
        rating: 4.3,
        isNew: true,
        label: ["New"],
        stock: "Ready",
        colors: ["Red", "Beige"]
    },
    {
        id: 19,
        name: "Men's Boots",
        price: 990000,
        image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800",
        category: "Footwear",
        subcategory: "Boots",
        rating: 4.6,
        isNew: false,
        label: ["Best Seller"],
        stock: "Ready",
        colors: ["Brown", "Black"]
    },
    {
        id: 20,
        name: "Jewelry Set",
        price: 1200000,
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
        category: "Bags & Accessories",
        subcategory: "Jewelry",
        rating: 4.8,
        isNew: true,
        label: ["New", "Limited"],
        stock: "Ready",
        colors: ["Gold", "Silver"]
    }
];

// Function to create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    let labelBadges = '';
    if (product.label && product.label.length > 0) {
        labelBadges = product.label.map(l => `<span class="badge label">${l}</span>`).join(' ');
    }
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.isNew ? '<span class="badge new">New</span>' : ''}
            ${labelBadges}
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <div class="product-rating">
                ${createRatingStars(product.rating)}
            </div>
            <div class="product-price">Rp${product.price.toLocaleString('id-ID')}</div>
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

// ===== FILTER UI & LOGIC =====

// Ambil kategori dan subkategori unik dari data produk
function getCategoriesAndSubcategories() {
    const categories = {};
    products.forEach(p => {
        if (!categories[p.category]) {
            categories[p.category] = new Set();
        }
        if (p.subcategory) {
            categories[p.category].add(p.subcategory);
        }
    });
    // Convert Set to Array
    Object.keys(categories).forEach(cat => {
        categories[cat] = Array.from(categories[cat]);
    });
    return categories;
}

// Render filter dropdown
function renderFilterUI() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'product-filter';
    filterContainer.style.display = 'flex';
    filterContainer.style.gap = '1rem';
    filterContainer.style.justifyContent = 'center';
    filterContainer.style.margin = '2rem 0 2rem 0';
    
    const categories = getCategoriesAndSubcategories();
    
    // Kategori dropdown
    const categorySelect = document.createElement('select');
    categorySelect.className = 'filter-category';
    categorySelect.innerHTML = '<option value="">All Categories</option>' +
        Object.keys(categories).map(cat => `<option value="${cat}">${cat}</option>`).join('');
    
    // Subkategori dropdown
    const subcategorySelect = document.createElement('select');
    subcategorySelect.className = 'filter-subcategory';
    subcategorySelect.innerHTML = '<option value="">All Subcategories</option>';
    subcategorySelect.disabled = true;

    // Event: Saat kategori dipilih, update subkategori
    categorySelect.addEventListener('change', () => {
        const selectedCat = categorySelect.value;
        subcategorySelect.innerHTML = '<option value="">All Subcategories</option>';
        if (selectedCat && categories[selectedCat]) {
            categories[selectedCat].forEach(subcat => {
                subcategorySelect.innerHTML += `<option value="${subcat}">${subcat}</option>`;
            });
            subcategorySelect.disabled = false;
        } else {
            subcategorySelect.disabled = true;
        }
        renderFilteredProducts();
    });

    // Event: Saat subkategori dipilih
    subcategorySelect.addEventListener('change', renderFilteredProducts);

    filterContainer.appendChild(categorySelect);
    filterContainer.appendChild(subcategorySelect);

    // Sisipkan filter di atas grid produk
    const productSection = document.querySelector('.product-section') || document.body;
    productSection.insertBefore(filterContainer, productSection.firstChild);
}

// Render produk sesuai filter
function renderFilteredProducts() {
    const category = document.querySelector('.filter-category')?.value || '';
    const subcategory = document.querySelector('.filter-subcategory')?.value || '';
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    productGrid.innerHTML = '';
    let filtered = products;
    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }
    if (subcategory) {
        filtered = filtered.filter(p => p.subcategory === subcategory);
    }
    if (filtered.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.textContent = 'Produk tidak ditemukan.';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '2rem';
        productGrid.appendChild(emptyMsg);
        return;
    }
    filtered.forEach(product => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
    });
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Saat halaman dibuka, cek query string untuk filter otomatis
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderFilterUI();
    // Cek query string
    const catParam = getQueryParam('category');
    if (catParam) {
        const catSelect = document.querySelector('.filter-category');
        if (catSelect) {
            catSelect.value = catParam;
            catSelect.dispatchEvent(new Event('change'));
        }
    }
    renderFilteredProducts();
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