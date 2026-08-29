// Global helper functions

// API call wrapper
async function apiCall(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, mergedOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format price
function formatPrice(amount, currency = 'BDT') {
    return `${currency} ${amount.toLocaleString()}`;
}

// Show notification
function showNotification(message, type = 'info') {
    // Simple notification - can be enhanced with a library
    alert(message);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Update navbar based on auth state
function updateNavbar() {
    const isLoggedIn = checkAuth();
    const user = getCurrentUser();
    const navActions = document.querySelector('.nav-actions');
    
    if (!navActions) return;
    
    if (isLoggedIn && user) {
        // Show logged-in state
        navActions.innerHTML = `
            <span class="user-name">${user.name || user.email}</span>
            <div class="user-menu">
                <a href="/dashboard" class="btn btn-outline">Dashboard</a>
                <a href="/add-property" class="btn btn-outline">Add Property</a>
                <button class="btn btn-primary" onclick="logout()">Logout</button>
            </div>
        `;
    } else {
        // Show logged-out state
        navActions.innerHTML = `
            <a href="/login" class="btn btn-outline">Login</a>
            <a href="/register" class="btn btn-primary">Sign Up</a>
        `;
    }
}

// Initialize navbar on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
});

console.log('StudentStay Platform Loaded Successfully!');