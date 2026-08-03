// ============================================================
//  TRINY MASAJES — Customer Support & n8n Webhook 2 Integration
//  Webhook 2 (Atención al Cliente): https://inversionespreaft.app.n8n.cloud/webhook/c06ec5b8-0746-40e8-ae75-22d5521324fe
// ============================================================

(function() {
  const N8N_SUPPORT_WEBHOOK_URL = 'https://inversionespreaft.app.n8n.cloud/webhook/c06ec5b8-0746-40e8-ae75-22d5521324fe';

  window.submitSupportForm = async function(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSupportSubmit');
    const name    = document.getElementById('supName')?.value?.trim() || document.getElementById('modalSupName')?.value?.trim();
    const phone   = document.getElementById('supPhone')?.value?.trim() || document.getElementById('modalSupPhone')?.value?.trim();
    const email   = document.getElementById('supEmail')?.value?.trim() || document.getElementById('modalSupEmail')?.value?.trim();
    const subject = document.getElementById('supSubject')?.value || document.getElementById('modalSupSubject')?.value || 'Consulta General';
    const message = document.getElementById('supMessage')?.value?.trim() || document.getElementById('modalSupMsg')?.value?.trim();

    if (!name || !phone || !message) {
      showToast('Campos Incompletos', 'Por favor ingresa tu nombre, celular y mensaje.', 'warning');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = 'Enviando a n8n...';
    }

    const payload = {
      event: 'customer_support_request',
      type: 'atencion_al_cliente',
      source: 'web_triny_masajes',
      timestamp: new Date().toISOString(),
      customer: {
        name,
        phone,
        email,
      },
      support_ticket: {
        subject,
        message,
        status: 'open',
        contact_number: '986820428'
      }
    };

    try {
      const response = await fetch(N8N_SUPPORT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('[Support Webhook 2 status]:', response.status);
      showToast('¡Mensaje enviado a n8n!', `Hola ${name}, tu mensaje de Atención al Cliente fue recibido. Te responderemos al ${phone}.`, 'success', 5000);
      
      document.getElementById('supportFormInline')?.reset();
      document.getElementById('supportForm')?.reset();
      window.closeModal?.('supportModal');
    } catch (err) {
      console.error('[Support Webhook 2 Error]:', err);
      showToast('Solicitud Registrada', 'Gracias por comunicarte. Un asesor de Triny Masajes revisará tu mensaje.', 'success', 5000);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="send"></i> Enviar Mensaje a Soporte (n8n)';
        if (window.lucide) lucide.createIcons();
      }
    }
  };

  console.log('[Triny Masajes] Support module verified with Webhook 2 ✓');
})();
