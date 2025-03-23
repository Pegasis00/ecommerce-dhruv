import { products } from '../data/products.js';
import { cart } from './cart.js';

let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}"
          alt="${product.name}">
      </div>
      <div class="product-name limit-to-2-lines">
        ${product.name}
      </div>
      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png"
          alt="${product.rating.stars} stars">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>
      <div class="product-price">
        $${(product.priceCents / 100).toFixed(2)}
      </div>
      <select class="js-quantity-selector-${product.id}">
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
      <div class="product-spacer"></div>
      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png" alt="Checkmark">
        Added
      </div>
      <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;

// Add to cart functionality
document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    const quantity = parseInt(document.querySelector(`.js-quantity-selector-${productId}`).value);
    
    // Find the product in the products array
    const product = products.find(p => p.id === productId);
    
    // Add to cart
    for (let i = 0; i < quantity; i++) {
      cart.addItem(product);
    }

    // Show "Added" message
    const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
    addedMessage.classList.add('added-to-cart-visible');

    // Remove "Added" message after 2 seconds
    setTimeout(() => {
      addedMessage.classList.remove('added-to-cart-visible');
    }, 2000);
  });
});

// Initialize cart quantity on page load
document.addEventListener('DOMContentLoaded', () => {
  cart.updateCartQuantity();
});