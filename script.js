// script.js

// Initialize cart array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add product to cart
function addToCart(productId, productName, productPrice) {
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Function to update cart count displayed on the cart button
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}

// Add event listeners to product buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productItem = button.parentElement;
        const productId = productItem.getAttribute('data-id');
        const productName = productItem.getAttribute('data-name');
        const productPrice = parseFloat(productItem.getAttribute('data-price'));

        addToCart(productId, productName, productPrice);
    });
});

// Update cart count on page load
updateCartCount();
// Function to display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceContainer.innerHTML = '';
        return;
    }
    
    let totalPrice = 0;
    cartItemsContainer.innerHTML = ''; // Clear previous items

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
        `;
    });

    totalPriceContainer.innerHTML = `<h3>Total Price: $${totalPrice.toFixed(2)}</h3>`;
}

// Call the display function when cart.html is loaded
document.addEventListener('DOMContentLoaded', displayCartItems);
