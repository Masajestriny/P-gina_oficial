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

  function describeCart() {
    return window.TrinyCart.getItems().map(item =>
      `• ${item.name} × ${item.quantity}${item.type === 'package' ? ` paquete(s), ${item.sessions} sesiones incluidas` : ` sesión(es)`} — S/ ${item.lineTotal} estimado`
    ).join('\n');
  }

  window.sendCartOrder = function(centralId) {
    const form = document.getElementById('cartOrderForm');
    if (!form?.reportValidity()) return;
    const items = window.TrinyCart.getItems();
    if (!items.length) {
      window.showToast?.('Carrito vacío', 'Agrega un servicio o paquete para preparar el pedido.', 'warning');
      return;
    }
    const data = new FormData(form);
    const message = [
      'Solicitud de pedido — Masajes Triny Delivery',
      `Nombre: ${String(data.get('name')).trim()}`,
      `Teléfono: ${String(data.get('phone')).trim()}`,
      `Distrito o localidad: ${String(data.get('location')).trim()}`,
      `Dirección: ${String(data.get('address')).trim()}`,
      'Servicios y paquetes solicitados:',
      describeCart(),
      `Total referencial: S/ ${window.TrinyCart.getTotals().amount}. Confirmar precios, cobertura y disponibilidad con la central.`,
      'Este mensaje es un borrador que revisaré y enviaré personalmente. No es una reserva confirmada ni un pago.'
    ].join('\n');
    openWhatsAppDraft(message, centralId);
  };

  window.sendCartList = function(centralId) {
    const items = window.TrinyCart.getItems();
    if (!items.length) {
      window.showToast?.('Carrito vacío', 'Agrega un servicio o paquete para preparar la lista.', 'warning');
      return;
    }
    const message = [
      'Consulta por servicios y paquetes — Masajes Triny Delivery',
      describeCart(),
      'Quisiera consultar disponibilidad y coordinación. La central puede solicitarme los datos necesarios.',
      'Borrador para revisar y enviar personalmente; no confirma recepción, reserva ni pago.'
    ].join('\n');
    openWhatsAppDraft(message, centralId);
  };
})();
