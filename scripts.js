const productOptions = {
    chainsawmansticker: [
        { name: "Makima Sticker", price: 7.00, image: "images/Makima.jpeg" },
        { name: "Power Sticker", price: 7.00, image: "images/Power.jpeg" },
    ],
    spyxfamilysticker: [
        { name: "Yor Sticker", price: 4.00, image: "images/Yor.jpeg" },
        { name: "Anya Sticker", price: 5.50, image: "images/Anya.jpeg" },
        { name: "Loid Sticker", price: 6.00, image: "images/Loid.jpeg" }
    ],
    chainsawmankeychain: [
        { name: "Makima Keychain", price: 7.00, image: "images/Makima.jpeg" },
        { name: "Power Keychain", price: 7.00, image: "images/Power.jpeg" },
    ],
    spyxfamilykeychain: [
        { name: "Yor Keychain", price: 4.00, image: "images/Yor.jpeg" },
        { name: "Anya Keychain", price: 5.50, image: "images/Anya.jpeg" },
        { name: "Loid Keychain", price: 6.00, image: "images/Loid.jpeg" }
    ],
    // Add more categories as needed
};

function toggleModal(isVisible) {
    const modal = document.getElementById('productOptionsModal');
    modal.style.display = isVisible ? 'flex' : 'none';
}

function showOptions(category) {
    console.log("showOptions called for category:", category); // For debugging
    const modalOptionsContainer = document.getElementById('modalOptions');
    const modalTitle = document.getElementById('modalTitle');

    // Clear any existing options in the modal
    modalOptionsContainer.innerHTML = '';

    console.log(modalTitle); // Check if the modal title element is being found

    if (modalTitle) {
        modalTitle.textContent = `Choose Your Option for ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    } else {
        console.error("Modal title element not found.");
    }

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
            <button class="add-to-cart-button" data-name="${option.name}" data-price="${option.price}" data-image="${option.image}">Add to Cart</button>
        `;
        
        // Append the option to the modal container
        modalOptionsContainer.appendChild(optionDiv);
    });

    const addToCartButtons = modalOptionsContainer.querySelectorAll('.add-to-cart-button');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const product = {
                name: e.target.getAttribute('data-name'),
                price: parseFloat(e.target.getAttribute('data-price')),
                image: e.target.getAttribute('data-image')
            };
            addToCart(product);
        });
    });

    toggleModal(true); // Show the modal
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

// Inside scripts.js or a separate script tag in checkout.html
document.addEventListener('DOMContentLoaded', () => {
    renderCart(); // Render cart items if on the cart page
    
    const totalAmount = localStorage.getItem('totalAmount'); // Retrieve total from local storage
    document.getElementById('amount').textContent = totalAmount ? parseFloat(totalAmount).toFixed(2) : '0.00'; // Display total amount

    // Handle "Add to Cart" buttons for direct add (no modal)
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const product = {
                name: e.target.getAttribute('data-name'),
                price: parseFloat(e.target.getAttribute('data-price')),
                image: e.target.getAttribute('data-image')
            };
            addToCart(product); // Add product to cart
        });
    });

    // Handle "Show Options" buttons for modal-based selection
    const showOptionsButtons = document.querySelectorAll('.show-options-button');
    showOptionsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.closest('.product-item').getAttribute('data-category');
            showOptions(category); // Show modal for the selected category
        });
    });

    // Optionally: If you have category buttons that open a modal directly
    const categoryButtons = document.querySelectorAll('.category-button'); // Only if you use category-specific product options
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            showOptions(category); // Show options for selected category
        });
    });
});

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
