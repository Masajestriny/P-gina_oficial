// ============================================================
//  TRINY MASAJES — WhatsApp Module
//  Official WhatsApp Number: 986820428 (+51 986 820 428)
// ============================================================

(function() {
  const WA_NUMBER = '51986820428';

  function buildWALink(message) {
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  window.WA = {
    number: WA_NUMBER,
    displayNumber: '+51 986 820 428',
    link: buildWALink,
    bookService: (serviceName) => buildWALink(
      `¡Hola Triny Masajes! 🌿 Me gustaría reservar una cita para *${serviceName}*. ¿Cuál es la disponibilidad?`
    ),
    generalInfo: () => buildWALink(
      '¡Hola Triny Masajes! 🌿 Me interesa conocer más sobre los servicios y promociones de masajes.'
    ),
    claimPrize: (prize) => buildWALink(
      `¡Hola! 🎉 Acabo de ganar *${prize}* en la ruleta de Triny Masajes. ¿Cómo puedo reclamarlo?`
    ),
    supportChat: () => buildWALink(
      '¡Hola Atención al Cliente! 🎧 Tengo una consulta sobre un servicio / reserva.'
    )
  };

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

  console.log('[Triny Masajes] WhatsApp module updated with 986820428 ✓');
})();
