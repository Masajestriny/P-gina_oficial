(function() {
  'use strict';

  window.submitSupportForm = function(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const read = selector => form.querySelector(selector)?.value?.trim() || '';
    const isInline = form.id === 'supportFormInline';
    const name = read(isInline ? '#supName' : '#modalSupName');
    const phone = read(isInline ? '#supPhone' : '#modalSupPhone');
    const email = read(isInline ? '#supEmail' : '#modalSupEmail');
    const subject = read('#supSubject') || 'Consulta general';
    const message = read(isInline ? '#supMessage' : '#modalSupMsg');
    const phoneDigits = phone.replace(/\D/g, '');

    if (!name || !message || phoneDigits.length < 9 || phoneDigits.length > 15) {
      window.showToast?.('Revisa tus datos', 'Ingresa nombre, mensaje y un teléfono válido.', 'warning');
      return;
    }

    const text = [
      'Consulta para Masajes Triny Delivery',
      `Nombre: ${name}`,
      `WhatsApp de contacto: ${phone}`,
      email ? `Correo: ${email}` : '',
      `Tema: ${subject}`,
      `Mensaje: ${message}`
    ].filter(Boolean).join('\n');
    const href = window.WA?.link(text, 'central1');
    if (!href) {
      window.showToast?.('No se pudo abrir WhatsApp', 'Inténtalo nuevamente o utiliza los enlaces de las centrales.', 'error');
      return;
    }

    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.showToast?.('Continúa en WhatsApp', 'Revisa el mensaje y envíalo desde WhatsApp. La página no ha registrado tu consulta.', 'info', 6000);
  };
})();
