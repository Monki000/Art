const productOptions = {
    chainsawmansticker: [
        { name: "Makima Sticker", price: 7.00, image: "images/Makima.jpeg" },
        { name: "Power Sticker", price: 7.00, image: "images/Power.jpeg" },
    ],
    spyxfamilysticker: [
        { name: "Yor Forger Sticker", price: 4.00, image: "images/Yor.jpeg" },
        { name: "Anya Forger Sticker", price: 5.50, image: "images/Anya.jpeg" },
        { name: "Loid Forger Sticker", price: 6.00, image: "images/Loid.jpeg" }
    ],
    chainsawmankeychain: [
        { name: "Makima Keychain", price: 7.00, image: "images/Makima.jpeg" },
        { name: "Power Keychain", price: 7.00, image: "images/Power.jpeg" },
    ],
    spyxfamilykeychain: [
        { name: "Yor Forger Keychain", price: 4.00, image: "images/Yor.jpeg" },
        { name: "Anya Forger Keychain", price: 5.50, image: "images/Anya.jpeg" },
        { name: "Loid Forger Keychain", price: 6.00, image: "images/Loid.jpeg" }
    ],
    oshinokophotocard: [
        { name: "Hoshino Aqua Photocard", price: 4.00, image: "images/Aqua.jpeg" },
        { name: "Hoshino Ruby Photocard", price: 4.00, image: "images/Ruby.jpeg" },
        { name: "Kurokawa Akane Photocard", price: 4.00, image: "images/Akane.jpeg" },
        { name: "Arima Kana Photocard", price: 4.00, image: "images/Kana.jpeg" }
    ],
    // Add more categories as needed
};

document.addEventListener('DOMContentLoaded', () => {
    renderCart(); // Render cart items if on the cart page

    const totalAmount = localStorage.getItem('totalAmount'); // Retrieve total from local storage
    const amountElement = document.getElementById('amount'); // Find the element
    
    if (amountElement) { // Ensure the element exists
        amountElement.textContent = totalAmount 
            ? parseFloat(totalAmount).toFixed(2) 
            : '0.00'; // Set its content
    }
    
    // Add event listener for "Add to Cart" and "Show Options" buttons dynamically
    const productsContainer = document.getElementById('products');
    productsContainer.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('add-to-cart-button')) {
            const product = {
                name: e.target.getAttribute('data-name'),
                price: parseFloat(e.target.getAttribute('data-price')),
                image: e.target.getAttribute('data-image'),
            };
            addToCart(product); // Add product to cart
        } else if (e.target && e.target.classList.contains('category-button')) {
            const category = e.target.getAttribute('data-category');
            showOptions(category); // Show modal for the selected category
        }
    });
});

// Modal handling for product options
function toggleModal(isVisible) {
    const modal = document.getElementById('productOptionsModal');
    modal.style.display = isVisible ? 'flex' : 'none';
}

function showOptions(category) {
    const modalOptionsContainer = document.getElementById('modalOptions');
    const modalTitle = document.getElementById('modalTitle');

    modalOptionsContainer.innerHTML = ''; // Clear existing options
    modalTitle.textContent = `Choose Your Option for ${category.replace(/sticker|keychain|photocard/gi, '').toUpperCase()}`;

    const options = productOptions[category];
    if (!options) {
        console.error(`No options found for category: ${category}`);
        return;
    }

    options.forEach((option) => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('option');
        optionDiv.innerHTML = `
            <img src="${option.image}" alt="${option.name}" class="option-image">
            <p>${option.name} - $${option.price.toFixed(2)}</p>
            <button class="add-to-cart-button" data-name="${option.name}" data-price="${option.price}" data-image="${option.image}">Add to Cart</button>
        `;
        modalOptionsContainer.appendChild(optionDiv);
    });

    // Ensure buttons within the modal add to the cart
    modalOptionsContainer.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('add-to-cart-button')) {
            const product = {
                name: e.target.getAttribute('data-name'),
                price: parseFloat(e.target.getAttribute('data-price')),
                image: e.target.getAttribute('data-image'),
            };
            addToCart(product);
            toggleModal(false); // Close modal after adding
        }
    });

    toggleModal(true);
}

function closeModal() {
    toggleModal(false); // Hide the modal
}

// Array to hold cart items
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add item to the cart
function addToCart(product) {
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

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

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
