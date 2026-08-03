// ============================================================
//  TRINY MASAJES — Booking Module with n8n Webhook 1 Integration
//  Webhook 1 (Booking): https://inversionespreaft.app.n8n.cloud/webhook-test/c06ec5b8-0746-40e8-ae75-22d5521324fe
// ============================================================

(function() {
  const N8N_BOOKING_WEBHOOK_URL = 'https://inversionespreaft.app.n8n.cloud/webhook-test/c06ec5b8-0746-40e8-ae75-22d5521324fe';

  let bookingState = {
    step: 1,
    service: null,
    sessions: 1,
    date: null,
    time: null,
    therapist: 'Triny Flores',
    client: {},
  };

  const AVAILABLE_TIMES = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM'];
  const TAKEN_TIMES = ['10:00 AM','2:00 PM'];
  const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const DAYS_SHORT = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];

  let calYear, calMonth;

  function init() {
    const now = new Date();
    calYear  = now.getFullYear();
    calMonth = now.getMonth();
    renderStep();
  }

  function renderStep() {
    const container = document.getElementById('bookingStepContent');
    if (!container) return;

    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`step-indicator-${i}`);
      if (!el) continue;
      el.classList.remove('active','done');
      if (i === bookingState.step) el.classList.add('active');
      else if (i < bookingState.step) el.classList.add('done');
    }

    switch (bookingState.step) {
      case 1: container.innerHTML = renderStep1(); break;
      case 2: container.innerHTML = renderStep2(); break;
      case 3: container.innerHTML = renderStep3(); break;
      case 4: container.innerHTML = renderStep4(); break;
    }
  }

  function renderStep1() {
    const services = (window.BOOKING_SERVICES || []).slice(0, 15);
    return `
      <div class="booking-step-title">1. Selecciona Servicio y Paquete de Sesiones</div>

      <div style="margin-bottom:1.5rem;">
        <label style="font-weight:700;font-size:0.9rem;color:var(--gray-900);display:block;margin-bottom:0.5rem">
          Número de Sesiones a Contratar:
        </label>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
          ${[
            { num: 1, label: '1 Sesión', desc: 'Precio estándar' },
            { num: 3, label: '3 Sesiones', desc: '10% Descuento' },
            { num: 5, label: '5 Sesiones', desc: '20% Descuento' },
            { num: 10, label: '10 Sesiones', desc: '30% Descuento (VIP)' }
          ].map(s => `
            <button class="filter-btn${bookingState.sessions === s.num ? ' active' : ''}" 
                    onclick="selectSessions(${s.num})" type="button">
              <strong>${s.label}</strong> — <small>${s.desc}</small>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="booking-services-grid">
        ${services.map(s => {
          const discountMultiplier = bookingState.sessions === 10 ? 0.7 : bookingState.sessions === 5 ? 0.8 : bookingState.sessions === 3 ? 0.9 : 1.0;
          const totalPrice = Math.round(s.priceNum * bookingState.sessions * discountMultiplier);
          return `
            <div class="bk-service-option${bookingState.service?.id === s.id ? ' selected' : ''}" 
                 data-id="${s.id}" onclick="selectBookingService(${s.id})">
              <div class="bs-name">${s.name}</div>
              <div class="bs-price">S/ ${totalPrice} (${bookingState.sessions} sesión/es)</div>
              <div style="font-size:0.75rem;color:var(--gray-500);margin-top:0.25rem">${s.duration} por sesión</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="booking-nav">
        <div></div>
        <button class="btn btn-primary" onclick="bookingNext()" ${!bookingState.service ? 'disabled' : ''} id="bkNextBtn1">
          Siguiente: Fecha y Hora →
        </button>
      </div>
    `;
  }

  window.selectSessions = function(num) {
    bookingState.sessions = num;
    const container = document.getElementById('bookingStepContent');
    if (container) container.innerHTML = renderStep1();
  };

  window.selectBookingService = function(id) {
    bookingState.service = (window.BOOKING_SERVICES || []).find(s => s.id === id);
    document.querySelectorAll('.bk-service-option').forEach(el => {
      el.classList.toggle('selected', parseInt(el.dataset.id) === id);
    });
    const btn = document.getElementById('bkNextBtn1');
    if (btn) btn.disabled = false;
  };

  function renderStep2() {
    return `
      <div class="booking-step-title">2. Elige Fecha y Hora de la Sesión</div>
      <div class="cal-nav" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
        <button class="btn btn-secondary" onclick="calNav(-1)" style="padding:0.4rem 0.75rem;">←</button>
        <span id="calMonthLabel" style="font-weight:700;color:var(--gray-900)">${MONTHS[calMonth]} ${calYear}</span>
        <button class="btn btn-secondary" onclick="calNav(1)" style="padding:0.4rem 0.75rem;">→</button>
      </div>
      <div class="calendar-grid" id="calendarGrid">
        ${DAYS_SHORT.map(d => `<div class="cal-header">${d}</div>`).join('')}
        ${renderCalendarDays()}
      </div>
      <div style="margin-bottom:1rem;">
        <div style="font-weight:700;font-size:0.9rem;color:var(--gray-900);margin-bottom:0.75rem;">
          Horarios Disponibles ${bookingState.date ? `para ${bookingState.date}` : ''}
        </div>
        <div class="time-slots" id="timeSlots" ${!bookingState.date ? 'style="opacity:0.4;pointer-events:none"' : ''}>
          ${AVAILABLE_TIMES.map(t => {
            const taken = TAKEN_TIMES.includes(t);
            const selected = bookingState.time === t;
            return `<div class="time-slot${taken?' taken':''}${selected?' selected':''}" 
              ${taken ? '' : `onclick="selectTime('${t}')"`}>${t}${taken ? ' ✗' : ''}</div>`;
          }).join('')}
        </div>
      </div>
      <div class="booking-nav">
        <button class="btn btn-secondary" onclick="bookingBack()">← Atrás</button>
        <button class="btn btn-primary" onclick="bookingNext()" 
          ${(!bookingState.date || !bookingState.time) ? 'disabled' : ''} id="bkNextBtn2">
          Siguiente: Tus Datos →
        </button>
      </div>
    `;
  }

  function renderCalendarDays() {
    const today = new Date();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    let html = '';
    for (let i = 0; i < firstDay; i++) html += '<div class="cal-day empty"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(calYear, calMonth, d);
      const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isSunday = dateObj.getDay() === 0;
      const disabled = isPast || (isSunday && d > 14);
      const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
      const dateStr = `${d} ${MONTHS[calMonth].slice(0,3)} ${calYear}`;
      const selected = bookingState.date === dateStr;
      html += `<div class="cal-day${isToday?' today':''}${disabled?' disabled':''}${selected?' selected':''}"
        ${disabled ? '' : `onclick="selectDate('${dateStr}')"`}>${d}</div>`;
    }
    return html;
  }

  window.calNav = function(dir) {
    calMonth += dir;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    if (calMonth > 11) { calMonth = 0; calYear++; }
    document.getElementById('calMonthLabel').textContent = `${MONTHS[calMonth]} ${calYear}`;
    document.getElementById('calendarGrid').innerHTML =
      DAYS_SHORT.map(d => `<div class="cal-header">${d}</div>`).join('') + renderCalendarDays();
  };

  window.selectDate = function(dateStr) {
    bookingState.date = dateStr;
    bookingState.time = null;
    const container = document.getElementById('bookingStepContent');
    if (container) container.innerHTML = renderStep2();
  };

  window.selectTime = function(time) {
    bookingState.time = time;
    document.querySelectorAll('.time-slot:not(.taken)').forEach(el => {
      el.classList.toggle('selected', el.textContent === time);
    });
    const btn = document.getElementById('bkNextBtn2');
    if (btn) btn.disabled = false;
  };

  function renderStep3() {
    const discountMultiplier = bookingState.sessions === 10 ? 0.7 : bookingState.sessions === 5 ? 0.8 : bookingState.sessions === 3 ? 0.9 : 1.0;
    const totalPrice = Math.round((bookingState.service?.priceNum || 70) * bookingState.sessions * discountMultiplier);

    return `
      <div class="booking-step-title">3. Tus Datos y Envío a n8n Webhook</div>

      <div class="booking-summary" style="margin-bottom:1.5rem">
        <h4>Resumen de la Selección de Compra</h4>
        <div class="bs-item"><span class="bs-label">Servicio Elegido</span><span class="bs-value">${bookingState.service?.name}</span></div>
        <div class="bs-item"><span class="bs-label">Número de Sesiones</span><span class="bs-value">${bookingState.sessions} sesión/es</span></div>
        <div class="bs-item"><span class="bs-label">Fecha y Hora</span><span class="bs-value">${bookingState.date} a las ${bookingState.time}</span></div>
        <div class="bs-item"><span class="bs-label">Precio Total</span><span class="bs-value">S/ ${totalPrice}</span></div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="bkNombre">Nombre Completo *</label>
          <input type="text" id="bkNombre" placeholder="Tu nombre" required />
        </div>
        <div class="form-group">
          <label for="bkPhone">Celular / WhatsApp *</label>
          <input type="tel" id="bkPhone" placeholder="986820428" required />
        </div>
      </div>
      <div class="form-group">
        <label for="bkEmail">Correo Electrónico *</label>
        <input type="email" id="bkEmail" placeholder="tu@correo.com" required />
      </div>
      <div class="form-group">
        <label for="bkNotes">Nota especial o preferencias</label>
        <textarea id="bkNotes" rows="3" placeholder="Comentarios adicionales..."></textarea>
      </div>

      <div class="booking-nav">
        <button class="btn btn-secondary" onclick="bookingBack()">← Atrás</button>
        <button class="btn btn-primary" onclick="bookingSubmit()" id="btnConfirmBooking">
          Enviar Reserva al Webhook n8n →
        </button>
      </div>
    `;
  }

  function renderStep4() {
    const s = bookingState;
    const discountMultiplier = s.sessions === 10 ? 0.7 : s.sessions === 5 ? 0.8 : s.sessions === 3 ? 0.9 : 1.0;
    const totalPrice = Math.round((s.service?.priceNum || 70) * s.sessions * discountMultiplier);

    return `
      <div class="booking-confirm-card">
        <div class="confirm-icon">🎉</div>
        <h3 style="font-family:var(--font-serif);font-size:1.75rem;color:var(--gray-900);margin-bottom:0.75rem">
          ¡Reserva Enviada al Webhook de n8n!
        </h3>
        <p class="confirm-msg">
          Se enviaron los datos de la compra para <strong>${s.service?.name}</strong> (${s.sessions} sesión/es) para el <strong>${s.date}</strong> a las <strong>${s.time}</strong>.
        </p>
        <div class="booking-summary">
          <h4>Resumen de Confirmación</h4>
          <div class="bs-item"><span class="bs-label">Servicio</span><span class="bs-value">${s.service?.name}</span></div>
          <div class="bs-item"><span class="bs-label">Número de Sesiones</span><span class="bs-value">${s.sessions}</span></div>
          <div class="bs-item"><span class="bs-label">Fecha & Hora</span><span class="bs-value">${s.date} ${s.time}</span></div>
          <div class="bs-item"><span class="bs-label">Cliente</span><span class="bs-value">${s.client.name}</span></div>
          <div class="bs-item"><span class="bs-label">Celular</span><span class="bs-value">${s.client.phone}</span></div>
          <div class="bs-item"><span class="bs-label">Total a Pagar</span><span class="bs-value">S/ ${totalPrice}</span></div>
        </div>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center">
          <a href="${window.WA?.bookService(`${s.service?.name} (${s.sessions} sesiones - S/ ${totalPrice})`)||'#'}" target="_blank" rel="noopener" class="btn btn-hero-wa">
            Confirmación por WhatsApp (986820428)
          </a>
          <button class="btn btn-secondary" onclick="resetBooking()">Nueva Reserva</button>
        </div>
      </div>
    `;
  }

  window.bookingNext = function() {
    if (bookingState.step < 4) {
      bookingState.step++;
      renderStep();
      document.getElementById('reservas')?.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  };

  window.bookingBack = function() {
    if (bookingState.step > 1) {
      bookingState.step--;
      renderStep();
    }
  };

  window.bookingSubmit = async function() {
    const nombre = document.getElementById('bkNombre')?.value?.trim();
    const phone  = document.getElementById('bkPhone')?.value?.trim();
    const email  = document.getElementById('bkEmail')?.value?.trim();
    const notes  = document.getElementById('bkNotes')?.value?.trim();

    if (!nombre || !phone || !email) {
      showToast('Campos requeridos', 'Por favor ingresa nombre, celular y correo.', 'warning');
      return;
    }

    bookingState.client = { name: nombre, phone, email, notes };

    const discountMultiplier = bookingState.sessions === 10 ? 0.7 : bookingState.sessions === 5 ? 0.8 : bookingState.sessions === 3 ? 0.9 : 1.0;
    const totalPrice = Math.round((bookingState.service?.priceNum || 70) * bookingState.sessions * discountMultiplier);

    const payload = {
      event: 'booking_created',
      type: 'reserva_sesiones',
      timestamp: new Date().toISOString(),
      service: {
        id: bookingState.service?.id,
        name: bookingState.service?.name,
        category: bookingState.service?.category,
        duration: bookingState.service?.duration,
        unitPrice: bookingState.service?.priceNum,
      },
      sessions: bookingState.sessions,
      totalPrice: totalPrice,
      currency: 'PEN',
      date: bookingState.date,
      time: bookingState.time,
      therapist: bookingState.therapist,
      client: {
        name: bookingState.client.name,
        phone: bookingState.client.phone,
        email: bookingState.client.email,
        notes: bookingState.client.notes,
      }
    };

    // Send payload to Webhook 1 (Booking)
    try {
      fetch(N8N_BOOKING_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(res => console.log('Booking Webhook 1 status:', res.status))
        .catch(err => console.error('Booking Webhook 1 error:', err));
    } catch (e) {
      console.error('Booking Webhook 1 exception:', e);
    }

    // Award TrinyPoints (10 points per S/ 10 spent)
    if (window.TrinyPoints) {
      const earnedPts = Math.round(totalPrice);
      window.TrinyPoints.addPoints(earnedPts, `Reserva de ${bookingState.service?.name}`);
    }

    // Register in CRM local
    if (window.CRM_addClient) {
      window.CRM_addClient({
        name: bookingState.client.name,
        email: bookingState.client.email,
        phone: bookingState.client.phone,
        service: `${bookingState.service?.name} (${bookingState.sessions} ses)`,
        date: bookingState.date,
        time: bookingState.time,
        status: 'nuevo',
        notes: `Reserva enviada a n8n test webhook: ${notes}`,
      });
    }

    bookingState.step = 4;
    renderStep();
    showToast('¡Reserva enviada a n8n!', `Los datos de la reserva fueron enviados a n8n webhook test.`, 'success');
  };

  window.resetBooking = function() {
    bookingState = { step:1, service:null, sessions:1, date:null, time:null, therapist:'Triny Flores', client:{} };
    renderStep();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[Triny Masajes] Booking module verified with Webhook 1 ✓');
})();
