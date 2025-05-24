// Account Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();
    
    // Setup navigation
    setupAccountNavigation();
    
    // Load content for sections
    loadDashboardContent();
    loadOrdersContent();
    loadAddressesContent();
    loadProfileContent();
    loadWishlistContent();
    
    // Setup address modal
    setupAddressModal();
    
    // Setup form submissions
    setupFormSubmissions();
    
    // Update cart count
    updateCartCount();
});

// Function to load user data
function loadUserData() {
    // Check if user is logged in by checking for token in localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
        // Redirect to login page if no token found
        window.location.href = '../pages/login.html';
        return;
    }
    
    // Get user data from localStorage or fetch from server
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');
    
    // If we have user data in localStorage
    if (storedUserName) {
        // Extract first name and last name
        const nameParts = storedUserName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        const userData = {
            firstName: firstName,
            lastName: lastName,
            displayName: storedUserName,
            email: storedUserEmail || 'user@example.com',
            avatar: '../assets/user-placeholder.jpg'
        };
        
        // Update UI with user data
        document.getElementById('user-name').textContent = userData.displayName;
        document.getElementById('user-email').textContent = userData.email;
        document.getElementById('dashboard-name').textContent = userData.firstName;
        document.getElementById('dashboard-name2').textContent = userData.firstName;
        
        // Update avatar
        const avatarImg = document.getElementById('user-avatar');
        if (avatarImg && userData.avatar) {
            avatarImg.src = userData.avatar;
        }
        
        // Update profile form
        document.getElementById('first-name').value = userData.firstName;
        document.getElementById('last-name').value = userData.lastName;
        document.getElementById('display-name').value = userData.displayName;
        document.getElementById('email').value = userData.email;
    } else {
        // Try to fetch user data from API with token
        fetchUserData(token);
    }
    
    // Update profile form
    document.getElementById('first-name').value = userData.firstName;
    document.getElementById('last-name').value = userData.lastName;
    document.getElementById('display-name').value = userData.displayName;
    document.getElementById('email').value = userData.email;
}

// Function to fetch user data from API
async function fetchUserData(token) {
    try {
        const response = await fetch('/api/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            // If unauthorized, redirect to login
            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                window.location.href = '../pages/login.html';
                return;
            }
            throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        
        // Store user data in localStorage for future use
        localStorage.setItem('userName', userData.name || 'User');
        localStorage.setItem('userEmail', userData.email);
        
        // Extract first name for display
        const firstName = userData.name ? userData.name.split(' ')[0] : 'User';
        
        // Update UI with user data
        document.getElementById('user-name').textContent = userData.name || 'User';
        document.getElementById('user-email').textContent = userData.email;
        document.getElementById('dashboard-name').textContent = firstName;
        document.getElementById('dashboard-name2').textContent = firstName;
        
        // Update profile form
        if (userData.name) {
            const nameParts = userData.name.split(' ');
            document.getElementById('first-name').value = nameParts[0];
            document.getElementById('last-name').value = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
            document.getElementById('display-name').value = userData.name;
        }
        document.getElementById('email').value = userData.email;
        
    } catch (error) {
        console.error('Error fetching user data:', error);
        showNotification('Failed to load user data', 'error');
    }
}

// Function to set up account navigation
function setupAccountNavigation() {
    const navItems = document.querySelectorAll('.account-nav li');
    const sections = document.querySelectorAll('.account-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('data-section');
            
            if (sectionId === 'logout') {
                logoutUser();
                return;
            }
            
            // Update active navigation item
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(sectionId + '-section').classList.add('active');
            
            // Update URL hash
            window.location.hash = sectionId;
        });
    });
    
    // Check for hash in URL
    const hash = window.location.hash.substring(1);
    if (hash && document.querySelector(`[data-section="${hash}"]`)) {
        document.querySelector(`[data-section="${hash}"]`).click();
    }
}

