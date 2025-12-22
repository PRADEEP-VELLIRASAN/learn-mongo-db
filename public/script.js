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

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const countElements = document.querySelectorAll('#cartCount');
  countElements.forEach(el => el.textContent = cart.length);
}

function updateCartDisplay() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function escapeHtml(str){
  if(!str) return '';
  return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <span class="close-toast">&times;</span>
  `;
  container.appendChild(toast);

  toast.querySelector('.close-toast').addEventListener('click', () => {
    toast.remove();
  });

  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}

updateCartCount();
