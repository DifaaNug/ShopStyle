// Theme toggle functionality
function initThemeToggle() {
    // Get the theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) {
        console.log('Theme toggle button not found, waiting...');
        return;
    }

    // Get the icon element
    const icon = themeToggle.querySelector('i');
    if (!icon) {
        console.log('Theme icon not found');
        return;
    }

    // Get saved theme or use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    // Apply the current theme
    applyTheme(currentTheme);

    // Add click event listener
    themeToggle.addEventListener('click', () => {
        // Toggle theme
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}

// Function to apply theme
function applyTheme(theme) {
    // Update DOM
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save preference
    localStorage.setItem('theme', theme);
    
    // Update icon
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Try to initialize immediately
initThemeToggle();

// Also try after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    
    // Additional attempt after a short delay to ensure navbar is loaded
    setTimeout(initThemeToggle, 100);
}); 