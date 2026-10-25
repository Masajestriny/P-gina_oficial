(function() {
  'use strict';

  function centralDetails(centralId) {
    const key = centralId === 'central2' ? 'central2' : 'central1';
    return window.TRINY_CONFIG.contacts[key];
  }

  function openWhatsAppDraft(message, centralId) {
    const central = centralDetails(centralId);
    const link = document.createElement('a');
    link.href = `https://wa.me/${central.phone}?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Abrir borrador de WhatsApp para ${central.label}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.showToast?.('Borrador preparado', 'Revisa el mensaje en WhatsApp. Este sitio no confirma recepción ni reserva.', 'info', 6000);
  }

  function getCartDuration(items) {
    let totalMinutes = 0;
    let hasUnknownDuration = false;

    items.forEach(item => {
      const match = String(item.duration || '').match(/(\d+)\s*(min(?:utos?)?|h(?:ora)?s?)/i);
      if (!match) {
        hasUnknownDuration = true;
        return;
      }
      const unitMinutes = /^h/i.test(match[2]) ? 60 : 1;
      totalMinutes += Number(match[1]) * unitMinutes * (item.sessions || item.quantity);
    });

    if (hasUnknownDuration) return 'Por confirmar según la duración de los paquetes seleccionados';
    if (!totalMinutes) return 'Por confirmar';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return [hours ? `${hours} h` : '', minutes ? `${minutes} min` : '']
      .filter(Boolean)
      .join(' ');
  }

  function getCentralId(selectorOrId) {
    if (selectorOrId === 'central2' || selectorOrId === 'central1') return selectorOrId;
    return document.getElementById(selectorOrId)?.value === 'central2' ? 'central2' : 'central1';
  }

  window.sendCartList = function(selectorOrId) {
    const items = window.TrinyCart.getItems();
    if (!items.length) {
      window.showToast?.('Carrito vacío', 'Agrega un servicio o paquete para preparar la lista.', 'warning');
      return;
    }

    const message = [
      'Hola, Triny Masajes Delivery. Quisiera consultar por los siguientes servicios o paquetes:',
      '',
      '*MI SELECCIÓN*',
      ...items.map(item => {
        const quantity = item.type === 'package'
          ? `${item.quantity} paquete(s), ${item.sessions} sesiones incluidas`
          : `${item.quantity} ${item.quantity === 1 ? 'sesión' : 'sesiones'}`;
        return `- ${item.name}: ${quantity} — S/ ${item.priceNum} c/u — Subtotal S/ ${item.lineTotal}`;
      }),
      `*Total estimado:* S/ ${window.TrinyCart.getTotals().amount}`,
      '',
      `*Duración estimada:* ${getCartDuration(items)}.`,
      'Por favor, confirmen precios y condiciones. Este mensaje es una consulta; no constituye una reserva ni un pago.'
    ].join('\n');

    openWhatsAppDraft(message, getCentralId(selectorOrId));
  };

  window.sendCartOrder = window.sendCartList;
})();
