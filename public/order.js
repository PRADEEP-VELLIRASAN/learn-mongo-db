function displayOrderSummary() {
  const orderItems = document.getElementById('orderItems');
  const orderTotal = document.getElementById('orderTotal');
  orderItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.className = 'order-item animate-fade-in';
    li.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/50x50?text=No+Image'}" alt="${escapeHtml(item.name)}" />
      <div class="item-details">
        <span class="item-name">${escapeHtml(item.name)} (${escapeHtml(item.weight || '1kg')}) x ${item.quantity}</span>
        <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
    orderItems.appendChild(li);
    total += item.price * item.quantity;
  });
  orderTotal.textContent = total.toFixed(2);
}

document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const customerName = document.getElementById('customerName').value.trim();
  const customerEmail = document.getElementById('customerEmail').value.trim();
  const customerAddress = document.getElementById('customerAddress').value.trim();
  const customerPhone = document.getElementById('customerPhone').value.trim();
  if (!customerName || !customerEmail || !customerAddress || !customerPhone) {
    alert('All fields are required');
    return;
  }
  const items = cart.map(item => ({ product: item._id, quantity: item.quantity, price: item.price }));
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  try {
    await fetch('/api/orders', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({items, total, customerName, customerEmail, customerAddress, customerPhone})});
    alert('Order placed successfully!');
    cart = [];
    updateCartDisplay();
    window.location.href = 'index.html';
  } catch (err) {
    alert('Failed to place order');
  }
});

displayOrderSummary();