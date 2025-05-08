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
    const signInButton = document.querySelector('.sign-in-button');
    if (signInButton) {
        if (localStorage.getItem('accessToken')) {
            signInButton.textContent = 'Logout';
            signInButton.href = '#';
            signInButton.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('accessToken');
                window.location.reload();
            });
        } else {
            signInButton.textContent = 'Sign In';
            signInButton.href = window.location.pathname.includes('/pages/') ? '../pages/login.html' : 'pages/login.html';
        }
    }
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add active class to current nav item
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });
    
    // Update auth UI based on login state
    updateAuthUI();
});

// Also run immediately in case DOM is already loaded
updateAuthUI();