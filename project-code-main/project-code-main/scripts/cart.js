// Cart functionality
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    // Add item to cart
    addItem(product) {
        if (!this.currentUser || !this.currentUser.isLoggedIn) {
            alert('Please login to add items to cart');
            window.location.href = 'login.html';
            return;
        }

        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.priceCents / 100, // Convert cents to dollars
                image: product.image,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartQuantity();
        this.showAddToCartMessage();
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartQuantity();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartQuantity();
            }
        }
    }

    // Get total items in cart
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Get total price
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Update cart quantity in header
    updateCartQuantity() {
        const cartQuantityElements = document.querySelectorAll('.cart-quantity');
        const totalItems = this.getTotalItems();
        
        cartQuantityElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    // Show success message when adding to cart
    showAddToCartMessage() {
        const message = document.createElement('div');
        message.className = 'add-to-cart-message';
        message.textContent = 'Added to cart!';
        document.body.appendChild(message);

        // Remove message after 2 seconds
        setTimeout(() => {
            message.remove();
        }, 2000);
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartQuantity();
    }
}

// Create global cart instance
const cart = new Cart();

// Add CSS for the success message
const style = document.createElement('style');
style.textContent = `
    .add-to-cart-message {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize cart quantity on page load
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartQuantity();
});

// Export the cart instance
export { cart }; 