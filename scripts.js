// Array to hold cart items
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add item to the cart
function addToCart(product) {
    console.log("addToCart called with product:", product);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} has been added to your cart!`);
}

// Function to render cart items on the cart page
function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer) return; // If not on the cart page, exit

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
        total += item.price;
    });

    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    
    localStorage.setItem('totalAmount', total.toFixed(2));
}

// Inside scripts.js or a separate script tag in checkout.html
document.addEventListener('DOMContentLoaded', () => {
    const totalAmount = localStorage.getItem('totalAmount'); // Retrieve total from local storage
    document.getElementById('amount').textContent = totalAmount ? parseFloat(totalAmount).toFixed(2) : '0.00'; // Display total amount
});

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Function to handle adding to cart buttons
document.addEventListener('DOMContentLoaded', () => {
    renderCart(); // Render cart items if on the cart page

    const addToCartButtons = document.querySelectorAll('.product-item button');
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const productElement = button.parentElement;
            const product = {
                name: productElement.querySelector('h3').textContent,
                price: parseFloat(productElement.querySelector('p').textContent.replace('$', '')),
                image: productElement.querySelector('img').src
            };
            addToCart(product);
        });
    });
});

// Remove footer after scrolling down
let lastScrollTop = 0; // Keeps track of the last scroll position
const footer = document.querySelector('footer'); // Get the footer element

window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop) {
        // User is scrolling down
        footer.style.display = 'none'; // Hide the footer
    } else {
        // User is scrolling up
        footer.style.display = 'block'; // Show the footer
    }

    lastScrollTop = currentScrollTop; // Update the last scroll position
});

// Handle checkout button click
const checkoutButton = document.getElementById('checkout-button');
if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html'; // Redirect to the checkout page
    });
}

const productOptions = {
    chainsawmansticker: [
        { name: "Makima Sticker", price: 5.00, image: "images/Makima.jpeg" },
        { name: "Power", price: 6.00, image: "images/Power.jpeg" },
        { name: "Sticker C", price: 7.00, image: "images/sticker_c.jpg" }
    ],
    spyxfamilysticker: [
        { name: "Luffy Sticker", price: 4.00, image: "images/luffy_sticker.jpg" },
        { name: "Zoro Sticker", price: 5.50, image: "images/zoro_sticker.jpg" },
        { name: "Nami Sticker", price: 6.00, image: "images/nami_sticker.jpg" }
    ],
    // Add more categories as needed
};

function showOptions(category) {
    const modalOptionsContainer = document.getElementById('modalOptions');
    const modalTitle = document.getElementById('modalTitle');

    // Clear any existing options in the modal
    modalOptionsContainer.innerHTML = '';

    // Set a dynamic title for the modal based on the category
    modalTitle.textContent = `Choose Your Option for ${category.charAt(0).toUpperCase() + category.slice(1)}`;

    // Get the product options for the chosen category
    const options = productOptions[category];

    // Dynamically generate HTML for each option
    options.forEach(option => {
        // Create a div for each option
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('option');
        
        // Set the HTML for the option with the image
        optionDiv.innerHTML = `
            <img src="${option.image}" alt="${option.name}" class="option-image">
            <p>${option.name} - $${option.price.toFixed(2)}</p>
            <button onclick="addToCart('${option.name}', ${option.price}, '${option.image}')">Add to Cart</button>
        `;
        
        // Append the option to the modal container
        modalOptionsContainer.appendChild(optionDiv);
    });

    // Show the modal
    document.getElementById('productOptionsModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('productOptionsModal').style.display = 'none';
}
