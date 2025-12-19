let products = [];

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
    div.className = 'product-card animate-fade-in';
    div.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/200x150?text=No+Image'}" alt="${escapeHtml(p.name)}" />
      <h3>${escapeHtml(p.name)}</h3>
      <p class="category">${escapeHtml(p.category)}</p>
      <p class="weight">${escapeHtml(p.weight || '1kg')}</p>
      <p class="description">${escapeHtml(p.description || '')}</p>
      <p class="price">$${p.price.toFixed(2)}</p>
      <button class="add-to-cart animate-bounce" data-id="${p._id}">Add to Cart</button>
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

fetchProducts();

// Admin form
document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const price = document.getElementById('price').value;
  const category = document.getElementById('category').value.trim();
  const weight = document.getElementById('weight').value.trim();
  const description = document.getElementById('description').value.trim();
  const image = document.getElementById('image').value.trim();
  if (!name || !price || !category) return alert('Name, price, and category are required');
  await fetch(api, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name, price: Number(price), category, weight, description, image})});
  e.target.reset();
  fetchProducts();
});

// Admin form toggle (for demo)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'a') {
    e.preventDefault();
    const form = document.getElementById('addProductForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }
});