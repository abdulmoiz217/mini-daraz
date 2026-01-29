document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Get the token from localStorage (assuming it's stored after login)
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found. Please log in.');
        }

        // Fetch user profile from the API
        const response = await fetch('/api/auth/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();

        // Display user information
        document.getElementById('username').textContent = userData.name || userData.email || 'Unknown User';

        // You can add more user information here if needed
        const userInfoDiv = document.querySelector('.user-info');

        // Clear existing content and add more details
        userInfoDiv.innerHTML = `
            <p><strong>Name:</strong> <span id="user-name">${userData.name || 'Not provided'}</span></p>
            <p><strong>Email:</strong> <span id="user-email">${userData.email || 'Not provided'}</span></p>
            <p><strong>Phone:</strong> <span id="user-phone">${userData.phone || 'Not provided'}</span></p>
            <p><strong>Role:</strong> <span id="user-role">${userData.role || 'customer'}</span></p>
        `;

    } catch (error) {
        console.error('Error loading profile:', error);
        document.getElementById('username').textContent = 'Error loading profile';

        // Show error message to user
        const userInfoDiv = document.querySelector('.user-info');
        userInfoDiv.innerHTML = `<p style="color: red;">Network error. Please refresh the page. (${error.message})</p>`;
    }
});