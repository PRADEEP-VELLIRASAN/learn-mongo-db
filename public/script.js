const defaultApi = '/api/products';
let api;
try {
  const origin = location.origin || '';
  if (origin.startsWith('http://127.0.0.1:5500') || origin.startsWith('http://localhost:5500')) {
    api = 'http://127.0.0.1:3000/api/products';
  } else {
    api = defaultApi;
  }
} catch (e) {
  api = defaultApi;
}

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.length;
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<div>${escapeHtml(item.name)} - $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</div>
      <button class="remove" data-index="${index}">Remove</button>`;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });
  cartTotal.textContent = total.toFixed(2);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

async function fetchProducts(){
  const res = await fetch(api);
  products = await res.json();
  displayProducts(products);
  populateCategories();
}

function displayProducts(prods) {
  const list = document.getElementById('productList');
  list.innerHTML = '';
  prods.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/150'}" alt="${escapeHtml(p.name)}" />
      <h3>${escapeHtml(p.name)}</h3>
      <p class="category">${escapeHtml(p.category)}</p>
      <p class="description">${escapeHtml(p.description || '')}</p>
      <p class="price">$${p.price.toFixed(2)}</p>
      <button class="add-to-cart" data-id="${p._id}">Add to Cart</button>
    `;
    list.appendChild(div);
  });
}

function populateCategories() {
  const categories = [...new Set(products.map(p => p.category))];
  const filter = document.getElementById('categoryFilter');
  filter.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });
}

function escapeHtml(str){
  if(!str) return '';
  return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

document.getElementById('search').addEventListener('input', filterProducts);
document.getElementById('categoryFilter').addEventListener('change', filterProducts);

function filterProducts() {
  const search = document.getElementById('search').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search) && 
    (category === '' || p.category === category)
  );
  displayProducts(filtered);
}

document.getElementById('productList').addEventListener('click', (e) => {
  if (e.target.matches('.add-to-cart')) {
    const id = e.target.dataset.id;
    const product = products.find(p => p._id === id);
    if (product) {
      const existing = cart.find(item => item._id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      updateCartDisplay();
      alert('Added to cart!');
    }
  }
});

document.getElementById('cartBtn').addEventListener('click', () => {
  document.getElementById('cartModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('cartModal').style.display = 'none';
});

document.getElementById('cartItems').addEventListener('click', (e) => {
  if (e.target.matches('.remove')) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    updateCartDisplay();
  }
});

document.getElementById('checkoutBtn').addEventListener('click', async () => {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }
  const customerName = prompt('Enter your name:');
  const customerEmail = prompt('Enter your email:');
  if (!customerName || !customerEmail) return;
  const items = cart.map(item => ({ product: item._id, quantity: item.quantity, price: item.price }));
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  try {
    await fetch('/api/orders', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({items, total, customerName, customerEmail})});
    alert('Order placed successfully!');
    cart = [];
    updateCartDisplay();
    document.getElementById('cartModal').style.display = 'none';
  } catch (err) {
    alert('Failed to place order');
  }
});

// Admin form toggle (for demo)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'a') {
    e.preventDefault();
    const form = document.getElementById('addProductForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }
  if (e.ctrlKey && e.key === 'o') {
    e.preventDefault();
    const orders = document.getElementById('ordersSection');
    orders.style.display = orders.style.display === 'none' ? 'block' : 'none';
    if (orders.style.display === 'block') fetchOrders();
  }
});

async function fetchOrders() {
  try {
    const res = await fetch('/api/orders');
    const orders = await res.json();
    const list = document.getElementById('ordersList');
    list.innerHTML = '';
    orders.forEach(o => {
      const li = document.createElement('li');
      li.innerHTML = `<div><strong>Order #${o._id.slice(-6)}</strong> - ${o.customerName} (${o.customerEmail}) - Total: $${o.total.toFixed(2)} - ${new Date(o.createdAt).toLocaleDateString()}</div>
        <ul>${o.items.map(item => `<li>${item.product.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}</ul>`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Failed to fetch orders');
  }
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const price = document.getElementById('price').value;
  const category = document.getElementById('category').value.trim();
  const description = document.getElementById('description').value.trim();
  const image = document.getElementById('image').value.trim();
  if (!name || !price || !category) return alert('Name, price, and category are required');
  await fetch(api, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name, price: Number(price), category, description, image})});
  e.target.reset();
  fetchProducts();
});

fetchProducts();
updateCartCount();
