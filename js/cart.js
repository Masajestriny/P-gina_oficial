(function() {
  'use strict';

  const STORAGE_KEY = 'triny_cart_v1';
  const MAX_QUANTITY = 99;

  function getCatalogItem(type, id) {
    const catalog = type === 'package' ? window.TRINY_CONFIG?.packages : window.TRINY_CONFIG?.services;
    return catalog?.find(item => item.id === id);
  }

  function loadItems() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(saved)) throw new TypeError('El contenido guardado del carrito no es una lista.');
      return saved.filter(item =>
        item &&
        (item.type === 'service' || item.type === 'package') &&
        getCatalogItem(item.type, item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= MAX_QUANTITY
      );
    } catch (error) {
      console.error('[TrinyCart] No se pudo leer el carrito guardado:', error);
      return [];
    }
  }

  let items = loadItems();

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    render();
  }

  function getDetails(item) {
    const product = getCatalogItem(item.type, item.id);
    return {
      ...product,
      type: item.type,
      quantity: item.quantity,
      lineTotal: product.priceNum * item.quantity,
      sessions: (product.sessions || 1) * item.quantity
    };
  }

  function getTotals() {
    const lines = items.map(getDetails);
    return {
      lines,
      amount: lines.reduce((sum, line) => sum + line.lineTotal, 0),
      items: lines.reduce((sum, line) => sum + line.quantity, 0),
      sessions: lines.reduce((sum, line) => sum + line.sessions, 0)
    };
  }

  function render() {
    const totals = getTotals();
    const listMarkup = totals.lines.map(line => `
      <article class="cart-item">
        <div class="cart-item-info">
          <strong>${line.name}</strong>
          <span>S/ ${line.priceNum} por ${line.type === 'package' ? 'paquete' : 'sesión'} · Subtotal: S/ ${line.lineTotal}</span>
          ${line.type === 'package' ? `<small>${line.sessions} sesiones incluidas en ${line.quantity} paquete(s)</small>` : ''}
        </div>
        <div class="cart-quantity" role="group" aria-label="Cantidad de ${line.name}">
          <button type="button" aria-label="Reducir cantidad de ${line.name}" onclick="TrinyCart.update('${line.type}', '${line.id}', ${line.quantity - 1})" ${line.quantity <= 1 ? 'disabled' : ''}>−</button>
          <span aria-live="polite">${line.quantity}</span>
          <button type="button" aria-label="Aumentar cantidad de ${line.name}" onclick="TrinyCart.update('${line.type}', '${line.id}', ${line.quantity + 1})" ${line.quantity >= MAX_QUANTITY ? 'disabled' : ''}>+</button>
        </div>
        <button type="button" class="btn btn-outline" onclick="TrinyCart.remove('${line.type}', '${line.id}')">Quitar</button>
      </article>
    `).join('');

    ['cartItems', 'drawerCartItems'].forEach(id => {
      const root = document.getElementById(id);
      if (root) root.innerHTML = listMarkup;
    });
    const values = {
      cartCount: totals.sessions,
      cartAmount: `S/ ${totals.amount}`,
      cartSessions: totals.sessions,
      cartCountSummary: totals.items,
      drawerCartCount: totals.items,
      drawerCartSessions: totals.sessions,
      drawerCartAmount: `S/ ${totals.amount}`
    };
    Object.entries(values).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = String(value);
    });
    const countButton = document.querySelector('.header-cart-button');
    if (countButton) countButton.setAttribute('aria-label', `Abrir carrito, ${totals.sessions} sesiones`);
    ['cartEmpty', 'drawerCartEmpty'].forEach(id => {
      const empty = document.getElementById(id);
      if (empty) empty.hidden = totals.lines.length > 0;
    });
    ['cartLines', 'drawerCartLines'].forEach(id => {
      const lines = document.getElementById(id);
      if (lines) lines.hidden = totals.lines.length === 0;
    });
  }

  window.TrinyCart = {
    add(type, id, quantity) {
      const product = getCatalogItem(type, id);
      const amount = Number(quantity);
      if (!product || !Number.isInteger(amount) || amount < 1 || amount > MAX_QUANTITY) {
        window.showToast?.('No se pudo agregar', 'Revisa el servicio y la cantidad seleccionada.', 'warning');
        return;
      }
      const existing = items.find(item => item.type === type && item.id === id);
      if (existing) existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + amount);
      else items.push({ type, id, quantity: amount });
      save();
      window.showToast?.('Agregado al carrito', `${product.name} · cantidad ${amount}`, 'success');
    },
    update(type, id, quantity) {
      const amount = Number(quantity);
      const item = items.find(entry => entry.type === type && entry.id === id);
      if (!item || !Number.isInteger(amount) || amount < 1 || amount > MAX_QUANTITY) {
        render();
        window.showToast?.('Cantidad no válida', `Elige una cantidad entre 1 y ${MAX_QUANTITY}.`, 'warning');
        return;
      }
      item.quantity = amount;
      save();
    },
    remove(type, id) {
      items = items.filter(item => !(item.type === type && item.id === id));
      save();
    },
    getItems() {
      return getTotals().lines;
    },
    getTotals,
    clear() {
      items = [];
      save();
    },
    render
  };

  document.addEventListener('DOMContentLoaded', render);
})();
