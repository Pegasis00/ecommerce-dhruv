import { cart } from './cart.js';
import { products } from '../data/products.js';

// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || !currentUser.isLoggedIn) {
  window.location.href = 'login.html';
}

// Redirect to buyit.html if cart is empty
if (cart.getTotalItems() === 0) {
  window.location.href = 'buyit.html';
}

// Function to generate cart HTML
function generateCartHTML() {
  const cartItems = cart.getItems();
  return `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Delivery Option</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${cartItems.map(item => `
          <tr class="cart-item" data-product-id="${item.id}">
            <td class="product-info">
              <img src="${item.image}" alt="${item.name}" class="product-image">
              <div class="product-details">
                <div class="product-name">${item.name}</div>
                <div class="product-stock">In Stock</div>
              </div>
            </td>
            <td class="product-price">$${item.price.toFixed(2)}</td>
            <td class="product-quantity">
              <select class="quantity-select" data-product-id="${item.id}">
                ${[1,2,3,4,5,6,7,8,9,10].map(num => 
                  `<option value="${num}" ${item.quantity === num ? 'selected' : ''}>${num}</option>`
                ).join('')}
              </select>
            </td>
            <td class="delivery-option">
              <select class="delivery-select" data-product-id="${item.id}">
                <option value="standard" ${!item.expressDelivery ? 'selected' : ''}>
                  Standard Delivery - FREE
                </option>
                <option value="express" ${item.expressDelivery ? 'selected' : ''}>
                  Express Delivery - $4.99
                </option>
              </select>
              <div class="delivery-date">
                Delivery by: ${getDeliveryDate(item.expressDelivery ? 'express' : 'standard')}
              </div>
            </td>
            <td class="item-total">
              $${((item.price * item.quantity) + (item.expressDelivery ? 4.99 : 0)).toFixed(2)}
            </td>
            <td class="item-actions">
              <button class="delete-button" data-product-id="${item.id}">
                Remove
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Function to get delivery date based on option
function getDeliveryDate(option) {
  const today = new Date();
  const deliveryDays = option === 'express' ? 2 : 5;
  const deliveryDate = new Date(today.setDate(today.getDate() + deliveryDays));
  return deliveryDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric'
  });
}

// Function to update order summary
function updateOrderSummary() {
  const cartItems = cart.getItems();
  let subtotal = 0;
  let shipping = 0;

  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
    if (item.expressDelivery) {
      shipping += 4.99;
    }
  });

  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector('.shipping').textContent = `$${shipping.toFixed(2)}`;
  document.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
  document.querySelector('.total').textContent = `$${total.toFixed(2)}`;
}

// Initialize page
document.querySelector('.cart-items').innerHTML = generateCartHTML();
updateOrderSummary();

// Event listener for quantity changes
document.addEventListener('change', (e) => {
  if (e.target.classList.contains('quantity-select')) {
    const productId = e.target.dataset.productId;
    const quantity = parseInt(e.target.value);
    cart.updateQuantity(productId, quantity);
    updateOrderSummary();
    document.querySelector('.cart-items').innerHTML = generateCartHTML();
  }
});

// Event listener for delivery option changes
document.addEventListener('change', (e) => {
  if (e.target.classList.contains('delivery-select')) {
    const productId = e.target.dataset.productId;
    const isExpress = e.target.value === 'express';
    cart.updateDeliveryOption(productId, isExpress);
    updateOrderSummary();
    document.querySelector('.cart-items').innerHTML = generateCartHTML();
  }
});

// Event listener for delete buttons
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-button')) {
    const productId = e.target.dataset.productId;
    cart.removeItem(productId);
    
    if (cart.getTotalItems() === 0) {
      window.location.href = 'buyit.html';
    } else {
      document.querySelector('.cart-items').innerHTML = generateCartHTML();
      updateOrderSummary();
    }
  }
});

// Event listener for place order button
document.querySelector('.place-order-button').addEventListener('click', () => {
  const cartItems = cart.getItems();
  const orderId = 'ORD' + Date.now();
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate order total
  let subtotal = 0;
  let shipping = 0;
  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
    if (item.expressDelivery) {
      shipping += 4.99;
    }
  });
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Create order object
  const order = {
    orderId,
    date: orderDate,
    items: cartItems.map(item => ({
      ...item,
      deliveryDate: getDeliveryDate(item.expressDelivery ? 'express' : 'standard')
    })),
    total: total
  };

  // Save order to localStorage
  let orders = JSON.parse(localStorage.getItem('orders')) || {};
  if (!orders[currentUser.username]) {
    orders[currentUser.username] = [];
  }
  orders[currentUser.username].push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Clear the cart
  cart.clearCart();

  // Show success message
  const successMessage = document.createElement('div');
  successMessage.className = 'success-message';
  successMessage.innerHTML = `
    <div class="success-content">
      <h2>Order Placed Successfully!</h2>
      <p>Your order ID is: ${orderId}</p>
      <p>You will be redirected to your orders page in 3 seconds...</p>
    </div>
  `;
  document.body.appendChild(successMessage);

  // Add success message styles
  const style = document.createElement('style');
  style.textContent = `
    .success-message {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .success-content {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .success-content h2 {
      color: #007600;
      margin-bottom: 15px;
    }
  `;
  document.head.appendChild(style);

  // Redirect to orders page after 3 seconds
  setTimeout(() => {
    window.location.href = 'orders.html';
  }, 3000);
});

// Add cart table styles
const style = document.createElement('style');
style.textContent = `
  .cart-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .cart-table th {
    background-color: #f8f8f8;
    padding: 12px;
    text-align: left;
    border-bottom: 2px solid #ddd;
  }

  .cart-table td {
    padding: 15px;
    border-bottom: 1px solid #ddd;
    vertical-align: middle;
  }

  .product-info {
    display: flex;
    align-items: center;
  }

  .product-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-right: 15px;
  }

  .product-details {
    flex-grow: 1;
  }

  .product-name {
    font-weight: 500;
    margin-bottom: 5px;
  }

  .product-stock {
    color: #007600;
    font-size: 14px;
  }

  .product-price {
    color: #B12704;
    font-weight: 500;
  }

  .quantity-select,
  .delivery-select {
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 70px;
  }

  .delivery-date {
    font-size: 14px;
    color: #565959;
    margin-top: 5px;
  }

  .item-total {
    color: #B12704;
    font-weight: 500;
  }

  .delete-button {
    padding: 6px 12px;
    background-color: #f0f2f2;
    border: 1px solid #d5d9d9;
    border-radius: 4px;
    cursor: pointer;
  }

  .delete-button:hover {
    background-color: #e7e9ec;
  }
`;
document.head.appendChild(style);

