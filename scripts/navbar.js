// Navbar scroll behavior
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Handle authentication state
function updateAuthUI() {
    console.log('Updating auth UI...'); // Debug log
    const signInButton = document.querySelector('.sign-in-button');
    if (!signInButton) {
        console.warn('Sign-in button not found');
        return;
    }
    
    // Log current button state
    console.log('Current button text:', signInButton.textContent);
    
    // Force check for accessToken every time
    let hasToken = false;
    try {
        const token = localStorage.getItem('accessToken');
        console.log('Token exists:', !!token); // Debug log
        hasToken = !!token;
    } catch (error) {
        console.error('Error accessing localStorage:', error);
    }
    
    if (hasToken) {
        console.log('User is logged in, updating button to Logout'); // Debug log
        
        signInButton.textContent = 'Logout';
        signInButton.href = '#';
        
        // Remove any existing event listeners by cloning the button
        const newButton = signInButton.cloneNode(true);
        signInButton.parentNode.replaceChild(newButton, signInButton);
        
        // Add new event listener
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Logging out...'); // Debug log
            try {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('cartItems');
            } catch (error) {
                console.error('Error removing from localStorage:', error);
            }
            
            // Force reload the page to ensure all components update
            window.location.reload();
        });
    } else {
        console.log('User is not logged in, updating button to Sign In'); // Debug log
        
        signInButton.textContent = 'Sign In';
        const pathPrefix = window.location.pathname.includes('/pages/') ? '../pages/' : 'pages/';
        signInButton.href = pathPrefix + 'login.html';
    }
}

// Make sure the updateAuthUI function runs at the right time
function ensureAuthUIUpdated() {
    console.log('Ensuring auth UI is updated...'); // Debug log
    
    // Update immediately if possible
    const signInButton = document.querySelector('.sign-in-button');
    if (signInButton) {
        console.log('Sign-in button found immediately');
        updateAuthUI();
        return; // Exit if button found immediately
    }
    
    // Otherwise, keep checking with exponential backoff
    let attempts = 0;
    const maxAttempts = 30; // More attempts, up to 3 seconds
    
    const checkInterval = setInterval(() => {
        attempts++;
        console.log(`Checking for sign-in button (attempt ${attempts})`); // Debug log
        
        const signInButton = document.querySelector('.sign-in-button');
        if (signInButton) {
            console.log('Sign-in button found after interval');
            updateAuthUI();
            clearInterval(checkInterval);
        } else if (attempts >= maxAttempts) {
            console.error('Could not find sign-in button after multiple attempts');
            clearInterval(checkInterval);
        }
    }, 100);
}

// Run the auth update on various events to ensure it happens
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired'); // Debug log
    setTimeout(ensureAuthUIUpdated, 100);
    
    // Add active class to current nav item
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });
});

// Also run on window load
window.addEventListener('load', () => {
    console.log('Window load event fired'); // Debug log
    setTimeout(ensureAuthUIUpdated, 300);
});

// Run one more time after a delay to catch any late-loading components
setTimeout(ensureAuthUIUpdated, 1000);

// Expose functions for other scripts
window.updateAuthUI = updateAuthUI;
window.ensureAuthUIUpdated = ensureAuthUIUpdated;

// Immediately try to update UI when script loads
console.log('Navbar.js loaded'); // Debug log
setTimeout(ensureAuthUIUpdated, 0);