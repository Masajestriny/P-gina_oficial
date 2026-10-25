(function() {
  'use strict';

  const activeDrawers = new Map();
  const closeTimers = new Map();

  function getFocusable(drawer) {
    return Array.from(drawer.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(element =>
      !element.hidden &&
      element.getAttribute('aria-hidden') !== 'true' &&
      element.getClientRects().length > 0
    );
  }

  function open(id) {
    const overlay = document.getElementById(id);
    if (!overlay || !overlay.classList.contains('drawer-backdrop')) return;
    const drawer = overlay.querySelector('.side-drawer');
    if (!drawer) return;

    document.querySelectorAll('.drawer-backdrop:not([hidden])').forEach(other => {
      if (other === overlay) return;
      other.hidden = true;
      other.classList.remove('is-open');
      activeDrawers.delete(other.id);
      clearTimeout(closeTimers.get(other.id));
      closeTimers.delete(other.id);
    });

    activeDrawers.set(id, document.activeElement);
    overlay.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      const closeButton = drawer.querySelector('.drawer-close');
      (closeButton || drawer).focus();
    });
  }

  function close(id) {
    const overlay = document.getElementById(id);
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove('is-open');
    const previous = activeDrawers.get(id);
    activeDrawers.delete(id);
    clearTimeout(closeTimers.get(id));
    closeTimers.set(id, setTimeout(() => {
      overlay.hidden = true;
      closeTimers.delete(id);
      if (!document.querySelector('.drawer-backdrop:not([hidden]), .modal-overlay:not([hidden])')) {
        document.body.classList.remove('no-scroll');
      }
      if (previous && previous.isConnected) previous.focus();
    }, 240));
  }

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    const bookingLink = target?.closest('a[href="#reservas"]');
    if (bookingLink) {
      event.preventDefault();
      window.startBooking?.();
      return;
    }
    const giftCardLink = target?.closest('a[href="#giftcards"]');
    if (giftCardLink) {
      event.preventDefault();
      open('giftCardDrawer');
      return;
    }
    const overlay = target?.closest('.drawer-backdrop');
    if (overlay && target === overlay) close(overlay.id);
  });

  document.addEventListener('keydown', event => {
    const overlay = Array.from(document.querySelectorAll('.drawer-backdrop:not([hidden])')).pop();
    if (!overlay) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close(overlay.id);
      return;
    }
    if (event.key !== 'Tab') return;
    const drawer = overlay.querySelector('.side-drawer');
    const focusable = getFocusable(drawer);
    if (!focusable.length) {
      event.preventDefault();
      drawer.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === drawer)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.TrinyDrawers = { open, close };
})();
