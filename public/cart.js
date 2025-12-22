function displayCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  cartItems.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    cartItems.innerHTML = '<li class="empty-cart animate-fade-in">Your cart is empty.</li>';
    cartTotal.textContent = '0.00';
    return;
  }
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'cart-item animate-slide-in';
    li.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/50x50?text=No+Image'}" alt="${escapeHtml(item.name)}" />
      <div class="item-details">
        <div class="item-name">${escapeHtml(item.name)}</div>
        <div class="item-weight">${escapeHtml(item.weight || '1kg')}</div>
        <div class="item-price">$${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</div>
      </div>
      <button class="remove animate-pulse" data-index="${index}">Remove</button>
    `;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });
  cartTotal.textContent = total.toFixed(2);
}

document.getElementById('cartItems').addEventListener('click', (e) => {
  if (e.target.matches('.remove')) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    updateCartDisplay();
    displayCart();
  }
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Cart is empty!', 'error');
    return;
  }
  window.location.href = 'order.html';
});

displayCart();