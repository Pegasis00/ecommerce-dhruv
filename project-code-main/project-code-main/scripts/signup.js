// Get users from localStorage or initialize empty array
let users = JSON.parse(localStorage.getItem('users')) || [];

// Get the signup form elements
const signupForm = document.querySelector('.login');
const usernameInput = document.querySelector('input[type="text"]');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const confirmPasswordInput = document.querySelector('input[type="password"]:last-of-type');

// Add error message display
const errorMessage = document.createElement('div');
errorMessage.style.color = 'red';
errorMessage.style.marginTop = '10px';
errorMessage.style.display = 'none';
signupForm.insertBefore(errorMessage, signupForm.querySelector('.group'));

// Handle form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
        errorMessage.textContent = 'Please fill in all fields';
        errorMessage.style.display = 'block';
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMessage.textContent = 'Please enter a valid email address';
        errorMessage.style.display = 'block';
        return;
    }

    // Password validation
    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters long';
        errorMessage.style.display = 'block';
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.style.display = 'block';
        return;
    }

    // Check if username already exists
    if (users.some(u => u.username === username)) {
        errorMessage.textContent = 'Username already exists. Please choose another one.';
        errorMessage.style.display = 'block';
        return;
    }

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        errorMessage.textContent = 'Email already registered. Please use another email.';
        errorMessage.style.display = 'block';
        return;
    }

    // Add new user
    users.push({ 
        username, 
        email, 
        password,
        createdAt: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Show success message
    errorMessage.style.color = 'green';
    errorMessage.textContent = 'Account created successfully! Redirecting to login...';
    errorMessage.style.display = 'block';

    // Redirect to login page after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
});

// Clear error message when user starts typing
usernameInput.addEventListener('input', () => {
    errorMessage.style.display = 'none';
});

emailInput.addEventListener('input', () => {
    errorMessage.style.display = 'none';
});

passwordInput.addEventListener('input', () => {
    errorMessage.style.display = 'none';
});

confirmPasswordInput.addEventListener('input', () => {
    errorMessage.style.display = 'none';
}); 