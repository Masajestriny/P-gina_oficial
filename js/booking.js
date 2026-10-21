(function() {
  'use strict';

  const MAX_MESSAGE_LENGTH = 1500;
  const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
  let submitting = false;
  let bookingState = createInitialState();

  function createInitialState() {
    return {
      step: 1,
      date: '',
      time: '',
      client: {},
      submitted: null,
      calendarYear: new Date().getFullYear(),
      calendarMonth: new Date().getMonth()
    };
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function currentItems() {
    return window.TrinyCart ? window.TrinyCart.getItems() : [];
  }

  function renderStep() {
    const container = document.getElementById('bookingStepContent');
    if (!container) return;
    document.querySelectorAll('.booking-step').forEach((step, index) => {
      step.classList.toggle('active', index + 1 === bookingState.step);
      step.classList.toggle('done', index + 1 < bookingState.step);
    });
    const renderers = [renderServicesStep, renderDateStep, renderClientStep, renderReviewStep];
    container.innerHTML = renderers[bookingState.step - 1]();
    if (bookingState.step === 3) initLocationControls();
  }

  function renderServicesStep() {
    const lines = currentItems();
    return `
      <h3 class="booking-step-title">1. Servicios y paquetes elegidos</h3>
      ${lines.length ? `
        <ul class="booking-selected-items">
          ${lines.map(line => `<li>${escapeHTML(line.name)} × ${line.quantity} — S/ ${line.lineTotal} estimado (${line.sessions} sesiones incluidas)</li>`).join('')}
        </ul>
        <p>El importe es referencial y será revisado por la central. Puedes ajustar cantidades en el <a href="#carrito">carrito</a>.</p>
      ` : '<p>Agrega al menos un servicio o paquete antes de continuar.</p>'}
      <div class="booking-nav">
        <a class="btn btn-secondary" href="#servicios">Ver servicios</a>
        <button type="button" class="btn btn-primary" onclick="bookingNext()" ${lines.length ? '' : 'disabled'}>Siguiente: horario preferido</button>
      </div>
    `;
  }

  function renderDateStep() {
    const year = bookingState.calendarYear;
    const month = bookingState.calendarMonth;
    return `
      <h3 class="booking-step-title">2. Fecha y hora preferidas</h3>
      <p>Elige una preferencia de horario. No se muestra disponibilidad en tiempo real y esta selección no confirma la cita.</p>
      <div class="cal-nav">
        <button type="button" class="btn btn-secondary" onclick="calNav(-1)" aria-label="Mes anterior">‹</button>
        <strong>${MONTHS[month]} ${year}</strong>
        <button type="button" class="btn btn-secondary" onclick="calNav(1)" aria-label="Mes siguiente">›</button>
      </div>
      <div class="calendar-grid" id="calendarGrid" role="group" aria-label="Selecciona la fecha preferida">
        ${DAYS.map(day => `<span class="cal-header">${day}</span>`).join('')}
        ${renderCalendarDays()}
      </div>
      <div class="form-row booking-preference">
        <label class="form-group" for="bkTime">Hora preferida
          <select id="bkTime">
            <option value="">Selecciona una hora</option>
            ${Array.from({ length: 13 }, (_, index) => index + 9).map(hour => {
              const value = `${String(hour).padStart(2, '0')}:00`;
              return `<option value="${value}" ${bookingState.time === value ? 'selected' : ''}>${value}</option>`;
            }).join('')}
          </select>
        </label>
        <p class="availability-note">El equipo debe revisar y confirmar la fecha y hora solicitadas.</p>
      </div>
      <div class="booking-nav">
        <button type="button" class="btn btn-secondary" onclick="bookingBack()">Atrás</button>
        <button type="button" class="btn btn-primary" onclick="bookingNext()" ${bookingState.date && bookingState.time ? '' : 'disabled'} id="bkNextDate">Siguiente: datos y ubicación</button>
      </div>
    `;
  }

  function renderCalendarDays() {
    const year = bookingState.calendarYear;
    const month = bookingState.calendarMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayFloor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let html = '';
    for (let index = 0; index < firstDay; index++) html += '<span class="cal-day empty" aria-hidden="true"></span>';
    for (let day = 1; day <= daysInMonth; day++) {
      const value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const date = new Date(year, month, day);
      const disabled = date < todayFloor;
      html += `<button type="button" class="cal-day${bookingState.date === value ? ' selected' : ''}${disabled ? ' disabled' : ''}" ${disabled ? 'disabled' : `onclick="selectDate('${value}')"`} aria-pressed="${bookingState.date === value}">${day}</button>`;
    }
    return html;
  }

  function renderClientStep() {
    const client = bookingState.client;
    const zones = `
      <option value="">Selecciona zona</option>
      <option value="lima" ${client.zone === 'lima' ? 'selected' : ''}>Distritos de Lima</option>
      <option value="playas" ${client.zone === 'playas' ? 'selected' : ''}>Playas del sur y condominios de Asia</option>
      <option value="other" ${client.zone === 'other' ? 'selected' : ''}>Otra ubicación (evaluar cobertura)</option>
    `;
    return `
      <h3 class="booking-step-title">3. Datos del cliente y ubicación</h3>
      <div class="form-row">
        <label class="form-group">Nombres<input id="bkFirstName" autocomplete="given-name" maxlength="80" required value="${escapeHTML(client.firstName)}" /></label>
        <label class="form-group">Apellidos<input id="bkLastName" autocomplete="family-name" maxlength="80" required value="${escapeHTML(client.lastName)}" /></label>
      </div>
      <label class="form-group">WhatsApp de contacto<input id="bkPhone" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" required value="${escapeHTML(client.phone)}" placeholder="9 dígitos o número internacional" /></label>
      <div class="form-row">
        <label class="form-group">Zona
          <select id="bkZone">${zones}</select>
        </label>
        <label class="form-group" id="bkSubzoneWrap" hidden>Distrito / localidad
          <select id="bkSubzone"></select>
        </label>
      </div>
      <label class="form-group" id="bkDistrictWrap" hidden>Distrito, playa o condominio
        <select id="bkDistrict"></select>
      </label>
      <label class="form-group" id="bkOtherLocationWrap" hidden>Indica tu ubicación
        <input id="bkOtherLocation" maxlength="140" value="${escapeHTML(client.otherLocation)}" />
      </label>
      <label class="form-group">Dirección completa<input id="bkAddress" autocomplete="street-address" maxlength="220" required value="${escapeHTML(client.address)}" /></label>
      <label class="form-group">Referencia (opcional)<input id="bkReference" maxlength="180" value="${escapeHTML(client.reference)}" /></label>
      <label class="form-group">Observaciones (opcional)<textarea id="bkNotes" rows="3" maxlength="400">${escapeHTML(client.notes)}</textarea></label>
      <label class="consent-check"><input id="bkSpaceConsent" type="checkbox" ${client.spaceConsent ? 'checked' : ''} required /> Confirmo que dispongo de espacio suficiente para la camilla (2 × 2 metros).</label>
      <label class="consent-check"><input id="bkContactConsent" type="checkbox" ${client.contactConsent ? 'checked' : ''} required /> Autorizo que Triny se comunique conmigo por WhatsApp para coordinar mi solicitud de reserva.</label>
      <p class="privacy-reference">Consulta el <a href="#privacidad" target="_blank">aviso de privacidad (borrador pendiente de validación)</a>.</p>
      <div class="booking-nav">
        <button type="button" class="btn btn-secondary" onclick="bookingBack()">Atrás</button>
        <button type="button" class="btn btn-primary" onclick="bookingNext()">Revisar solicitud</button>
      </div>
    `;
  }

  function renderReviewStep() {
    const lines = currentItems();
    const total = window.TrinyCart?.getTotals();
    const client = bookingState.client;
    const central = client.central === 'central2' ? 'Central 2' : 'Central 1';
    if (bookingState.submitted) {
      const links = ['central1', 'central2'].map(key => {
        const contact = window.TRINY_CONFIG.contacts[key];
        const message = buildWhatsAppMessage();
        return `<a class="btn btn-hero-wa" href="https://wa.me/${contact.phone}?text=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer">Continuar por WhatsApp · ${contact.label}</a>`;
      }).join('');
      return `
        <div class="booking-confirm-card">
          <h3>Solicitud recibida, pendiente de confirmación</h3>
          <p>La respuesta del servicio indicó que el registro fue aceptado. El equipo debe revisar horario y cobertura antes de confirmar.</p>
          <div class="booking-summary">${renderSummary(lines, total, client)}</div>
          <div class="booking-nav">${links}</div>
          <button type="button" class="btn btn-secondary" onclick="resetBooking()">Finalizar</button>
        </div>
      `;
    }
    return `
      <h3 class="booking-step-title">4. Revisa y envía tu solicitud</h3>
      <p class="booking-summary">${renderSummary(lines, total, client)}</p>
      <label class="form-group">Central de atención
        <select id="bkCentral">
          <option value="central1" ${client.central !== 'central2' ? 'selected' : ''}>Central 1 · ${window.TRINY_CONFIG.contacts.central1.display}</option>
          <option value="central2" ${client.central === 'central2' ? 'selected' : ''}>Central 2 · ${window.TRINY_CONFIG.contacts.central2.display}</option>
        </select>
      </label>
      <p class="availability-note">El envío registra una solicitud pendiente si el servicio responde afirmativamente. No confirma disponibilidad ni genera un pago.</p>
      <div id="bookingError" class="booking-error" role="alert" hidden></div>
      <div class="booking-nav">
        <button type="button" class="btn btn-secondary" onclick="bookingBack()">Atrás y editar</button>
        <button type="button" class="btn btn-primary" id="btnConfirmBooking" onclick="bookingSubmit()" ${submitting ? 'disabled' : ''}>Enviar solicitud</button>
      </div>
    `;
  }

  function renderSummary(lines, total, client) {
    return `
      <h4>Resumen</h4>
      <p><strong>Cliente:</strong> ${escapeHTML(`${client.firstName} ${client.lastName}`)}</p>
      <p><strong>WhatsApp:</strong> ${escapeHTML(client.phone)}</p>
      <p><strong>Ubicación:</strong> ${escapeHTML(client.location || '')} · ${escapeHTML(client.address || '')}</p>
      ${client.reference ? `<p><strong>Referencia:</strong> ${escapeHTML(client.reference)}</p>` : ''}
      <p><strong>Fecha y hora preferidas:</strong> ${escapeHTML(bookingState.date)} · ${escapeHTML(bookingState.time)}</p>
      <ul>${lines.map(line => `<li>${escapeHTML(line.name)} — S/ ${line.priceNum} por ${line.type === 'package' ? 'paquete' : 'sesión'} × ${line.quantity} ${line.type === 'package' ? `paquete(s), ${line.sessions} sesiones incluidas` : 'sesión(es)'} = S/ ${line.lineTotal} estimado</li>`).join('')}</ul>
      <p><strong>Total estimado:</strong> S/ ${total?.amount || 0}</p>
      <p>Confirmaciones obligatorias: espacio para camilla y autorización de contacto por WhatsApp aceptadas.</p>
    `;
  }

  function captureClientFields() {
    const previousClient = bookingState.client;
    const zone = document.getElementById('bkZone')?.value || '';
    const subzone = document.getElementById('bkSubzone')?.value || '';
    const district = document.getElementById('bkDistrict')?.value || '';
    const otherLocation = document.getElementById('bkOtherLocation')?.value?.trim() || '';
    let location = district;
    let apiDistrict = district;
    let registrable = false;

    if (zone === 'lima') {
      const selected = window.TRINY_CONFIG.coverage.lima.find(option => option.label === district);
      apiDistrict = selected?.apiDistrict || '';
      location = district;
      registrable = window.TRINY_CONFIG.coverage.appsScriptDistricts.includes(apiDistrict);
    } else if (zone === 'playas') {
      location = [subzone, district].filter(Boolean).join(' — ');
    } else if (zone === 'other') {
      location = otherLocation;
    }

    bookingState.client = {
      firstName: document.getElementById('bkFirstName')?.value?.trim() || '',
      lastName: document.getElementById('bkLastName')?.value?.trim() || '',
      phone: document.getElementById('bkPhone')?.value?.trim() || '',
      zone,
      subzone,
      district,
      otherLocation,
      location,
      apiDistrict,
      registrable,
      address: document.getElementById('bkAddress')?.value?.trim() || '',
      reference: document.getElementById('bkReference')?.value?.trim() || '',
      notes: document.getElementById('bkNotes')?.value?.trim() || '',
      spaceConsent: document.getElementById('bkSpaceConsent')?.checked || false,
      contactConsent: document.getElementById('bkContactConsent')?.checked || false,
      spaceConsentAt: document.getElementById('bkSpaceConsent')?.checked ? (previousClient.spaceConsentAt || new Date().toISOString()) : '',
      contactConsentAt: document.getElementById('bkContactConsent')?.checked ? (previousClient.contactConsentAt || new Date().toISOString()) : '',
      central: document.getElementById('bkCentral')?.value || bookingState.client.central || 'central1'
    };
  }

  function initLocationControls() {
    const zone = document.getElementById('bkZone');
    const subzone = document.getElementById('bkSubzone');
    if (!zone || !subzone) return;
    zone.addEventListener('change', () => updateLocationOptions());
    subzone.addEventListener('change', () => updateLocationOptions());
    updateLocationOptions();
    if (bookingState.client.district) {
      const district = document.getElementById('bkDistrict');
      if (district) district.value = bookingState.client.district;
    }
  }

  function updateLocationOptions() {
    const zone = document.getElementById('bkZone')?.value || '';
    const subzoneWrap = document.getElementById('bkSubzoneWrap');
    const districtWrap = document.getElementById('bkDistrictWrap');
    const otherWrap = document.getElementById('bkOtherLocationWrap');
    const subzone = document.getElementById('bkSubzone');
    const district = document.getElementById('bkDistrict');
    if (!subzoneWrap || !districtWrap || !otherWrap || !subzone || !district) return;

    subzoneWrap.hidden = zone !== 'playas';
    districtWrap.hidden = zone === '' || zone === 'other';
    otherWrap.hidden = zone !== 'other';

    if (zone === 'lima') {
      subzone.innerHTML = '';
      district.innerHTML = `<option value="">Selecciona distrito</option>${window.TRINY_CONFIG.coverage.lima.map(item => `<option value="${escapeHTML(item.label)}">${escapeHTML(item.label)}</option>`).join('')}`;
    } else if (zone === 'playas') {
      const groups = window.TRINY_CONFIG.coverage.playas;
      const groupNames = Object.keys(groups);
      const preferredGroup = subzone.value || bookingState.client.subzone;
      const selectedGroup = groupNames.includes(preferredGroup) ? preferredGroup : groupNames[0];
      subzone.innerHTML = groupNames.map(group => `<option value="${escapeHTML(group)}" ${group === selectedGroup ? 'selected' : ''}>${escapeHTML(group)}</option>`).join('');
      district.innerHTML = `<option value="">Selecciona playa o condominio</option>${(groups[selectedGroup] || []).map(place => `<option value="${escapeHTML(place)}">${escapeHTML(place)}</option>`).join('')}`;
      if (bookingState.client.subzone === selectedGroup) district.value = bookingState.client.district || '';
    } else {
      subzone.innerHTML = '';
      district.innerHTML = '<option value="">Selecciona ubicación</option>';
    }
  }

  function buildWhatsAppMessage() {
    const client = bookingState.client;
    const lines = currentItems();
    const itemsText = lines.map(line => `- ${line.name} x ${line.quantity} (${line.sessions} sesiones incluidas; S/ ${line.lineTotal} estimado)`).join('\n');
    return [
      'Solicitud de reserva — Masajes Triny Delivery',
      `Cliente: ${client.firstName} ${client.lastName}`,
      `WhatsApp: ${client.phone}`,
      `Ubicación: ${client.location}`,
      `Dirección: ${client.address}`,
      `Referencia: ${client.reference || 'No indicada'}`,
      `Fecha/hora preferida: ${bookingState.date} ${bookingState.time}`,
      'Servicios:',
      itemsText,
      `Total estimado, sujeto a confirmación: S/ ${window.TrinyCart?.getTotals().amount || 0}`,
      `Observaciones: ${client.notes || 'Ninguna'}`,
      'Solicitud pendiente de confirmación.'
    ].join('\n');
  }

  function updateDateButton() {
    const button = document.getElementById('bkNextDate');
    const time = document.getElementById('bkTime')?.value || '';
    bookingState.time = time;
    if (button) button.disabled = !bookingState.date || !bookingState.time;
  }

  window.startBookingFromCart = function() {
    bookingState = createInitialState();
    if (currentItems().length === 0) {
      window.showToast?.('Carrito vacío', 'Podrás continuar después de agregar servicios o paquetes desde el catálogo.', 'info');
    }
    const cartDrawer = document.getElementById('cartDrawer');
    if (cartDrawer && !cartDrawer.hidden) window.TrinyDrawers?.close('cartDrawer');
    renderStep();
    window.TrinyDrawers?.open('bookingDrawer');
  };

  window.calNav = function(direction) {
    const date = new Date(bookingState.calendarYear, bookingState.calendarMonth + direction, 1);
    const today = new Date();
    if (date.getFullYear() < today.getFullYear() || (date.getFullYear() === today.getFullYear() && date.getMonth() < today.getMonth())) return;
    bookingState.calendarYear = date.getFullYear();
    bookingState.calendarMonth = date.getMonth();
    renderStep();
  };

  window.selectDate = function(value) {
    bookingState.date = value;
    renderStep();
  };

  window.bookingNext = function() {
    if (bookingState.step === 2) {
      updateDateButton();
      const date = new Date(`${bookingState.date}T00:00:00`);
      const today = new Date();
      const todayFloor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (!bookingState.date || Number.isNaN(date.getTime()) || date < todayFloor || !/^(0[9]|1\d|2[01]):00$/.test(bookingState.time)) {
        window.showToast?.('Elige fecha y hora', 'Selecciona tus preferencias antes de continuar.', 'warning');
        return;
      }
    }
    if (bookingState.step === 3) {
      captureClientFields();
      const client = bookingState.client;
      const phoneDigits = client.phone.replace(/\D/g, '');
      const missingSpecificLocation = client.zone === 'playas' ? !client.district : client.zone === 'other' ? !client.otherLocation : false;
      if (!client.firstName || !client.lastName || phoneDigits.length < 9 || phoneDigits.length > 15 || !client.zone || !client.location || !client.address || missingSpecificLocation) {
        window.showToast?.('Revisa tus datos', 'Completa los datos obligatorios y una ubicación válida.', 'warning');
        return;
      }
      if (!client.spaceConsent || !client.contactConsent) {
        window.showToast?.('Faltan confirmaciones', 'Debes aceptar las dos confirmaciones obligatorias para continuar.', 'warning');
        return;
      }
      bookingState.client = client;
    }
    if (bookingState.step < 4) {
      bookingState.step++;
      renderStep();
      document.querySelector('#bookingDrawer .drawer-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  window.bookingBack = function() {
    if (bookingState.step > 1) {
      if (bookingState.step === 4) {
        bookingState.client.central = document.getElementById('bkCentral')?.value || bookingState.client.central;
      }
      bookingState.step--;
      renderStep();
    }
  };

  window.bookingSubmit = async function() {
    if (submitting || bookingState.submitted) return;
    const errorBox = document.getElementById('bookingError');
    const button = document.getElementById('btnConfirmBooking');
    const phoneDigits = String(bookingState.client.phone || '').replace(/\D/g, '');
    const preferredDate = new Date(`${bookingState.date}T00:00:00`);
    const currentDate = new Date();
    const currentDateFloor = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    if (!bookingState.date || Number.isNaN(preferredDate.getTime()) || preferredDate < currentDateFloor ||
        !/^(0[9]|1\d|2[01]):00$/.test(bookingState.time) ||
        phoneDigits.length < 9 || phoneDigits.length > 15 ||
        !bookingState.client.spaceConsent || !bookingState.client.contactConsent) {
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = 'Revisa la fecha, hora, teléfono y confirmaciones obligatorias antes de enviar.';
      }
      return;
    }
    if (!bookingState.client.registrable) {
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = 'La ubicación seleccionada no está entre los distritos configurados para registro en Apps Script. No se envió ni se registró la solicitud. Contacta una central para evaluar cobertura.';
      }
      return;
    }
    const district = bookingState.client.apiDistrict;
    if (!window.TRINY_CONFIG.coverage.appsScriptDistricts.includes(district)) {
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = 'El servicio de registro no tiene este distrito habilitado. No se envió la solicitud.';
      }
      return;
    }

    const fullName = `${bookingState.client.firstName} ${bookingState.client.lastName}`.trim();
    const items = currentItems();
    if (!items.length) {
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = 'El carrito está vacío. Agrega servicios y vuelve a revisar la solicitud.';
      }
      return;
    }
    const message = [
      `Solicitud web pendiente. Preferencia de horario: ${bookingState.time}.`,
      `Ubicación: ${bookingState.client.location}. Dirección: ${bookingState.client.address}.`,
      `Referencia: ${bookingState.client.reference || 'No indicada'}.`,
      `Servicios solicitados: ${items.map(item => `${item.name} x${item.quantity} (${item.sessions} sesiones incluidas)`).join('; ')}.`,
      `Importe referencial, no validado por servidor: S/ ${window.TrinyCart.getTotals().amount}.`,
      `Observaciones: ${bookingState.client.notes || 'Ninguna'}.`,
      `Aceptación del espacio para camilla: ${bookingState.client.spaceConsentAt}.`,
      `Aceptación de contacto por WhatsApp: ${bookingState.client.contactConsentAt}.`
    ].join(' ');
    if (message.length > MAX_MESSAGE_LENGTH) {
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = 'El resumen de la solicitud excede el límite admitido. Reduce las observaciones o la cantidad de líneas del carrito.';
      }
      return;
    }

    const payload = {
      district,
      date: bookingState.date,
      time: bookingState.time,
      duration: 1,
      name: fullName,
      phone: bookingState.client.phone,
      message
    };

    submitting = true;
    if (button) {
      button.disabled = true;
      button.textContent = 'Enviando solicitud…';
    }
    if (errorBox) errorBox.hidden = true;

    try {
      const response = await fetch(window.TRINY_CONFIG.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });
      if (!response.ok) throw new Error(`El servidor respondió HTTP ${response.status}.`);
      const result = await response.json();
      if (result.ok !== true && result.success !== true) {
        throw new Error('El servidor no confirmó que la solicitud fue registrada.');
      }
      bookingState.client.central = document.getElementById('bkCentral')?.value || 'central1';
      bookingState.submitted = result;
      renderStep();
    } catch (error) {
      console.error('[Booking] Falló el registro de la solicitud:', error);
      submitting = false;
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = 'No se pudo verificar el registro de tu solicitud. No se mostrará como recibida. Inténtalo nuevamente o comunícate con Triny por WhatsApp.';
      }
      if (button) {
        button.disabled = false;
        button.textContent = 'Reintentar envío';
      }
    } finally {
      if (bookingState.submitted) submitting = false;
    }
  };

  window.resetBooking = function() {
    window.TrinyCart?.clear();
    bookingState = createInitialState();
    submitting = false;
    renderStep();
    window.TrinyDrawers?.close('bookingDrawer');
  };

  document.addEventListener('change', event => {
    if (event.target?.id === 'bkTime') updateDateButton();
    if (event.target?.id === 'bkSpaceConsent' || event.target?.id === 'bkContactConsent') {
      const checked = event.target.checked;
      const key = event.target.id === 'bkSpaceConsent' ? 'spaceConsent' : 'contactConsent';
      const timestampKey = `${key}At`;
      bookingState.client[key] = checked;
      bookingState.client[timestampKey] = checked ? new Date().toISOString() : '';
    }
  });

  document.addEventListener('DOMContentLoaded', renderStep);
})();
