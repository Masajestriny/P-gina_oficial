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
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="sn-link">
        <span class="sn-name">${item.label}</span>
      </a>
    `).join('');
    const footerSocials = document.getElementById('footerSocialLinks');
    if (footerSocials) footerSocials.innerHTML = socialMarkup;
    const headerSocials = document.getElementById('headerSocialLinks');
    if (headerSocials) headerSocials.innerHTML = socialMarkup;
  }

  document.addEventListener('DOMContentLoaded', configureContactLinks);

  let lastScroll = 0;
  const floatBtn = document.getElementById('whatsappFloat');
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (floatBtn) {
      floatBtn.style.opacity = current > 200 ? '1' : '0.7';
      floatBtn.style.transform = current > lastScroll && current > 400 ? 'scale(0.85)' : 'scale(1)';
    }
    lastScroll = current;
  }, { passive: true });
})();
