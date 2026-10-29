(function() {
  'use strict';

  function getCentral(centralId) {
    const key = centralId === 'central2' ? 'central2' : 'central1';
    const central = window.TRINY_CONFIG?.contacts?.[key];
    if (!central) throw new Error(`No existe la configuración para ${key}.`);
    return central;
  }

  function buildWALink(message, centralId) {
    const central = getCentral(centralId);
    return `https://wa.me/${central.phone}?text=${encodeURIComponent(message)}`;
  }

  window.WA = {
    link: buildWALink,
    bookService(serviceName, centralId) {
      return buildWALink(`Hola, quisiera solicitar una reserva para ${serviceName}. ¿Pueden revisar disponibilidad?`, centralId);
    },
    generalInfo(centralId) {
      return buildWALink('Hola, quisiera información sobre los servicios de Masajes Triny Delivery.', centralId);
    },
    claimPrize(prize, centralId) {
      return buildWALink(`Hola, quisiera consultar sobre el premio: ${prize}.`, centralId);
    },
    supportChat(centralId) {
      return buildWALink('Hola, tengo una consulta para Atención al Cliente.', centralId);
    }
  };

  function configureContactLinks() {
    document.querySelectorAll('[data-whatsapp-central]').forEach(link => {
      const centralId = link.dataset.whatsappCentral;
      const central = getCentral(centralId);
      link.href = buildWALink(link.dataset.whatsappMessage || 'Hola, quisiera contactar a Triny.', centralId);
      link.setAttribute('aria-label', `Abrir WhatsApp ${central.label} ${central.display}`);
      link.querySelectorAll(`[data-central-display="${centralId}"]`).forEach(element => {
        element.textContent = central.display;
      });
    });

    const socialMarkup = window.TRINY_CONFIG.social.map(item => `
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="sn-link" aria-label="${item.label} de Triny Masajes" title="${item.label}">
        <img class="sn-icon" src="${item.icon}" alt="" loading="lazy" />
      </a>
    `).join('');
    const footerSocials = document.getElementById('footerSocialLinks');
    if (footerSocials) footerSocials.innerHTML = socialMarkup;
  }

  document.addEventListener('DOMContentLoaded', configureContactLinks);

  let lastScroll = 0;
  const floatButtons = Array.from(document.querySelectorAll('.whatsapp-float'));
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    floatButtons.forEach(button => {
      button.style.opacity = current > 200 ? '1' : '0.7';
      button.style.transform = current > lastScroll && current > 400 ? 'scale(0.85)' : 'scale(1)';
    });
    lastScroll = current;
  }, { passive: true });

  floatButtons.forEach(button => {
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let moved = false;
    let suppressClick = false;

    button.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      const rect = button.getBoundingClientRect();
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      startLeft = rect.left;
      startTop = rect.top;
      moved = false;
      button.setPointerCapture(pointerId);
    });

    button.addEventListener('pointermove', event => {
      if (event.pointerId !== pointerId) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      if (!moved && Math.hypot(deltaX, deltaY) < 5) return;
      moved = true;
      const rect = button.getBoundingClientRect();
      const margin = 8;
      const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
      const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
      const left = Math.max(margin, Math.min(maxLeft, startLeft + deltaX));
      const top = Math.max(margin, Math.min(maxTop, startTop + deltaY));
      button.style.left = `${left}px`;
      button.style.top = `${top}px`;
      button.style.right = 'auto';
      button.style.bottom = 'auto';
      button.dataset.dragged = 'true';
      button.classList.add('is-dragging');
    });

    const finishDrag = event => {
      if (event.pointerId !== pointerId) return;
      if (button.hasPointerCapture(pointerId)) button.releasePointerCapture(pointerId);
      pointerId = null;
      button.classList.remove('is-dragging');
      if (moved) {
        suppressClick = true;
        window.setTimeout(() => { suppressClick = false; }, 500);
      }
    };

    button.addEventListener('pointerup', finishDrag);
    button.addEventListener('pointercancel', finishDrag);
    button.addEventListener('click', event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClick = false;
    }, true);
  });

  window.addEventListener('resize', () => {
    floatButtons.forEach(button => {
      if (!button.dataset.dragged) return;
      const rect = button.getBoundingClientRect();
      button.style.left = `${Math.max(0, Math.min(window.innerWidth - rect.width, rect.left))}px`;
      button.style.top = `${Math.max(0, Math.min(window.innerHeight - rect.height, rect.top))}px`;
    });
  });
})();