// Function to load dashboard content
function loadDashboardContent() {
    // Load counts
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    document.getElementById('wishlist-count').textContent = wishlist.length;
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    document.getElementById('order-count').textContent = orders.length.toString();
    
    // For addresses, we'll keep the placeholder value for now
    document.getElementById('address-count').textContent = '2';
    
    // Display the most recent 3 orders
    const recentOrders = [...orders].sort((a, b) => {
        const dateA = new Date(a.orderDate || a.date);
        const dateB = new Date(b.orderDate || b.date);
        return dateB - dateA;
    }).slice(0, 3);
    
    const recentOrdersTable = document.getElementById('recent-orders-table');
    
    if (recentOrders.length > 0) {
        recentOrdersTable.innerHTML = '';
        
        recentOrders.forEach(order => {
            recentOrdersTable.innerHTML += `
                <tr>
                    <td class="order-number">${order.orderId || order.id}</td>
                    <td>${formatDate(order.orderDate || order.date)}</td>
                    <td><span class="order-status status-${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
                    <td>$${parseFloat(order.total).toFixed(2)}</td>
                    <td class="order-actions">
                        <button class="action-btn view-order" data-order="${order.orderId || order.id}">View</button>
                    </td>
                </tr>
            `;
        });
        
        // Set up view order buttons
        setupOrderViewButtons();
    } else {
        recentOrdersTable.innerHTML = '<tr><td colspan="5">No orders yet</td></tr>';
    }
}

// Function to load orders content
function loadOrdersContent() {
    // Get orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Create some sample orders if none exist
    let orders = savedOrders.length > 0 ? savedOrders : [
        {
            orderId: 'ORD-12345',
            orderDate: '2025-05-18',
            status: 'processing',
            total: 125.99,
            items: [
                { name: 'Blue Denim Jacket', quantity: 1, price: 89.99 },
                { name: 'Classic White T-Shirt', quantity: 2, price: 18.00 }
            ]
        },
        {
            orderId: 'ORD-12344',
            orderDate: '2025-05-10',
            status: 'shipped',
            total: 89.50,
            items: [
                { name: 'Black Sneakers', quantity: 1, price: 89.50 }
            ]
        },
        {
            orderId: 'ORD-12343',
            orderDate: '2025-05-01',
            status: 'delivered',
            total: 210.75,
            items: [
                { name: 'Designer Sunglasses', quantity: 1, price: 150.00 },
                { name: 'Leather Wallet', quantity: 1, price: 60.75 }
            ]
        }
    ];
    
    // If we created sample orders, save them to localStorage
    if (savedOrders.length === 0) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    // Update order count in dashboard
    document.getElementById('order-count').textContent = orders.length;
    
    const ordersTable = document.getElementById('orders-table');
    
    if (orders.length > 0) {
        ordersTable.innerHTML = '';
        
        orders.forEach(order => {
            ordersTable.innerHTML += `
                <tr>
                    <td class="order-number">${order.orderId || order.id}</td>
                    <td>${formatDate(order.orderDate || order.date)}</td>
                    <td><span class="order-status status-${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
                    <td>$${parseFloat(order.total).toFixed(2)}</td>
                    <td class="order-actions">
                        <button class="action-btn view-order" data-order="${order.orderId || order.id}">View</button>
                    </td>
                </tr>
            `;
        });
        
        // Set up view order buttons
        setupOrderViewButtons();
    } else {
        ordersTable.innerHTML = '<tr><td colspan="5">No orders found</td></tr>';
    }
    
    // Set up order filter
    document.getElementById('apply-order-filter').addEventListener('click', function() {
        const status = document.getElementById('order-status').value;
        const datePeriod = document.getElementById('order-date').value;
        
        // In a real application, this would filter orders based on status and date
        showNotification('Orders filtered', 'info');
    });
}

// Function to load addresses content
function loadAddressesContent() {
    // In a real application, these would be fetched from the server
    const addresses = [
        {
            id: 1,
            name: 'Home',
            firstName: 'John',
            lastName: 'Doe',
            company: '',
            address: '123 Main St',
            apartment: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'US',
            phone: '(555) 123-4567',
            isDefault: true
        },
        {
            id: 2,
            name: 'Office',
            firstName: 'John',
            lastName: 'Doe',
            company: 'ACME Corp',
            address: '456 Business Ave',
            apartment: 'Suite 200',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            country: 'US',
            phone: '(555) 987-6543',
            isDefault: false
        }
    ];
    
    const addressesContainer = document.getElementById('addresses-container');
    const addAddressCard = addressesContainer.querySelector('.add-address');
    
    // Clear existing addresses (except add address card)
    Array.from(addressesContainer.children).forEach(child => {
        if (!child.classList.contains('add-address')) {
            child.remove();
        }
    });
    
    // Add address cards
    addresses.forEach(address => {
        const addressCard = createAddressCard(address);
        addressesContainer.insertBefore(addressCard, addAddressCard);
    });
    
    // Set up add address button
    addAddressCard.addEventListener('click', function() {
        openAddressModal();
    });
}

