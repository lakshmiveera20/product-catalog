/* Mock JSON data with 4 items per category */
const data = {
  beauty: [
    { id: 'b1', name: "Charcoal", price: 299, img: "beayty/charcoal.avif", desc: "Rich long-lasting color" },
    { id: 'b2', name: "Liquid Eyeliner", price: 199, img: "beayty/eyebrow.avif", desc: "Precise and smudge-proof" },
    { id: 'b3', name: "face pack", price: 499, img: "beayty/face packs.avif", desc: "Moisturize & glow" },
    { id: 'b4', name: "Hydrating Face Cream", price: 799, img: "beayty/mamaearth rice fash wash.avif", desc: "Fresh long-lasting scent" },
  ],
  kids: [
    { id:'k1', name: "Kids T-Shirt", price: 350, img: "kids/kids shirt.webp", desc: "Soft cotton, comfy fit" },
    { id:'k2', name: "Kids gown", price: 450, img: "kids/barbet gown.webp", desc: "Breathable material" },
    { id:'k3', name: "Kids Dress", price: 650, img: "kids/kids gown.webp", desc: "Cute & colorful" },
    { id:'k4', name: "Kids Jacket", price: 999, img: "kids/shirt.webp", desc: "Warm & cozy" },
  ],
  women: [
    { id:'w1', name: "Women Kurti", price: 799, img: "saree/kuti.jpg", desc: "Elegant ethnic wear" },
    { id:'w2', name: "Women Saree", price: 1599, img: "saree/navy blue saree.webp", desc: "Traditional and classy" },
    { id:'w3', name: "Women Jeans", price: 999, img: "saree/jeans.webp", desc: "Comfortable & stylish" },
    { id:'w4', name: "Women Top", price: 699, img: "saree/top.jpg", desc: "Trendy everyday top" },
  ],
  men: [
    { id:'m1', name: "Men Shirt", price: 599, img: "men/men shirt.webp", desc: "Smart casual shirt" },
    { id:'m2', name: "Men Jeans", price: 1099, img: "men/men jeans.webp", desc: "Durable denim" },
    { id:'m3', name: "Men T-shirt", price: 499, img: "men/jacket.webp", desc: "Casual everyday tee" },
    { id:'m4', name: "Men Jacket", price: 1999, img: "men/t-shirt.webp", desc: "Warm winter jacket" }
  ]
};

/* CART is an array of objects: { id, name, price, img, qty } */
let cart = [];
let currentCategory = null;
let currentDisplay = [];

/* greeting based on local time */
function showGreeting() {
  const g = document.getElementById('greeting');
  const now = new Date();
  const hour = now.getHours();
  let text = "Hello";
  if (hour >= 5 && hour < 12) text = "Good morning";
  else if (hour >= 12 && hour < 17) text = "Good afternoon";
  else if (hour >= 17 && hour < 21) text = "Good evening";
  else text = "Good night";
  g.textContent = `${text}! Welcome to our store.`;
}
showGreeting();

/* show home */
function showHome() {
  document.getElementById('home').classList.remove('hidden');
  document.getElementById('products').classList.add('hidden');
}

/* toggle cart panel */
function toggleCart() {
  const panel = document.getElementById('cartPanel');
  panel.classList.toggle('hidden');
}

/* open category and display products */
function openCategory(cat) {
  currentCategory = cat;
  currentDisplay = [...data[cat]]; // clone for sorting/filtering
  document.getElementById('home').classList.add('hidden');
  document.getElementById('products').classList.remove('hidden');
  document.getElementById('categoryTitle').textContent = cat.charAt(0).toUpperCase() + cat.slice(1) + " Products";
  document.getElementById('searchInput').value = '';
  document.getElementById('sortSelect').value = 'default';
  renderProducts(currentDisplay);
}

/* render product grid */
function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  if (!list || list.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">No products found</p>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="product">
      <img src="${p.img}" alt="${p.name}">
      <div class="title">${p.name}</div>
      <div class="desc">${p.desc}</div>
      <div class="price">₹${p.price}</div>
      <div class="actions">
        <button class="btn-add" onclick='addToCart("${p.id}")'>Add to Cart</button>
        <button class="btn-details" onclick='showDetails("${p.id}")'>Details</button>
      </div>
    </div>
  `).join('');
}

/* show details simple alert (beginner friendly) */
function showDetails(id) {
  const all = [].concat(...Object.values(data));
  const p = all.find(x => x.id === id);
  if (!p) return;
  alert(`${p.name}\n\nPrice: ₹${p.price}\n\n${p.desc}`);
}

/* ADD TO CART: if item exists, increase qty */
function addToCart(id) {
  // find the product in data
  const allProducts = [].concat(...Object.values(data));
  const prod = allProducts.find(x => x.id === id);
  if (!prod) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: prod.id, name: prod.name, price: prod.price, img: prod.img, qty: 1 });
  }
  updateCartUI();
  // show cart for user feedback
  document.getElementById('cartPanel').classList.remove('hidden');
}

/* update cart DOM */
function updateCartUI() {
  const container = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    document.getElementById('cartTotal').textContent = '₹0';
    countEl.textContent = 0;
    return;
  }

  container.innerHTML = cart.map((c, idx) => `
    <div class="cart-row">
      <img src="${c.img}" alt="${c.name}">
      <div class="meta">
        <div style="font-weight:600;">${c.name}</div>
        <div style="font-size:13px;color:#666;">Price: ₹${c.price} &nbsp; | &nbsp; Subtotal: ₹${c.price * c.qty}</div>
        <div class="qty-controls">
          <button onclick="changeQty('${c.id}', -1)">-</button>
          <div style="min-width:24px; text-align:center;">${c.qty}</div>
          <button onclick="changeQty('${c.id}', 1)">+</button>
          <button class="delete-btn" onclick="removeFromCart('${c.id}')">Delete</button>
        </div>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
  document.getElementById('cartTotal').textContent = `₹${total}`;
  countEl.textContent = cart.reduce((s, it) => s + it.qty, 0);
}

/* change quantity for an item */
function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  updateCartUI();
}

/* remove single item */
function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

/* clear all cart */
function clearCart() {
  if (!confirm("Clear all items from cart?")) return;
  cart = [];
  updateCartUI();
}

/* checkout (simple) */
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
  alert(`Thank you! Your total is ₹${total}. (This is a demo checkout.)`);
  cart = [];
  updateCartUI();
  document.getElementById('cartPanel').classList.add('hidden');
}

/* go back to categories */
function goBack() {
  document.getElementById('products').classList.add('hidden');
  document.getElementById('home').classList.remove('hidden');
  currentCategory = null;
  currentDisplay = [];
}

/* search within current category */
function searchProducts() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!currentCategory) return;
  const list = data[currentCategory].filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  currentDisplay = [...list];
  renderProducts(currentDisplay);
}

/* sort products display by price */
function sortProducts() {
  const mode = document.getElementById('sortSelect').value;
  if (!currentCategory) return;
  if (mode === 'low') currentDisplay.sort((a,b) => a.price - b.price);
  else if (mode === 'high') currentDisplay.sort((a,b) => b.price - a.price);
  else currentDisplay = [...data[currentCategory]];
  renderProducts(currentDisplay);
}

/* initialize: show home, update cart counts */
showHome();
updateCartUI();
