// ============================================================
//  TRINY MASAJES — CRM Module
// ============================================================

(function() {
  const STORAGE_KEY = 'triny_crm_clients';
  let clients = [];
  let crmFilter = 'all';
  let crmSearch = '';

  // ── Load/Save ──
  function loadClients() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        clients = JSON.parse(stored);
      } else {
        clients = getSampleClients();
        saveClients();
      }
    } catch { clients = getSampleClients(); }
  }

  function saveClients() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(clients)); } catch {}
  }

  function getSampleClients() {
    return [];
  }

  // ── Add Client (from bookings or game) ──
  window.CRM_addClient = function(data) {
    const existingIdx = clients.findIndex(c =>
      c.phone === data.phone || (data.email && c.email === data.email)
    );

    if (existingIdx >= 0) {
      // Update existing
      const c = clients[existingIdx];
      c.reservations = (c.reservations || 0) + 1;
      c.lastService  = data.service || c.lastService;
      if (data.prize) c.prize = data.prize;
      if (data.notes) c.notes = (c.notes || '') + '\n' + data.notes;
      c.status = c.reservations >= 10 ? 'vip' : c.reservations >= 3 ? 'frecuente' : 'nuevo';
    } else {
      // New client
      const newClient = {
        id:          Date.now(),
        name:        data.name || 'Sin nombre',
        email:       data.email || '',
        phone:       data.phone || '',
        status:      'nuevo',
        reservations: 1,
        lastService: data.service || '',
        prize:       data.prize || '',
        tags:        ['nuevo'],
        notes:       data.notes || '',
        birthday:    '',
        joinDate:    new Date().toISOString().split('T')[0],
        totalSpent:  0,
      };
      clients.unshift(newClient);
    }
    saveClients();
    renderCRM();
    renderKPIs();
  };

  // ── Render KPIs ──
  function renderKPIs() {
    const el = document.getElementById('crmKpis');
    if (!el) return;
    const total     = clients.length;
    const vip       = clients.filter(c => c.status === 'vip').length;
    const newThisMonth = clients.filter(c => c.joinDate >= new Date().toISOString().slice(0,7)).length;
    const prizes    = clients.filter(c => c.prize).length;
    const totalReservations = clients.reduce((s,c) => s + (c.reservations||0), 0);
    const totalRevenue = clients.reduce((s,c) => s + (c.totalSpent||0), 0);

    el.innerHTML = [
      { icon:'👥', value: total,            label:'Total Clientes'       },
      { icon:'⭐', value: vip,              label:'Clientes VIP'         },
      { icon:'🆕', value: newThisMonth,     label:'Nuevos este Mes'      },
      { icon:'📅', value: totalReservations,label:'Total Reservas'       },
      { icon:'🎁', value: prizes,           label:'Premios Canjeados'    },
      { icon:'💰', value:`S/${totalRevenue}`,label:'Ingresos Estimados'  },
    ].map(k => `
      <div class="kpi-card" role="listitem">
        <div class="kpi-icon">${k.icon}</div>
        <div class="kpi-value">${k.value}</div>
        <div class="kpi-label">${k.label}</div>
      </div>
    `).join('');
  }

  // ── Render Table ──
  function renderCRM() {
    const tbody = document.getElementById('crmTableBody');
    if (!tbody) return;

    let filtered = [...clients];
    if (crmFilter !== 'all') filtered = filtered.filter(c => c.status === crmFilter);
    if (crmSearch) {
      const q = crmSearch.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--gray-400);padding:2rem;">Sin resultados</td></tr>`;
      return;
    }

    const AVATAR_COLORS = ['#FF6B00','#1E40AF','#7C3AED','#059669','#DB2777','#D97706','#0891B2','#16A34A'];
    tbody.innerHTML = filtered.map((c, idx) => {
      const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
      const initials = c.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
      return `
        <tr>
          <td>
            <div class="client-cell">
              <div class="client-avatar" style="background:${color}">${initials}</div>
              <div>
                <div class="client-name">${c.name}</div>
                <div class="client-email">${c.email || c.phone}</div>
              </div>
            </div>
          </td>
          <td><span class="status-badge status-${c.status}">${c.status}</span></td>
          <td style="text-align:center;font-weight:700">${c.reservations || 0}</td>
          <td>${c.lastService || '—'}</td>
          <td>${c.prize ? `<span class="tag-badge">🎁 ${c.prize}</span>` : '—'}</td>
          <td>${c.tags?.map(t => `<span class="tag-badge">${t}</span>`).join(' ') || '—'}</td>
          <td>
            <button class="crm-action-btn" onclick="openCrmClient(${c.id})" aria-label="Ver ficha de ${c.name}">
              <span data-lucide="eye"></span> Ver
            </button>
            <a href="https://wa.me/${c.phone?.replace(/\D/g,'')}" target="_blank" rel="noopener"
               class="crm-action-btn" aria-label="WhatsApp a ${c.name}">
              <span data-lucide="message-circle"></span> WA
            </a>
          </td>
        </tr>
      `;
    }).join('');

    // Re-run lucide
    if (window.lucide) lucide.createIcons();
  }

  // ── CRM Client Modal ──
  window.openCrmClient = function(id) {
    const c = clients.find(cl => cl.id === id);
    if (!c) return;
    const modal = document.getElementById('crmModal');
    const content = document.getElementById('crmModalContent');
    if (!modal || !content) return;

    const AVATAR_COLORS = ['#FF6B00','#1E40AF','#7C3AED','#059669','#DB2777','#D97706'];
    const color = AVATAR_COLORS[id % AVATAR_COLORS.length];
    const initials = c.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();

    content.innerHTML = `
      <div class="crm-modal-header">
        <div class="crm-modal-avatar" style="background:${color}">${initials}</div>
        <div>
          <div class="crm-modal-title" id="crmModalTitle">${c.name}</div>
          <div class="crm-modal-subtitle"><span class="status-badge status-${c.status}">${c.status}</span> · Desde ${c.joinDate}</div>
        </div>
      </div>
      <div class="crm-modal-body">
        <div class="crm-modal-section">
          <h4><span data-lucide="user"></span> Información Personal</h4>
          <div class="crm-info-item"><span>Nombre</span><span>${c.name}</span></div>
          <div class="crm-info-item"><span>Email</span><span>${c.email || '—'}</span></div>
          <div class="crm-info-item"><span>Celular</span><span>${c.phone || '—'}</span></div>
          <div class="crm-info-item"><span>Cumpleaños</span><span>${c.birthday || '—'}</span></div>
          <div class="crm-info-item"><span>Etiquetas</span><span>${c.tags?.join(', ') || '—'}</span></div>
        </div>
        <div class="crm-modal-section">
          <h4><span data-lucide="bar-chart-2"></span> Historial</h4>
          <div class="crm-info-item"><span>Total Reservas</span><span>${c.reservations || 0}</span></div>
          <div class="crm-info-item"><span>Último Servicio</span><span>${c.lastService || '—'}</span></div>
          <div class="crm-info-item"><span>Total Gastado</span><span>S/ ${c.totalSpent || 0}</span></div>
          <div class="crm-info-item"><span>Premio Ganado</span><span>${c.prize || '—'}</span></div>
          <div class="crm-info-item"><span>Estado</span><span>${c.status}</span></div>
        </div>
      </div>
      <div class="crm-modal-notes">
        <h4>Notas del Cliente</h4>
        <textarea rows="4" placeholder="Agregar notas..." onchange="updateClientNote(${c.id}, this.value)">${c.notes || ''}</textarea>
        <div style="display:flex;gap:0.75rem;margin-top:1rem;flex-wrap:wrap">
          <a href="${window.WA?.link(`¡Hola ${c.name.split(' ')[0]}! 🌿 Te escribimos de Triny Masajes...`)||'#'}"
             target="_blank" rel="noopener" class="btn btn-hero-wa" style="font-size:0.85rem;padding:0.6rem 1.25rem">
            WhatsApp
          </a>
          <button class="btn btn-primary" style="font-size:0.85rem;padding:0.6rem 1.25rem" onclick="saveClientNote(${c.id})">
            Guardar Nota
          </button>
        </div>
      </div>
    `;

    modal.removeAttribute('hidden');
    document.body.classList.add('no-scroll');
    if (window.lucide) lucide.createIcons();
  };

  window.updateClientNote = function(id, value) {
    const c = clients.find(cl => cl.id === id);
    if (c) c.notes = value;
  };

  window.saveClientNote = function(id) {
    saveClients();
    showToast('Nota guardada', 'La nota del cliente fue actualizada.', 'success');
  };

  // ── Filter/Search ──
  window.setCrmFilter = function(filter, btn) {
    crmFilter = filter;
    document.querySelectorAll('#crm .crm-filter-btns .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderCRM();
  };

  window.crmFilter_global = window.crmFilter;
  window.crmFilter = function() {
    crmSearch = document.getElementById('crmSearch')?.value || '';
    renderCRM();
  };

  // ── Export ──
  window.exportCRM = function(format) {
    if (format === 'csv') {
      const headers = ['ID','Nombre','Email','Celular','Estado','Reservas','Ultimo Servicio','Premio','Gasto Total'];
      const rows = clients.map(c => [
        c.id, c.name, c.email, c.phone, c.status, c.reservations,
        c.lastService, c.prize, c.totalSpent
      ]);
      const csv = [headers, ...rows].map(r => r.map(v => `"${v||''}"`).join(',')).join('\n');
      downloadFile('triny_clientes.csv', csv, 'text/csv');
    } else {
      downloadFile('triny_clientes.json', JSON.stringify(clients, null, 2), 'application/json');
    }
    showToast('Exportado', `Clientes exportados en formato ${format.toUpperCase()}.`, 'success');
  };

  function downloadFile(filename, content, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ── Init ──
  function init() {
    loadClients();
    renderKPIs();
    renderCRM();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[Triny Masajes] CRM module loaded ✓');
})();
