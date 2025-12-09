/* js/app.js
 - Single source of product data.
 - Replace printfulLink values with your real checkout links.
 - Handles: product rendering (shop), product details, cart (localStorage).
*/

const PRODUCTS = [
  {
    id: 1,
    title: "Stodwears Classic Hoodie",
    price: 40,
    img: "images/products/hoodie.jpg",
    short: "Cozy oversized hoodie",
    printfulLink: "REPLACE_WITH_PRINTFUL_LINK_FOR_HOODIE"
  },
  {
    id: 2,
    title: "Stodwears Logo Tee",
    price: 25,
    img: "images/products/tshirt.jpg",
    short: "Premium cotton tee",
    printfulLink: "REPLACE_WITH_PRINTFUL_LINK_FOR_TSHIRT"
  }
];

const CART_KEY = "stodwears_cart_v1";

function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function loadCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }

function addToCart(productId){
  const prod = PRODUCTS.find(p=>p.id===productId);
  if(!prod) return alert("Product not found");
  const cart = loadCart();
  cart.push({id:prod.id, title:prod.title, price:prod.price, img:prod.img, printfulLink:prod.printfulLink});
  saveCart(cart);
  alert(prod.title + " added to cart");
}

function removeFromCart(index){
  const cart = loadCart();
  if(index<0 || index>=cart.length) return;
  cart.splice(index,1);
  saveCart(cart);
  renderCartPage();
}

function renderShopPage(containerId="product-grid"){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <img src="${p.img}" alt="${escapeHtml(p.title)}">
      <div class="info">
        <div>
          <h3>${escapeHtml(p.title)}</h3>
          <p class="muted">${escapeHtml(p.short)}</p>
          <div class="price">$${p.price}</div>
        </div>
        <div class="actions">
          <a class="btn btn-link" href="product.html?id=${p.id}">View</a>
          <a class="btn" href="${p.printfulLink}" target="_blank" rel="noopener">Buy Now</a>
        </div>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderProductPage(){
  const id = Number(new URLSearchParams(location.search).get("id"));
  const p = PRODUCTS.find(x=>x.id===id);
  const container = document.getElementById("product-detail");
  if(!container) return;
  if(!p){
    container.innerHTML = "<p>Product not found.</p>";
    return;
  }
  container.innerHTML = `
    <div class="product-detail-inner">
      <img src="${p.img}" alt="${escapeHtml(p.title)}" style="max-width:320px;width:100%;border-radius:8px">
      <h2>${escapeHtml(p.title)}</h2>
      <p class="muted">${escapeHtml(p.short)}</p>
      <div class="price">$${p.price}</div>
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn" onclick="window.open('${p.printfulLink}','_blank')">Buy Now</button>
        <button class="btn btn-outline" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `;
}

function renderCartPage(){
  const container = document.getElementById("cart-items");
  if(!container) return;
  const cart = loadCart();
  container.innerHTML = "";
  if(cart.length===0){
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  let total = 0;
  cart.forEach((it, idx)=>{
    total += it.price;
    const div = document.createElement("div");
    div.style.display="flex";
    div.style.gap="12px";
    div.style.alignItems="center";
    div.style.marginBottom="12px";
    div.innerHTML = `
      <img src="${it.img}" style="width:72px;height:72px;object-fit:cover;border-radius:6px">
      <div style="flex:1">
        <div style="font-weight:700">${escapeHtml(it.title)}</div>
        <div style="color:#666">$${it.price}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <button class="btn btn-outline" onclick="removeFromCart(${idx})">Remove</button>
        <a class="btn" href="${it.printfulLink}" target="_blank" rel="noopener">Checkout Item</a>
      </div>
    `;
    container.appendChild(div);
  });
  const totalEl = document.createElement("div");
  totalEl.style.marginTop = "18px";
  totalEl.innerHTML = `<h3>Total: $${total}</h3><p class="muted">Checkout is per-item via Printful links.</p>`;
  container.appendChild(totalEl);
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];});
}

/* Auto-run where appropriate */
document.addEventListener("DOMContentLoaded", function(){
  if(document.getElementById("product-grid")) renderShopPage();
  if(document.getElementById("product-detail")) renderProductPage();
  if(document.getElementById("cart-items")) renderCartPage();
});
