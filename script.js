// Basic JavaScript for the shopping cart functionality
document.addEventListener("DOMContentLoaded", function() {
    let cart = [];
    const cartCount = document.getElementById("cart-count");
    const cartItems = document.getElementById("cart-items");
    const totalPrice = document.getElementById("total-price");

    function updateCart() {
        cartItems.innerHTML = "";
        let total = 0;
        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.textContent = `${item.name} - $${item.price.toFixed(2)} (x${item.quantity})`;
            cartItems.appendChild(cartItem);
            total += item.price * item.quantity;
        });
        totalPrice.textContent = total.toFixed(2);
        cartCount.textContent = cart.length;
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const productItem = button.closest(".product-item");
            const productId = productItem.getAttribute("data-id");
            const productName = productItem.getAttribute("data-name");
            const productPrice = parseFloat(productItem.getAttribute("data-price"));

            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
            }

            updateCart();
        });
    });

    document.getElementById("checkout").addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert("Checkout not implemented in this example.");
        cart = [];
        updateCart();
    });
});
