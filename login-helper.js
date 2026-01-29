// Helper function to save token to localStorage after login
function saveAuthToken(token) {
    localStorage.setItem('token', token);
    console.log('Authentication token saved to localStorage');
}

// Helper function to remove token (for logout)
function removeAuthToken() {
    localStorage.removeItem('token');
    console.log('Authentication token removed from localStorage');
}

// Helper function to check if user is logged in
function isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists, false otherwise
}

// Example of how to use after a successful login API call:
/*
fetch('/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'password'
    })
})
.then(response => response.json())
.then(data => {
    if (data.token) {
        saveAuthToken(data.token); // Save the token
        window.location.href = 'profile.html'; // Redirect to profile
    }
})
.catch(error => console.error('Login error:', error));
*/