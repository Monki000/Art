// script.js

// Array to hold items in the cart
let cart = [];

// Function to add product to cart
function addToCart(productId, productName, productPrice) {
    const price = parseFloat(productPrice);
    const cartItem = { id: productId, name: productName, price: price };
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartTotal();
    alert(`${productName} has been added to your cart.`);
}

// Function to update cart count
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.innerText = cart.length;
}

// Function to update the cart total
function updateCartTotal() {
    const cartTotalElement = document.getElementById('cart-total');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalElement.innerText = `$${total.toFixed(2)}`;
}

// Function to render cart items on the cart page
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <p>${item.name} - $${item.price.toFixed(2)}</p>
            <button class="delete-from-cart" data-index="${index}">Delete</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    updateCartTotal();
    addDeleteEventListeners();
}

// Function to remove a product from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
    updateCartTotal();
}

// Function to add event listeners for delete buttons
function addDeleteEventListeners() {
    document.querySelectorAll('.delete-from-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = parseInt(event.target.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

// Function to load cart from local storage
function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
    updateCartCount();
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
}

// Event listener for "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const productElement = event.target.parentElement;
        const productId = productElement.getAttribute('data-id');
        const productName = productElement.getAttribute('data-name');
        const productPrice = productElement.getAttribute('data-price');
        addToCart(productId, productName, productPrice);
    });
});

// Load the cart when the page loads
window.addEventListener('load', loadCart);
