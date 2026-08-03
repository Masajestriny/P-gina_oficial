// ============================================================
//  TRINY MASAJES — Notifications Module
// ============================================================

window.showToast = function(title, message = '', type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  const id = 'toast-' + Date.now();

  const toast = document.createElement('div');
  toast.id = id;
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-msg">${message}</div>` : ''}
    </div>
    <button class="toast-close" onclick="dismissToast('${id}')" aria-label="Cerrar notificación">✕</button>
  `;

  container.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => dismissToast(id), duration);
  }
};

window.dismissToast = function(id) {
  const toast = document.getElementById(id);
  if (!toast) return;
  toast.classList.add('hiding');
  setTimeout(() => toast.remove(), 300);
};

console.log('[Triny Masajes] Notifications module loaded ✓');
