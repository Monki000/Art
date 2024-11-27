document.addEventListener('DOMContentLoaded', () => {
    initialiseCartPage();

    setupCheckoutForm();

    setupCartFunctionality();

    setupCategoryFilter();
});

// Initialise the cart page (set default subtotal, render cart, etc.)
function initialiseCartPage() {
    renderCart(); // Render cart items if on the cart page

    const totalAmount = localStorage.getItem('totalAmount');
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = totalAmount ? parseFloat(totalAmount).toFixed(2) : '0.00'; // Display total amount
    }
}

// Handle the checkout form (shipping cost calculations and total updates)
function setupCheckoutForm() {
    const countrySelect = document.getElementById('checkoutcountry');
    const shippingPriceElement = document.getElementById('shipping-price');
    const totalAmountElement = localStorage.getItem('total-amount');
    const subtotalElement = document.getElementById('subtotal');
    
    // Initial values
    let shippingCost = 5.00;
    const subtotal = subtotalElement
        ? parseFloat(subtotalElement.textContent) || 0
        : 0;
    
    // Update shipping price based on selected country
    countrySelect.addEventListener('change', (e) => {
        const selectedCountry = e.target.value;
        shippingCost = calculateShippingCost(selectedCountry);

        // Update shipping price in the UI
        if (shippingPriceElement) {
            shippingPriceElement.textContent = shippingCost.toFixed(2);
        }

        // Update the total
        updateTotal(subtotal, shippingCost, totalAmountElement);
    });

    // Set the initial total
    updateTotal(subtotal, shippingCost, totalAmountElement);
}

function calculateShippingCost(country) {
    const shippingRates = {
        USA: 10.00,
        Canada: 10.00,
        Singapore: 0.00,
        UK: 10.00,
        Malaysia: 5.00
    };

    return shippingRates[country] || 0.00; // Default shipping cost if country not listed
}

// Update the total price (subtotal + shipping)
function updateTotal(subtotal, shippingCost, totalAmountElement) {
    const total = subtotal + shippingCost;
    if (totalAmountElement) {
        totalAmountElement.textContent = total.toFixed(2);
    }
}

// Set up the cart functionality (adding items, storing in localStorage, etc.)
function setupCartFunctionality() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.product-item');
            if (productElement) {
                const product = {
                    name: productElement.querySelector('h3').textContent.trim(),
                    price: parseFloat(
                        productElement
                            .querySelector('p')
                            .textContent.replace('$', '')
                            .trim()
                    ),
                    image: productElement.querySelector('img').src
                };
                addToCart(product);
            }
        });
    });
}

// Set up the category filter functionality
function setupCategoryFilter() {
    const categoryItems = document.querySelectorAll('.category-column li');
    categoryItems.forEach((item) => {
        item.addEventListener('click', () => {
            // Remove 'selected' class from all items
            categoryItems.forEach((i) => i.classList.remove('selected'));

            // Add 'selected' class to the clicked item
            item.classList.add('selected');

            const selectedCategory = item.textContent
                .toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ''); // Normalize category name
            filterByCategory(selectedCategory);
        });
    });
}   

// Function to filter products by category
function filterByCategory(category) {
    // Get all product items
    const products = document.querySelectorAll('.product-item');

    // If 'all' is selected, show all products
    if (category === 'all') {
        products.forEach(product => {
            product.style.display = 'block'; // Show all products
        });
    } else {
        // Otherwise, filter products by category
        products.forEach(product => {
            const productCategories = product.getAttribute('data-category').split(' ');
            if (productCategories.includes(category)) {
                product.style.display = 'block'; // Show product if it matches the selected category
            } else {
                product.style.display = 'none'; // Hide product if it doesn't match
            }
        });
    }
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

// Handle checkout back button click
const checkoutbackButton = document.getElementById('checkoutbackbutton');
if (checkoutbackButton) {
    checkoutbackButton.addEventListener('click', () => {
        window.location.href = 'cart.html'; // Redirect to the cart page
    });
}

const nextButton = document.getElementById('next-button');
if (nextButton) {
    nextButton.addEventListener('click', () => {
        window.location.href = 'payment.html'; // Redirect to the payment page
    });
}

document.getElementById('paypal-button').addEventListener('click', async () => {
    try {
        const response = await fetch('/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // You can include cart or other data here
            })
        });
        const data = await response.json();
        if (data.status === 'CREATED') {
            // Redirect user to PayPal's approval URL
            window.location.href = data.links.find(link => link.rel === 'approve').href;
        }
    } catch (error) {
        console.error("Error processing payment:", error);
    }
});