// Function to create address card
function createAddressCard(address) {
    const card = document.createElement('div');
    card.className = 'address-card';
    if (address.isDefault) {
        card.classList.add('default');
    }
    
    card.innerHTML = `
        <h3>${address.name}</h3>
        <p>${address.firstName} ${address.lastName}</p>
        ${address.company ? `<p>${address.company}</p>` : ''}
        <p>${address.address}</p>
        ${address.apartment ? `<p>${address.apartment}</p>` : ''}
        <p>${address.city}, ${address.state} ${address.zipCode}</p>
        <p>${getCountryName(address.country)}</p>
        <p>${address.phone}</p>
        
        <div class="address-actions">
            <button class="btn-edit" data-id="${address.id}">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn-delete" data-id="${address.id}">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    // Set up edit and delete buttons
    card.querySelector('.btn-edit').addEventListener('click', function() {
        editAddress(address.id);
    });
    
    card.querySelector('.btn-delete').addEventListener('click', function() {
        deleteAddress(address.id);
    });
    
    return card;
}

// Function to get country name
function getCountryName(countryCode) {
    const countries = {
        'US': 'United States',
        'CA': 'Canada',
        'UK': 'United Kingdom',
        'AU': 'Australia'
    };
    
    return countries[countryCode] || countryCode;
}

// Function to load profile content
function loadProfileContent() {
    // Already loaded in loadUserData
}

// Function to load wishlist content
async function loadWishlistContent() {
    const wishlistIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const wishlistContainer = document.getElementById('account-wishlist-items');
    
    if (!wishlistContainer) {
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
        // In a real application, this would fetch product details from the server
        // For now, we'll use mock data
        const wishlistProducts = await Promise.all(wishlistIds.map(id => {
            return fetch(`/api/products/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load product ${id}`);
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error(`Error loading product ${id}:`, error);
                    return null;
                });
        }));
        
        // Filter out null products
        const validProducts = wishlistProducts.filter(product => product !== null);
        
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
        
        // Create wishlist items
        validProducts.forEach(product => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            wishlistItem.dataset.productId = product.id;
            
            // Check if product is on sale
            const isOnSale = product.salePrice && product.salePrice < product.price;
            
            wishlistItem.innerHTML = `
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
                            `<span class="original-price">$${product.price.toFixed(2)}</span>
                             <span class="sale-price">$${product.salePrice.toFixed(2)}</span>` : 
                            `<span class="regular-price">$${product.price.toFixed(2)}</span>`
                        }
                    </div>
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
            
            wishlistContainer.appendChild(wishlistItem);
        });
        
        // Setup wishlist actions
        setupWishlistActions();
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

// Function to setup wishlist actions
function setupWishlistActions() {
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
    const clearWishlistBtn = document.getElementById('clear-wishlist');
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', clearWishlist);
    }
}

