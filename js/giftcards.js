(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('giftCardForm');
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const fields = new FormData(form);
      const central = String(fields.get('central') || 'central1');
      const message = [
        'Solicitud de Gift Card — Masajes Triny Delivery',
        `De: ${String(fields.get('sender') || '').trim()}`,
        `Para: ${String(fields.get('recipient') || '').trim()}`,
        `Servicio o importe deseado: ${String(fields.get('gift') || '').trim()}`,
        `Mensaje: ${String(fields.get('message') || '').trim() || 'Sin mensaje personalizado'}`,
        'Solicito información sobre precio, vigencia y condiciones. No se ha realizado ningún pago.'
      ].join('\n');
      const href = window.WA.link(message, central);
      const link = document.createElement('a');
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.hidden = true;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.showToast?.('Continúa por WhatsApp', 'La Gift Card no se ha comprado ni pagado desde esta página.', 'info', 6000);
    });
  });
})();
