document.addEventListener('DOMContentLoaded', () => {
    initialiseCartPage();
    setupCheckoutForm();
    setupCartFunctionality();
    setupCategoryFilter();
    setupPageNavigation();
    setupFooterBehavior();
    setupPaymentIntegration();
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

    let shippingCost = 5.00;
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

function setupCartFunctionality() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.product-item');
            if (productElement) {
                const product = {
                    name: productElement.querySelector('h3').textContent.trim(),
                    price: parseFloat(
                        productElement.querySelector('p').textContent.replace('$', '').trim()
                    ),
                    image: productElement.querySelector('img').src
                };
                addToCart(product);
            }
        });
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} has been added to your cart!`);
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
            const category = item.textContent.toLowerCase().trim().replace(/\s+/g, '');
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
    const nextButton = document.getElementById('next-button');

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

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            window.location.href = 'payment.html';
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
