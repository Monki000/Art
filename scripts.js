document.addEventListener('DOMContentLoaded', () => {
    initialiseCartPage();
    setupCheckoutForm();
    setupModalFunctionality();
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
function setupModalFunctionality() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const modal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalSize = document.getElementById('modal-size');
    const modalMaterial = document.getElementById('modal-material');
    const modalQuantity = document.getElementById('modal-quantity');
    const modalAddToCartButton = document.getElementById('modal-add-to-cart');

    // Add event listeners to each Add to Cart button
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default button behavior

            const productElement = button.closest('.product-item'); // Get the product's container
            if (productElement) {
                // Extract product details
                const productName = productElement.querySelector('h3').textContent.trim();
                const productPrice = productElement.querySelector('p').textContent.replace('$', '').trim();
                const productImage = productElement.querySelector('img').src;

                // You can use custom data attributes on the product item for additional details
                const productSize = productElement.dataset.size || 'Default size';
                const productMaterial = productElement.dataset.material || 'Default material';

                // Populate modal content
                modalImage.src = productImage;
                modalTitle.textContent = productName;
                modalDescription.textContent = `Price: $${productPrice}`;
                modalDescription.setAttribute('data-price', productPrice); // Set data-price
                modalSize.textContent = productSize;
                modalMaterial.textContent = productMaterial;
                modalQuantity.value = 1; // Reset quantity

                // Show the modal
                modal.classList.remove('hidden');
                modal.style.display = 'block';
            }
        });
    });

    // Close modal functionality
    const closeModal = modal.querySelector('.close');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Add to cart functionality inside modal
    modalAddToCartButton.addEventListener('click', () => {
        const quantity = parseInt(modalQuantity.value);

        if (isNaN(quantity) || quantity <= 0) {
            alert('Please enter a quantity greater than 0.');
            return; // Prevent proceeding if the quantity is invalid
        }
        
        const price = parseFloat(modalDescription.getAttribute('data-price'));
        const product = {
            name: modalTitle.textContent.trim(),
            price: price, // Unit price
            image: modalImage.src,
            quantity: quantity
        };

        addToCart(product); // Reuse your existing addToCart function
        modal.classList.add('hidden');  // Close modal
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product already exists in the cart
    const existingProduct = cart.find((item) => item.name === product.name);
    if (existingProduct) {
        // If it exists, update the quantity
        existingProduct.quantity += product.quantity;
    } else {
        // If not, add it as a new item
        cart.push({ ...product, price: parseFloat(product.price) });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.quantity} x ${product.name} has been added to your cart!`);
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
                <p>Price: $${itemTotalPrice.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="decrease-quantity" data-index="${index}">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-quantity" data-index="${index}">+</button>
                </div>
                <button class="clear-item" onclick="removeFromCart(${index})">Clear Item</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
        total += itemTotalPrice;
    });

    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    localStorage.setItem('totalAmount', total.toFixed(2));

    setupQuantityButtons(cart);
}

function setupQuantityButtons(cart) {
    const decreaseButtons = document.querySelectorAll('.decrease-quantity');
    const increaseButtons = document.querySelectorAll('.increase-quantity');

    decreaseButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const index = parseInt(button.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                updateCart(cart);
            }
        });
    });

    increaseButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const index = parseInt(button.dataset.index);
            cart[index].quantity++;
            updateCart(cart);
        });
    });
}

function updateCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}


const quantityinput = document.getElementById('modal-quantity');

quantityinput.addEventListener('keydown', (event) => {
    // Allow Backspace, Arrow keys, Tab, and Delete
    if (
        event.key === 'Backspace' || 
        event.key === 'ArrowLeft' || 
        event.key === 'ArrowRight' || 
        event.key === 'Tab' || 
        event.key === 'Delete'
    ) {
        return;
    }

    // Prevent negative sign, non-digit characters, and other invalid inputs
    if (!/^\d$/.test(event.key)) {
        event.preventDefault();
    }
});

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
    const footer = document.querySelectorAll('footer');
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
