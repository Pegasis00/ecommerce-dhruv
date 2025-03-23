// Get users from localStorage or initialize empty array
let users = JSON.parse(localStorage.getItem('users')) || [];

// Get the login form elements
const loginForm = document.querySelector('.login');
const usernameInput = document.querySelector('input[type="text"]');
const passwordInput = document.querySelector('input[type="password"]');
const submitButton = document.querySelector('input[type="submit"]');

// Add error message display
const errorMessage = document.createElement('div');
errorMessage.style.color = 'red';
errorMessage.style.marginTop = '10px';
errorMessage.style.display = 'none';
loginForm.insertBefore(errorMessage, loginForm.querySelector('.group'));

// Handle form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic validation
    if (!username || !password) {
        errorMessage.textContent = 'Please enter both username and password';
        errorMessage.style.display = 'block';
        return;
    }

    // Check if user exists and password matches
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Store current user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            isLoggedIn: true
        }));

        // Redirect to buyit.html
        window.location.href = 'buyit.html';
    } else {
        errorMessage.textContent = 'Invalid username or password. Please try again or sign up.';
        errorMessage.style.display = 'block';
        // Clear password field
        passwordInput.value = '';
    }
});

// Handle signup
const signupLink = document.querySelector('a[href="#"]:last-child');
signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    const username = prompt('Enter your desired username:');
    if (!username) return;

    // Check if username already exists
    if (users.some(u => u.username === username)) {
        alert('Username already exists. Please choose another one.');
        return;
    }

    const password = prompt('Enter your password:');
    if (!password) return;

    // Add new user
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Account created successfully! Please login.');
    usernameInput.value = username;
    passwordInput.value = '';
});

// Clear error message when user starts typing
usernameInput.addEventListener('input', () => {
    errorMessage.style.display = 'none';
});

passwordInput.addEventListener('input', () => {
    errorMessage.style.display = 'none';
}); 