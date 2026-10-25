(function() {
  'use strict';

  const STORAGE_KEY = 'triny_cart_v1';
  const MAX_QUANTITY = 99;

  function normalizeId(type, id) {
    return type === 'service' && Number.isInteger(Number(id)) ? Number(id) : id;
  }

  function getCatalogItem(type, id) {
    const catalog = type === 'package' ? window.TRINY_CONFIG?.packages : window.TRINY_CONFIG?.services;
    const normalizedId = normalizeId(type, id);
    return catalog?.find(item => item.id === normalizedId);
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

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function render() {
    const totals = getTotals();
    const listMarkup = totals.lines.map(line => `
      <article class="cart-item${line.type === 'service' && line.img ? ' has-image' : ''}">
        ${line.type === 'service' && line.img
          ? `<img class="cart-item-image" src="${escapeHTML(line.img)}" alt="${escapeHTML(line.name)}" loading="lazy" />`
          : ''}
        <div class="cart-item-info">
          <strong>${escapeHTML(line.name)}</strong>
          <span>S/ ${line.priceNum} por ${line.type === 'package' ? 'paquete' : 'sesión'} · Subtotal: S/ ${line.lineTotal}</span>
          ${line.duration ? `<small>Duración: ${escapeHTML(line.duration)}</small>` : ''}
          ${line.type === 'package' ? `<small>${line.sessions} sesiones incluidas en ${line.quantity} paquete(s)</small>` : ''}
        </div>
        <div class="cart-quantity" role="group" aria-label="Cantidad de ${escapeHTML(line.name)}">
          <button type="button" aria-label="Reducir cantidad de ${escapeHTML(line.name)}" onclick="TrinyCart.update('${line.type}', '${line.id}', ${line.quantity - 1})" ${line.quantity <= 1 ? 'disabled' : ''}>−</button>
          <span aria-live="polite">${line.quantity}</span>
          <button type="button" aria-label="Aumentar cantidad de ${escapeHTML(line.name)}" onclick="TrinyCart.update('${line.type}', '${line.id}', ${line.quantity + 1})" ${line.quantity >= MAX_QUANTITY ? 'disabled' : ''}>+</button>
        </div>
        <button type="button" class="btn btn-outline" aria-label="Eliminar ${escapeHTML(line.name)} del carrito" onclick="TrinyCart.remove('${line.type}', '${line.id}')">Quitar</button>
      </article>
    `).join('');

    const root = document.getElementById('drawerCartItems');
    if (root) root.innerHTML = listMarkup;
    const values = {
      cartCount: totals.sessions,
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
    const empty = document.getElementById('drawerCartEmpty');
    if (empty) empty.hidden = totals.lines.length > 0;
    const lines = document.getElementById('drawerCartLines');
    if (lines) lines.hidden = totals.lines.length === 0;
  }

  window.TrinyCart = {
    add(type, id, quantity) {
      const normalizedId = normalizeId(type, id);
      const product = getCatalogItem(type, normalizedId);
      const amount = Number(quantity);
      if (!product || !Number.isInteger(amount) || amount < 1 || amount > MAX_QUANTITY) {
        window.showToast?.('No se pudo agregar', 'Revisa el servicio y la cantidad seleccionada.', 'warning');
        return;
      }
      const existing = items.find(item => item.type === type && item.id === normalizedId);
      if (existing) existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + amount);
      else items.push({ type, id: normalizedId, quantity: amount });
      save();
      window.showToast?.('Agregado al carrito', `${product.name} · cantidad ${amount}`, 'success');
    },
    update(type, id, quantity) {
      const amount = Number(quantity);
      const normalizedId = normalizeId(type, id);
      const item = items.find(entry => entry.type === type && entry.id === normalizedId);
      if (!item || !Number.isInteger(amount) || amount < 1 || amount > MAX_QUANTITY) {
        render();
        window.showToast?.('Cantidad no válida', `Elige una cantidad entre 1 y ${MAX_QUANTITY}.`, 'warning');
        return;
      }
      item.quantity = amount;
      save();
    },
    remove(type, id) {
      const normalizedId = normalizeId(type, id);
      items = items.filter(item => !(item.type === type && item.id === normalizedId));
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
