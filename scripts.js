document.addEventListener('DOMContentLoaded', () => {
    initialiseCartPage();
    setupCheckoutForm();
    setupCartFunctionality();
    setupCategoryFilter();
    setupPageNavigation();
    setupFooterBehavior();
    setupPaymentIntegration();

    const nextButton = document.getElementById('next-button');
    const checkoutForm = document.getElementById('shipping-form');

    if (nextButton && checkoutForm) {
        nextButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent form from submitting and reloading the page

            // Gather form data
            const formData = new FormData(checkoutForm);
            const shippingData = Object.fromEntries(formData.entries()); // Convert to an object

            // Save form data in localStorage or send it to the server via AJAX
            localStorage.setItem('shippingData', JSON.stringify(shippingData));

            // Redirect to the payment page
            window.location.href = 'payment.html';
        });
    }

    const shippingData = JSON.parse(localStorage.getItem('shippingData'));

    if (shippingData) {
        // Display shipping details or use them as needed
        console.log('Shipping Data:', shippingData);

        // Example: Display name and address
        document.getElementById('shipping-name').textContent = `${shippingData['first-name']} ${shippingData['last-name']}`;
        document.getElementById('shipping-address').textContent = `${shippingData['checkoutaddress']}, ${shippingData['checkoutcity']}, ${shippingData['checkoutcountry']}`;
    } else {
        console.warn('No shipping data found.');
    }
});

// === Initialization Functions ===

// Initialize the cart page (set subtotal, render cart, etc.)
function initialiseCartPage() {
    renderCart();

    const subtotalElement = document.getElementById('subtotal');
    const totalAmount = localStorage.getItem('totalAmount') || '0.00';
    if (subtotalElement) {
        subtotalElement.textContent = parseFloat(totalAmount).toFixed(2);
    }
}

// === Checkout Form Functions ===

function setupCheckoutForm() {
    const countrySelect = document.getElementById('checkoutcountry');
    const shippingPriceElement = document.getElementById('shipping-price');
    const totalAmountElement = document.getElementById('total-amount');
    const subtotalElement = document.getElementById('subtotal');

    if (!countrySelect || !shippingPriceElement || !subtotalElement || !totalAmountElement) return;

    let shippingCost = 0.00;
    const subtotal = parseFloat(subtotalElement.textContent) || 0;

    countrySelect.addEventListener('change', (e) => {
        shippingCost = calculateShippingCost(e.target.value);
        shippingPriceElement.textContent = shippingCost.toFixed(2);
        updateTotal(subtotal, shippingCost, totalAmountElement);
    });

    updateTotal(subtotal, shippingCost, totalAmountElement); // Initial total
}

function calculateShippingCost(country) {
    const shippingRates = {
        USA: 10.00,
        Canada: 10.00,
        Singapore: 0.00,
        UK: 10.00,
        Malaysia: 5.00
    };
    return shippingRates[country] || 0.00; // Default: free shipping
}

function updateTotal(subtotal, shippingCost, totalAmountElement) {
    const total = subtotal + shippingCost;
    totalAmountElement.textContent = total.toFixed(2);
}

// === Cart Functions ===
// Get modal elements
const modal = document.getElementById('product-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalSize = document.getElementById('modal-size');
const modalMaterial = document.getElementById('modal-material');
const modalQuantity = document.getElementById('modal-quantity');
const modalClose = document.querySelector('.modal .close');
const modalAddToCart = document.getElementById('modal-add-to-cart');

// Open modal on product click
document.querySelectorAll('.product-item').forEach((item) => {
  item.addEventListener('click', () => {
    // Set modal content based on clicked product
    modalImage.src = item.dataset.image;
    modalTitle.textContent = item.dataset.title;
    modalDescription.textContent = item.dataset.description;
    modalSize.textContent = item.dataset.size;
    modalMaterial.textContent = item.dataset.material;

    // Reset quantity
    modalQuantity.value = 1;

    // Show modal
    modal.style.display = 'block';
  });
});

// Close modal
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal when clicking outside of content
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});


// Handle Add to Cart button in modal
modalAddToCart.addEventListener('click', () => {
    const product = {
        name: modalTitle.textContent.trim(),
        price: parseFloat(modalDescription.dataset.price), // Add a `data-price` to modal description if needed
        image: modalImage.src,
        quantity: parseInt(modalQuantity.value, 10)
    };

    addToCart(product); // Use the existing function to add the product to cart
    modal.style.display = 'none';
});


function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product already exists in the cart
    const existingProduct = cart.find((item) => item.name === product.name);
    if (existingProduct) {
        // If it exists, update the quantity
        existingProduct.quantity += product.quantity;
    } else {
        // If not, add it as a new item
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.quantity} x ${product.name} has been added to your cart!`);
    updateCartTotal(cart);
}


function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartTotalElement) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotalPrice = item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${itemTotalPrice.toFixed(2)}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
        total += item.price;
    });

    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    localStorage.setItem('totalAmount', total.toFixed(2));
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// === Category Filter Functions ===

function setupCategoryFilter() {
    const categoryItems = document.querySelectorAll('.category-column li');
    categoryItems.forEach((item) => {
        item.addEventListener('click', () => {
            categoryItems.forEach((i) => i.classList.remove('selected'));
            item.classList.add('selected');
            const category = item.textContent.toLowerCase().trim().replace(/\s+/g, '').replace('★', '');
            filterByCategory(category);
        });
    });
}

function filterByCategory(category) {
    const products = document.querySelectorAll('.product-item');
    products.forEach((product) => {
        const categories = product.dataset.category?.split(' ') || [];
        product.style.display = categories.includes(category) || category === 'all' ? 'block' : 'none';
    });
}

// === Navigation and Footer Behavior ===

function setupPageNavigation() {
    const checkoutButton = document.getElementById('checkout-button');
    const checkoutBackButton = document.getElementById('checkoutbackbutton');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    if (checkoutBackButton) {
        checkoutBackButton.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }
}

function setupFooterBehavior() {
    const footer = document.querySelector('footer');
    let lastScrollTop = 0;

    if (!footer) return;

    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        footer.style.display = currentScrollTop > lastScrollTop ? 'none' : 'block';
        lastScrollTop = currentScrollTop;
    });
}

// === Payment Integration ===

function setupPaymentIntegration() {
    const paypalButton = document.getElementById('paypal-button');
    if (!paypalButton) return;

    paypalButton.addEventListener('click', async () => {
        const totalAmount = parseFloat(document.getElementById('total-amount').textContent);
        try {
            const response = await fetch('/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalAmount })
            });
            const data = await response.json();
            if (data.status === 'CREATED') {
                const approvalUrl = data.links.find((link) => link.rel === 'approve')?.href;
                if (approvalUrl) {
                    window.location.href = approvalUrl;
                }
            }
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    });
}
