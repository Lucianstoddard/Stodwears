// Cart functions
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(product.name + " added to cart!");
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;
    const cart = getCart();
    cartContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price;
        cartContainer.innerHTML += `
            <div>
                ${item.name} - $${item.price}
                <button onclick="removeFromCart(${idx})">Remove</button>
            </div>
        `;
    });
    cartContainer.innerHTML += `<h3>Total: $${total}</h3>`;
}

function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index,1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}