// Function to remove from wishlist
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
            item.style.opacity = '0';
            item.style.height = '0';
            item.style.margin = '0';
            item.style.padding = '0';
            item.style.overflow = 'hidden';
            
            setTimeout(() => {
                item.remove();
                
                // Update wishlist count
                document.getElementById('wishlist-count').textContent = wishlist.length;
                
                // Check if wishlist is now empty
                if (wishlist.length === 0) {
                    document.getElementById('account-wishlist-items').innerHTML = `
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

// Function to clear wishlist
function clearWishlist() {
    // Confirm before clearing
    if (!confirm('Are you sure you want to clear your entire wishlist?')) {
        return;
    }
    
    // Clear wishlist in localStorage
    localStorage.setItem('wishlist', '[]');
    
    // Update wishlist count
    document.getElementById('wishlist-count').textContent = '0';
    
    // Show empty wishlist message
    document.getElementById('account-wishlist-items').innerHTML = `
        <div class="empty-wishlist">
            <i class="far fa-heart"></i>
            <p>Your wishlist is empty</p>
            <a href="products.html" class="primary-btn">Continue Shopping</a>
        </div>
    `;
    
    // Show notification
    showNotification('Wishlist cleared', 'info');
}

// Function to setup order view buttons
function setupOrderViewButtons() {
    const viewButtons = document.querySelectorAll('.view-order');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.dataset.order;
            viewOrder(orderId);
        });
    });
}

// Function to view order
function viewOrder(orderId) {
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Find the specific order
    const order = orders.find(o => (o.orderId || o.id) === orderId);
    
    if (!order) {
        showNotification(`Order not found: ${orderId}`, 'error');
        return;
    }
    
    // Create modal for order details
    const orderModal = document.createElement('div');
    orderModal.className = 'modal order-detail-modal';
    orderModal.style.display = 'block';
    
    // Calculate items total
    const itemsTotal = order.items ? order.items.reduce((sum, item) => 
        sum + (item.price * (item.quantity || 1)), 0) : order.total;
    
    // Prepare items HTML
    const itemsHtml = order.items ? order.items.map(item => `
        <div class="order-detail-item">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-quantity">x ${item.quantity || 1}</span>
            </div>
            <span class="item-price">$${(item.price * (item.quantity || 1)).toFixed(2)}</span>
        </div>
    `).join('') : '<p>No item details available</p>';
    
    // Create modal content
    orderModal.innerHTML = `
        <div class="modal-content order-detail-content">
            <span class="close-modal">&times;</span>
            <div class="order-detail-header">
                <h2>Order Details</h2>
                <span class="order-id">${order.orderId || order.id}</span>
                <span class="order-date">${formatDate(order.orderDate || order.date)}</span>
                <div class="order-status-badge status-${order.status}">${capitalizeFirstLetter(order.status)}</div>
            </div>
            
            <div class="order-detail-body">
                <div class="order-items">
                    <h3>Items</h3>
                    <div class="order-items-list">
                        ${itemsHtml}
                    </div>
                </div>
                
                <div class="order-summary">
                    <h3>Summary</h3>
                    <div class="order-summary-row">
                        <span>Subtotal</span>
                        <span>$${itemsTotal.toFixed(2)}</span>
                    </div>
                    <div class="order-summary-row">
                        <span>Shipping</span>
                        <span>$${(order.shipping || 10).toFixed(2)}</span>
                    </div>
                    <div class="order-summary-row">
                        <span>Tax</span>
                        <span>$${(order.tax || (itemsTotal * 0.1)).toFixed(2)}</span>
                    </div>
                    <div class="order-summary-row total">
                        <span>Total</span>
                        <span>$${parseFloat(order.total).toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="order-actions-panel">
                    <button class="primary-btn">Track Order</button>
                    <button class="secondary-btn">Download Invoice</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(orderModal);
    
    // Add close functionality
    const closeBtn = orderModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        orderModal.style.display = 'none';
        // Remove modal after fade out
        setTimeout(() => {
            document.body.removeChild(orderModal);
        }, 300);
    });
    
    // Close on outside click
    window.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            orderModal.style.display = 'none';
            // Remove modal after fade out
            setTimeout(() => {
                document.body.removeChild(orderModal);
            }, 300);
        }
    });
    
    // Add some simple animation
    setTimeout(() => {
        orderModal.querySelector('.modal-content').style.opacity = '1';
        orderModal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
}

// Function to setup address modal
function setupAddressModal() {
    const modal = document.getElementById('address-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = document.getElementById('address-form');
    
    // Close modal on close button click
    closeBtn.addEventListener('click', closeAddressModal);
    
    // Close modal on cancel button click
    cancelBtn.addEventListener('click', closeAddressModal);
    
    // Close modal on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAddressModal();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const addressId = document.getElementById('address-id').value;
        
        if (addressId) {
            // Update existing address
            updateAddress(form);
        } else {
            // Create new address
            createAddress(form);
        }
        
        closeAddressModal();
    });
}

