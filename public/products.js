let products = [];

async function fetchProducts(){
  document.getElementById('loading').style.display = 'block';
  document.getElementById('productList').innerHTML = '';
  const res = await fetch(api);
  products = await res.json();
  document.getElementById('loading').style.display = 'none';
  displayProducts(products);
  populateCategories();
}

function displayProducts(prods) {
  const list = document.getElementById('productList');
  list.innerHTML = '';
  prods.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-card animate-zoom-in';
    const rating = Math.floor(Math.random() * 5) + 1; // Random rating for demo
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    div.innerHTML = `
      <div class="product-image">
        <img src="${p.image || 'https://via.placeholder.com/250x200?text=No+Image'}" alt="${escapeHtml(p.name)}" />
        <div class="product-overlay">
          <button class="quick-view-btn" data-id="${p._id}">Quick View</button>
          <button class="wishlist-btn" data-id="${p._id}">♥</button>
        </div>
        <div class="eco-badge">Eco-Friendly</div>
      </div>
      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="rating">${stars} (${rating}.0)</div>
        <p class="category">${escapeHtml(p.category)}</p>
        <p class="weight">${escapeHtml(p.weight || '1kg')}</p>
        <p class="stock">Stock: ${p.stock || 10}</p>
        <p class="description">${escapeHtml(p.description || 'Fresh and high-quality product.')}</p>
        <p class="price">$${p.price.toFixed(2)}</p>
        <button class="add-to-cart animate-bounce" data-id="${p._id}">Add to Cart</button>
      </div>
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

function showQuickView(product) {
  const modal = document.createElement('div');
  modal.className = 'quick-view-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <div class="modal-image">
        <img src="${product.image || 'https://via.placeholder.com/400x300?text=No+Image'}" alt="${escapeHtml(product.name)}" />
      </div>
      <div class="modal-info">
        <h2>${escapeHtml(product.name)}</h2>
        <p class="category">${escapeHtml(product.category)}</p>
        <p class="weight">${escapeHtml(product.weight || '1kg')}</p>
        <p class="stock">Stock: ${product.stock || 10}</p>
        <p class="description">${escapeHtml(product.description || 'Fresh and high-quality product.')}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart-modal" data-id="${product._id}">Add to Cart</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'block';

  modal.querySelector('.close-btn').addEventListener('click', () => {
    modal.remove();
  });

  modal.querySelector('.add-to-cart-modal').addEventListener('click', () => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartDisplay();
    showToast(`${product.name} added to cart!`);
    modal.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

document.getElementById('search').addEventListener('input', filterProducts);
document.getElementById('categoryFilter').addEventListener('change', filterProducts);
document.getElementById('sortFilter').addEventListener('change', filterProducts);

function filterProducts() {
  const search = document.getElementById('search').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortFilter').value;
  let filtered = products.filter(p => 
    p.name.toLowerCase().includes(search) && 
    (category === '' || p.category === category)
  );

  if (sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  }

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
      showToast(`${product.name} added to cart!`);
    }
  } else if (e.target.matches('.quick-view-btn')) {
    const id = e.target.dataset.id;
    const product = products.find(p => p._id === id);
    if (product) {
      showQuickView(product);
    }
  } else if (e.target.matches('.wishlist-btn')) {
    const id = e.target.dataset.id;
    alert('Added to wishlist!'); // For demo
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
  const stock = document.getElementById('stock').value;
  const description = document.getElementById('description').value.trim();
  const image = document.getElementById('image').value.trim();
  if (!name || !price || !category) return alert('Name, price, and category are required');
  await fetch(api, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name, price: Number(price), category, weight, stock: Number(stock), description, image})});
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