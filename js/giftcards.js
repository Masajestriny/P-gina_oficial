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
        'Consulta por Gift Card — Masajes Triny Delivery',
        `Nombre de quien regala: ${String(fields.get('sender') || '').trim()}`,
        `Nombre de quien recibe: ${String(fields.get('recipient') || '').trim()}`,
        `Servicio o importe deseado: ${String(fields.get('gift') || '').trim()}`,
        `Mensaje: ${String(fields.get('message') || '').trim() || 'Sin mensaje adicional.'}`,
        'Quisiera consultar el precio, la vigencia y las condiciones. Esta solicitud no confirma una compra ni un pago.'
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
      window.showToast?.('Continúa por WhatsApp', 'Revisa y envía el borrador. La Gift Card no se ha comprado ni pagado desde esta página.', 'info', 6000);
    });
  });
})();