// Function to open address modal
function openAddressModal(addressData = null) {
    const modal = document.getElementById('address-modal');
    const form = document.getElementById('address-form');
    const title = document.getElementById('address-modal-title');
    
    // Reset form
    form.reset();
    
    if (addressData) {
        // Edit existing address
        title.textContent = 'Edit Address';
        
        // Fill form with address data
        document.getElementById('address-id').value = addressData.id;
        document.getElementById('address-name').value = addressData.name;
        document.getElementById('first-name-address').value = addressData.firstName;
        document.getElementById('last-name-address').value = addressData.lastName;
        document.getElementById('company').value = addressData.company || '';
        document.getElementById('street-address').value = addressData.address;
        document.getElementById('apartment').value = addressData.apartment || '';
        document.getElementById('city').value = addressData.city;
        document.getElementById('state').value = addressData.state;
        document.getElementById('zip-code').value = addressData.zipCode;
        document.getElementById('country').value = addressData.country;
        document.getElementById('phone').value = addressData.phone;
        document.getElementById('default-address').checked = addressData.isDefault;
    } else {
        // New address
        title.textContent = 'Add New Address';
        document.getElementById('address-id').value = '';
    }
    
    // Display modal
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}

// Function to close address modal
function closeAddressModal() {
    const modal = document.getElementById('address-modal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Function to create address
function createAddress(form) {
    // In a real application, this would send data to the server
    // For now, we'll just show a notification
    showNotification('Address created successfully', 'success');
    
    // Reload addresses
    loadAddressesContent();
    
    // Update address count
    const currentCount = parseInt(document.getElementById('address-count').textContent);
    document.getElementById('address-count').textContent = (currentCount + 1).toString();
}

// Function to update address
function updateAddress(form) {
    // In a real application, this would send data to the server
    // For now, we'll just show a notification
    showNotification('Address updated successfully', 'success');
    
    // Reload addresses
    loadAddressesContent();
}

// Function to edit address
function editAddress(addressId) {
    // In a real application, this would fetch the address data from the server
    // For now, we'll use mock data
    const addressData = {
        id: addressId,
        name: addressId === 1 ? 'Home' : 'Office',
        firstName: 'John',
        lastName: 'Doe',
        company: addressId === 2 ? 'ACME Corp' : '',
        address: addressId === 1 ? '123 Main St' : '456 Business Ave',
        apartment: addressId === 1 ? 'Apt 4B' : 'Suite 200',
        city: 'New York',
        state: 'NY',
        zipCode: addressId === 1 ? '10001' : '10002',
        country: 'US',
        phone: addressId === 1 ? '(555) 123-4567' : '(555) 987-6543',
        isDefault: addressId === 1
    };
    
    openAddressModal(addressData);
}

// Function to delete address
function deleteAddress(addressId) {
    // Confirm before deleting
    if (!confirm('Are you sure you want to delete this address?')) {
        return;
    }
    
    // In a real application, this would send a request to the server
    // For now, we'll just show a notification
    showNotification('Address deleted successfully', 'success');
    
    // Remove address from DOM
    const addressCard = document.querySelector(`.address-card .btn-delete[data-id="${addressId}"]`).closest('.address-card');
    addressCard.remove();
    
    // Update address count
    const currentCount = parseInt(document.getElementById('address-count').textContent);
    document.getElementById('address-count').textContent = (currentCount - 1).toString();
}

// Function to setup form submissions
function setupFormSubmissions() {
    // Account form
    const accountForm = document.getElementById('account-form');
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate password match if provided
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (newPassword && newPassword !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            // In a real application, this would send data to the server
            // For now, we'll just show a notification
            showNotification('Account details updated successfully', 'success');
            
            // Update user data
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const displayName = document.getElementById('display-name').value || `${firstName} ${lastName}`;
            const email = document.getElementById('email').value;
            
            document.getElementById('user-name').textContent = displayName;
            document.getElementById('user-email').textContent = email;
            document.getElementById('dashboard-name').textContent = firstName;
            document.getElementById('dashboard-name2').textContent = firstName;
        });
    }
}

// Function to logout user
function logoutUser() {
    // In a real application, this would send a request to the server
    // and/or clear session cookies
    
    // For this demo, we'll just show a notification and redirect
    showNotification('Logging out...', 'info');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
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

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
