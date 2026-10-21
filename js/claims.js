(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('claimsForm');
    if (!form) return;
    const date = form.elements.claimDate;
    const today = new Date();
    date.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const centralKey = String(data.get('central')) === 'central2' ? 'central2' : 'central1';
      const central = window.TRINY_CONFIG.contacts[centralKey];
      const message = [
        'Borrador de reclamo o queja — Masajes Triny Delivery',
        `Consumidor: ${String(data.get('claimant')).trim()}`,
        `Tipo y número de documento: ${String(data.get('documentType'))} ${String(data.get('documentNumber')).trim()}`,
        `Domicilio: ${String(data.get('claimantAddress')).trim()}`,
        `Teléfono: ${String(data.get('claimantPhone')).trim()}`,
        `Correo: ${String(data.get('claimantEmail')).trim()}`,
        `Representante: ${String(data.get('representative') || '').trim() || 'No indicado'}`,
        `Bien contratado: ${String(data.get('goodType'))}`,
        `Servicio: ${String(data.get('service')).trim()}`,
        `Monto reclamado: ${String(data.get('claimAmount') || '').trim() ? `S/ ${String(data.get('claimAmount')).trim()}` : 'No indicado'}`,
        `Tipo: ${String(data.get('claimType'))}`,
        `Detalle: ${String(data.get('detail')).trim()}`,
        `Pedido: ${String(data.get('request')).trim()}`,
        `Firma del consumidor: ${String(data.get('consumerSignature')).trim()}`,
        `Fecha: ${String(data.get('claimDate'))}`,
        'Fecha de comunicación de respuesta: La registra el proveedor al atender el reclamo.',
        '',
        'Este borrador lo preparó el usuario en su dispositivo. El sitio no almacena los datos ni registra formalmente la reclamación. La apertura de WhatsApp no acredita envío o recepción.'
      ].join('\n');
      const link = document.createElement('a');
      link.href = `https://wa.me/${central.phone}?text=${encodeURIComponent(message)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.hidden = true;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.showToast?.('Borrador preparado', 'Revisa y decide si deseas enviar el mensaje en WhatsApp. No se ha registrado una reclamación en este sitio.', 'info', 7000);
    });
  });
})();
