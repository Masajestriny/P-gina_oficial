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
      serviceQuantities: {},
      packageId: '',
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
    const config = window.TRINY_CONFIG;
    if (bookingState.packageId) {
      const pack = config?.packages?.find(item => item.id === bookingState.packageId);
      return pack ? [{ ...pack, type: 'package', quantity: 1, sessions: pack.sessions, lineTotal: pack.priceNum }] : [];
    }
    return (config?.services || [])
      .filter(service => bookingState.serviceQuantities[service.id] > 0)
      .map(service => {
        const quantity = bookingState.serviceQuantities[service.id];
        return { ...service, type: 'service', quantity, sessions: quantity, lineTotal: service.priceNum * quantity };
      });
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


  // ── Categorías del acordeón (Step 1) ──────────────────────────────────────
  const SERVICE_CATEGORIES = [
    { key: 'estetico',      label: 'Estético / Reductor',  icon: '✨' },
    { key: 'maderoterapia', label: 'Maderoterapia',         icon: '🪵' },
    { key: 'terapeutico',   label: 'Terapéutico',           icon: '💆' },
    { key: 'relajacion',    label: 'Relajación',            icon: '🌿' },
    { key: 'oriental',      label: 'Shiatsu',               icon: '🧘' },
    { key: 'reflexologia',  label: 'Reflexología',          icon: '🦶' }
  ];

  function renderServicesStep() {
    const lines      = currentItems();
    const total      = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const hasPackage = !!bookingState.packageId;
    const services   = window.TRINY_CONFIG.services || [];
    const selCount   = lines.filter(l => l.type === 'service').reduce((s, l) => s + l.quantity, 0);
    const openCat    = bookingState._openCat || null;

    /* Acordeón por categoría */
    const accordionHTML = SERVICE_CATEGORIES.map(cat => {
      const catSvcs = services.filter(s => s.category === cat.key);
      if (!catSvcs.length) return '';
      const catSel  = catSvcs.reduce((s, sv) => s + (bookingState.serviceQuantities[sv.id] || 0), 0);
      const isOpen  = openCat === cat.key;

      const rows = catSvcs.map(svc => {
        const qty = bookingState.serviceQuantities[svc.id] || 0;
        return `
          <div class="bk-svc-row${qty > 0 ? ' bk-svc-selected' : ''}" data-bk-svc-id="${svc.id}">
            ${svc.img ? `<img class="bk-svc-img" src="${escapeHTML(svc.img)}" alt="${escapeHTML(svc.name)}" loading="lazy" />` : ''}
            <div class="bk-svc-info">
              <span class="bk-svc-name">${escapeHTML(svc.name)}</span>
              <span class="bk-svc-meta">${escapeHTML(svc.duration)} · S/ ${svc.priceNum}/sesión</span>
            </div>
            <div class="bk-svc-controls${hasPackage ? ' bk-disabled' : ''}">
              <button type="button" class="bk-qty-btn" data-bk-dec="${svc.id}"
                      aria-label="Quitar sesión" ${qty < 1 || hasPackage ? 'disabled' : ''}>−</button>
              <input  type="number" class="bk-qty-input" min="0" max="999" step="1"
                      inputmode="numeric" value="${qty}"
                      data-booking-quantity="${svc.id}"
                      aria-label="Cantidad de ${escapeHTML(svc.name)}"
                      ${hasPackage ? 'disabled' : ''} />
              <button type="button" class="bk-qty-btn bk-qty-add" data-bk-inc="${svc.id}"
                      aria-label="Agregar sesión" ${hasPackage ? 'disabled' : ''}>+</button>
            </div>
            <span class="bk-svc-subtotal" data-booking-subtotal="${svc.id}">${qty > 0 ? 'S/ ' + (svc.priceNum * qty) : '—'}</span>
          </div>`;
      }).join('');

      return `
        <div class="bk-cat-block${isOpen ? ' bk-cat-open' : ''}">
          <button type="button" class="bk-cat-header"
                  data-bk-cat="${cat.key}" aria-expanded="${isOpen}"
                  ${hasPackage ? 'disabled' : ''}>
            <span class="bk-cat-icon" aria-hidden="true">${cat.icon}</span>
            <span class="bk-cat-label">${cat.label}</span>
            ${catSel > 0 ? `<span class="bk-cat-badge">${catSel} ses.</span>` : ''}
            <span class="bk-cat-arrow" aria-hidden="true"></span>
          </button>
          <div class="bk-cat-body"${isOpen ? '' : ' hidden'}>
            ${rows}
          </div>
        </div>`;
    }).join('');

    /* Resumen de selección activa */
    const selLines = lines.filter(l => l.type === 'service');
    const summaryHTML = selLines.length ? `
      <div class="bk-selection-summary" aria-live="polite">
        <p class="bk-summary-title">Sesiones seleccionadas:</p>
        <ul class="bk-summary-list">
          ${selLines.map(l => `<li><span>${escapeHTML(l.name)}</span><span>× ${l.quantity} = <strong>S/ ${l.lineTotal}</strong></span></li>`).join('')}
        </ul>
      </div>` : '';

    return `
      <h3 class="booking-step-title">1. Elige tus sesiones</h3>
      <p class="availability-note">Despliega el tipo de masaje, ajusta la cantidad y agrega cuantas sesiones quieras. Puedes combinar varios tipos.</p>

      <div class="bk-accordion" id="bkAccordion" role="list" aria-label="Tipos de masaje">
        ${accordionHTML}
      </div>

      ${summaryHTML}

      <fieldset class="booking-package-list">
        <legend>📦 Paquetes de 10 sesiones</legend>
        <p class="bk-pkg-note">Al elegir un paquete se descartan las sesiones individuales.</p>
        ${(window.TRINY_CONFIG.packages || []).map(pack => `
          <label class="booking-package-option${bookingState.packageId === pack.id ? ' selected' : ''}">
            <input type="radio" name="bookingPackage" value="${escapeHTML(pack.id)}"
                   data-booking-package ${bookingState.packageId === pack.id ? 'checked' : ''} />
            <span class="booking-package-content">
              <strong>${escapeHTML(pack.name)}</strong>
              <span>${pack.sessions} sesiones · <strong>S/ ${pack.priceNum}</strong></span>
              <span class="bk-pkg-details">${(pack.details || []).map(d => escapeHTML(d)).join(' · ')}</span>
              ${pack.terms ? `<small>${escapeHTML(pack.terms)}</small>` : ''}
              ${pack.id === 'reductor-10' ? '<small>⚠️ Distribución de técnicas a confirmar con el equipo.</small>' : ''}
            </span>
          </label>`).join('')}
        ${bookingState.packageId
          ? `<button type="button" class="btn btn-secondary booking-clear-package"
                     onclick="clearBookingPackage()">✕ Quitar paquete</button>`
          : ''}
      </fieldset>

      <p class="booking-selection-total" aria-live="polite">
        Total estimado: <strong id="bookingSelectionTotal">S/ ${total}</strong>
        ${selCount > 0 ? `<small>(${selCount} sesión${selCount !== 1 ? 'es' : ''})</small>` : ''}
      </p>
      <div class="booking-nav">
        <button type="button" class="btn btn-primary" onclick="bookingNext()"
                ${lines.length ? '' : 'disabled'} id="bookingServiceNext">
          Siguiente: horario preferido
        </button>
      </div>`;
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
    const itemsText = lines.map(line => line.type === 'package'
      ? `- ${line.name}: 1 paquete (${line.sessions} sesiones incluidas; S/ ${line.lineTotal} estimado)`
      : `- ${line.name}: ${line.quantity} ${line.quantity === 1 ? 'sesión' : 'sesiones'} (S/ ${line.priceNum} c/u; S/ ${line.lineTotal} estimado)`).join('\n');
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
      `Duración total estimada: ${getBookingDuration(lines)}`,
      `Total estimado, sujeto a confirmación: S/ ${lines.reduce((sum, line) => sum + line.lineTotal, 0)}`,
      `Observaciones: ${client.notes || 'Ninguna'}`,
      'Este mensaje es un borrador. No se ha enviado ni confirmado la reserva.'
    ].join('\n');
  }

  function getBookingDuration(lines) {
    let totalMinutes = 0;
    for (const line of lines) {
      const match = String(line.duration || '').match(/(\d+)\s*(min(?:utos?)?|h(?:ora)?s?)/i);
      if (!match) return 'Por confirmar según los servicios o paquetes seleccionados';
      totalMinutes += Number(match[1]) * (/^h/i.test(match[2]) ? 60 : 1) * line.sessions;
    }
    if (!totalMinutes) return 'Por confirmar';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return [hours ? `${hours} h` : '', minutes ? `${minutes} min` : ''].filter(Boolean).join(' ');
  }

  function updateSelectionSummary() {
    const lines = currentItems();
    const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    lines.filter(line => line.type === 'service').forEach(line => {
      const subtotal = document.querySelector(`[data-booking-subtotal="${line.id}"]`);
      if (subtotal) subtotal.textContent = `S/ ${line.lineTotal}`;
    });
    const totalElement = document.getElementById('bookingSelectionTotal');
    if (totalElement) totalElement.textContent = `S/ ${total}`;
    const next = document.getElementById('bookingServiceNext');
    if (next) next.disabled = !lines.length;
  }

  window.clearBookingPackage = function() {
    bookingState.packageId = '';
    renderStep();
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
    const service = window.TRINY_CONFIG?.services?.find(item => String(item.id) === String(serviceId));
    if (service) bookingState.serviceQuantities[service.id] = 1;
    renderStep();
    window.TrinyDrawers?.open('bookingDrawer');
  };


  window.startBookingWithState = function(preState) {
    bookingState = createInitialState();
    if (preState && preState.packageId) {
      bookingState.packageId = preState.packageId;
    } else if (preState && preState.serviceQuantities) {
      Object.entries(preState.serviceQuantities).forEach(function(entry) {
        var numId = Number(entry[0]);
        var qty = entry[1];
        if (Number.isInteger(qty) && qty > 0) bookingState.serviceQuantities[numId] = qty;
      });
    }
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
    const serviceCheckbox = event.target?.closest?.('[data-booking-service]');
    if (serviceCheckbox) {
      const serviceId = Number(serviceCheckbox.dataset.bookingService);
      if (serviceCheckbox.checked) {
        bookingState.packageId = '';
        bookingState.serviceQuantities[serviceId] = bookingState.serviceQuantities[serviceId] || 1;
      } else {
        delete bookingState.serviceQuantities[serviceId];
      }
      renderStep();
    }
    const quantityInput = event.target?.closest?.('[data-booking-quantity]');
    if (quantityInput) {
      const serviceId = Number(quantityInput.dataset.bookingQuantity);
      const amount = quantityInput.valueAsNumber;
      if (!Number.isInteger(amount) || amount < 1 || amount > 99) {
        quantityInput.value = String(bookingState.serviceQuantities[serviceId] || 1);
        window.showToast?.('Cantidad no válida', 'Elige una cantidad entre 1 y 99 sesiones.', 'warning');
        return;
      }
      bookingState.serviceQuantities[serviceId] = amount;
      updateSelectionSummary();
    }
    if (event.target?.matches?.('[data-booking-package]') && event.target.checked) {
      bookingState.serviceQuantities = {};
      bookingState.packageId = event.target.value;
      renderStep();
    }
    if (event.target?.id === 'bkSpaceConsent' || event.target?.id === 'bkContactConsent') {
      const checked = event.target.checked;
      const key = event.target.id === 'bkSpaceConsent' ? 'spaceConsent' : 'contactConsent';
      const timestampKey = `${key}At`;
      bookingState.client[key] = checked;
      bookingState.client[timestampKey] = checked ? new Date().toISOString() : '';
    }
  });

  document.addEventListener('input', event => {
    const quantityInput = event.target?.closest?.('[data-booking-quantity]');
    if (!quantityInput) return;
    const serviceId = Number(quantityInput.dataset.bookingQuantity);
    const amount = quantityInput.valueAsNumber;
    if (!Number.isInteger(amount) || amount < 1 || amount > 99) return;
    bookingState.serviceQuantities[serviceId] = amount;
    updateSelectionSummary();
  });

  /* ── Acordeón: expandir / contraer categoría ── */
  document.addEventListener('click', event => {
    const catBtn = event.target.closest('.bk-cat-header[data-bk-cat]');
    if (catBtn && !catBtn.disabled) {
      const cat = catBtn.dataset.bkCat;
      bookingState._openCat = (bookingState._openCat === cat) ? null : cat;
      renderStep();
      return;
    }

    /* Botón + (incrementar) */
    const incBtn = event.target.closest('[data-bk-inc]');
    if (incBtn && !incBtn.disabled) {
      const id = Number(incBtn.dataset.bkInc);
      bookingState.packageId = '';
      bookingState.serviceQuantities[id] = (bookingState.serviceQuantities[id] || 0) + 1;
      updateSelectionSummary();
      const row   = document.querySelector('[data-bk-svc-id="' + id + '"]');
      if (row) row.classList.add('bk-svc-selected');
      const input = document.querySelector('[data-booking-quantity="' + id + '"]');
      if (input) input.value = bookingState.serviceQuantities[id];
      const sub   = document.querySelector('[data-booking-subtotal="' + id + '"]');
      const svc   = (window.TRINY_CONFIG.services || []).find(s => s.id === id);
      if (sub && svc) sub.textContent = 'S/ ' + (svc.priceNum * bookingState.serviceQuantities[id]);
      const decBtn = document.querySelector('[data-bk-dec="' + id + '"]');
      if (decBtn) decBtn.disabled = false;
      return;
    }

    /* Botón − (decrementar) */
    const decBtn = event.target.closest('[data-bk-dec]');
    if (decBtn && !decBtn.disabled) {
      const id  = Number(decBtn.dataset.bkDec);
      const cur = bookingState.serviceQuantities[id] || 0;
      if (cur <= 1) {
        delete bookingState.serviceQuantities[id];
      } else {
        bookingState.serviceQuantities[id] = cur - 1;
      }
      updateSelectionSummary();
      const newQty = bookingState.serviceQuantities[id] || 0;
      const input  = document.querySelector('[data-booking-quantity="' + id + '"]');
      if (input) input.value = newQty;
      const row    = document.querySelector('[data-bk-svc-id="' + id + '"]');
      if (row) row.classList.toggle('bk-svc-selected', newQty > 0);
      const sub    = document.querySelector('[data-booking-subtotal="' + id + '"]');
      const svc    = (window.TRINY_CONFIG.services || []).find(s => s.id === id);
      if (sub && svc) sub.textContent = newQty > 0 ? 'S/ ' + (svc.priceNum * newQty) : '—';
      decBtn.disabled = newQty < 1;
      return;
    }
  });
  document.addEventListener('DOMContentLoaded', renderStep);
})();
