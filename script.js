let cartCount = 0;
let totalPrice = 0;

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productItem = button.closest('.product-item');
        const price = parseFloat(productItem.getAttribute('data-price'));

        cartCount++;
        totalPrice += price;

        document.getElementById('cart-count').textContent = cartCount;
        document.getElementById('total-price').textContent = totalPrice.toFixed(2);
        
        // Optional: Display the cart item in the cart section
        const cartItemsDiv = document.getElementById('cart-items');
        const itemName = productItem.getAttribute('data-name');
        cartItemsDiv.innerHTML += `<p>${itemName} - $${price.toFixed(2)}</p>`;
    });
});
