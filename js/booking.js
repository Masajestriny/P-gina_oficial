(function() {
  'use strict';

  const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
  let bookingState = createInitialState();

  function createInitialState() {
    return {
      step: 1,
      date: '',
      time: '',
      client: {},
      serviceId: '',
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
    const service = window.TRINY_CONFIG?.services?.find(item => String(item.id) === bookingState.serviceId);
    return service ? [{ ...service, type: 'service', quantity: 1, sessions: 1, lineTotal: service.priceNum }] : [];
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
    const selectedService = lines[0];
    return `
      <h3 class="booking-step-title">1. Elige un masaje</h3>
      <label class="form-group" for="bookingService">Tipo de masaje
        <select id="bookingService">
          <option value="">Selecciona un servicio</option>
          ${window.TRINY_CONFIG.services.map(service => `<option value="${service.id}" ${String(service.id) === bookingState.serviceId ? 'selected' : ''}>${escapeHTML(service.name)}</option>`).join('')}
        </select>
      </label>
      <p class="availability-note" id="bookingServiceDetails" aria-live="polite">${selectedService ? `${escapeHTML(selectedService.duration)} · S/ ${selectedService.priceNum} (importe estimado)` : 'La duración y el precio estimado se mostrarán al elegir un servicio.'}</p>
      <div class="booking-nav">
        <button type="button" class="btn btn-primary" onclick="bookingNext()" ${lines.length ? '' : 'disabled'} id="bookingServiceNext">Siguiente: horario preferido</button>
      </div>
    `;
  }

  function renderDateStep() {
    const year = bookingState.calendarYear;
    const month = bookingState.calendarMonth;
    return `
      <h3 class="booking-step-title">2. Fecha y hora preferidas</h3>
      <p>Elige una preferencia de horario. No se muestra disponibilidad en tiempo real y esta selección no confirma la cita.</p>
      <p class="availability-note">Atención todos los días, de 9:00 a. m. a 10:00 p. m. Los horarios solicitados deben confirmarse con el equipo.</p>
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
    const total = { amount: lines.reduce((sum, line) => sum + line.lineTotal, 0) };
    const client = bookingState.client;
    return `
      <h3 class="booking-step-title">4. Revisa tu solicitud</h3>
      <p class="booking-summary">${renderSummary(lines, total, client)}</p>
      <label class="form-group">Central de atención
        <select id="bkCentral">
          <option value="central1" ${client.central !== 'central2' ? 'selected' : ''}>Central 1 · ${window.TRINY_CONFIG.contacts.central1.display}</option>
          <option value="central2" ${client.central === 'central2' ? 'selected' : ''}>Central 2 · ${window.TRINY_CONFIG.contacts.central2.display}</option>
        </select>
      </label>
      <p class="availability-note">La reserva online estará disponible próximamente. Por ahora, la solicitud se coordina exclusivamente por WhatsApp y no se confirma al abrir el borrador.</p>
      <div class="booking-nav">
        <button type="button" class="btn btn-secondary" onclick="bookingBack()">Atrás y editar</button>
        <button type="button" class="btn btn-outline" disabled aria-disabled="true">Reserva online · Próximamente</button>
        <button type="button" class="btn btn-whatsapp" id="btnConfirmBooking" onclick="sendBookingRequestToWhatsApp()">Continuar por WhatsApp</button>
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

    if (zone === 'lima') {
      location = district;
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
      `Duración: ${lines[0]?.duration || 'Por confirmar'}`,
      `Total estimado, sujeto a confirmación: S/ ${lines.reduce((sum, line) => sum + line.lineTotal, 0)}`,
      `Observaciones: ${client.notes || 'Ninguna'}`,
      'Este mensaje es un borrador. No se ha enviado ni confirmado la reserva.'
    ].join('\n');
  }

  window.selectBookingService = function(serviceId) {
    bookingState.serviceId = String(serviceId || '');
    const selected = currentItems()[0];
    const details = document.getElementById('bookingServiceDetails');
    const next = document.getElementById('bookingServiceNext');
    if (details) details.textContent = selected
      ? `${selected.duration} · S/ ${selected.priceNum} (importe estimado)`
      : 'La duración y el precio estimado se mostrarán al elegir un servicio.';
    if (next) next.disabled = !selected;
  };

  window.sendBookingRequestToWhatsApp = function() {
    const items = currentItems();
    const centralId = document.getElementById('bkCentral')?.value || 'central1';
    const central = window.TRINY_CONFIG?.contacts?.[centralId];
    if (bookingState.step !== 4 || !items.length || !central) {
      window.showToast?.('No se pudo preparar la solicitud', 'Revisa el servicio y los datos de reserva antes de continuar.', 'warning');
      return;
    }
    const link = document.createElement('a');
    link.href = window.WA.link(buildWhatsAppMessage(), centralId);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Abrir borrador de WhatsApp para ${central.label}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.showToast?.('Borrador preparado', 'Revisa el mensaje y envíalo desde WhatsApp. La solicitud aún no está confirmada.', 'info', 6000);
  };

  function updateDateButton() {
    const button = document.getElementById('bkNextDate');
    const time = document.getElementById('bkTime')?.value || '';
    bookingState.time = time;
    if (button) button.disabled = !bookingState.date || !bookingState.time;
  }

  window.startBooking = function() {
    bookingState = createInitialState();
    renderStep();
    window.TrinyDrawers?.open('bookingDrawer');
  };

  window.startBookingForService = function(serviceId) {
    bookingState = createInitialState();
    bookingState.serviceId = String(serviceId);
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
    if (bookingState.step === 1 && !currentItems().length) {
      window.showToast?.('Selecciona un masaje', 'Elige el servicio que deseas solicitar.', 'warning');
      return;
    }
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
      if (bookingState.step === 4) bookingState.client.central = document.getElementById('bkCentral')?.value || bookingState.client.central;
      bookingState.step--;
      renderStep();
    }
  };

  window.resetBooking = function() {
    bookingState = createInitialState();
    renderStep();
    window.TrinyDrawers?.close('bookingDrawer');
  };

  document.addEventListener('change', event => {
    if (event.target?.id === 'bkTime') updateDateButton();
    if (event.target?.id === 'bookingService') window.selectBookingService(event.target.value);
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
