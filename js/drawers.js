(function() {
  'use strict';

  const activeDrawers = new Map();

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
    activeDrawers.set(id, document.activeElement);
    overlay.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => {
      const closeButton = drawer.querySelector('.drawer-close');
      (closeButton || drawer).focus();
    });
  }

  function close(id) {
    const overlay = document.getElementById(id);
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    const previous = activeDrawers.get(id);
    activeDrawers.delete(id);
    if (!document.querySelector('.drawer-backdrop:not([hidden]), .modal-overlay:not([hidden])')) {
      document.body.classList.remove('no-scroll');
    }
    if (previous && previous.isConnected) previous.focus();
  }

  document.addEventListener('click', event => {
    const bookingLink = event.target.closest?.('a[href="#reservas"]');
    if (bookingLink) {
      event.preventDefault();
      window.startBookingFromCart?.();
      return;
    }
    const overlay = event.target.closest?.('.drawer-backdrop');
    if (overlay && event.target === overlay) close(overlay.id);
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
