// ============================================================
//  TRINY MASAJES — Main Application Module
//  Orchestrates: Splash, Navbar, Scroll Reveal, Services,
//  Products, Promotions, Gallery, Testimonials, Blog, FAQ,
//  Contact, Footer, Tabs, Modals, Favorites, Counters
// ============================================================

(function() {
  'use strict';

  // ── State ──
  let favorites      = JSON.parse(localStorage.getItem('triny_favorites') || '[]');
  let serviceFilter  = 'all';
  let productCat     = 'all';
  let productSort    = 'default';
  let productSearch  = '';
  let galleryFilter  = 'playas';
  let lightboxCloser = null;

  // ── DOM Ready ──
  document.addEventListener('DOMContentLoaded', function() {
    orderLandingSections();
    initSplash();
    initNavbar();
    initScrollReveal();
    initScrollSpy();
    initCounters();
    renderServices();
    renderProducts();
    renderPromos();
    renderPackages();
    renderCoverage();
    renderTeam();
    renderGallery();
    renderTestimonials();
    renderBlog();
    renderFAQ();
    initModals();
    initContactForm();
    setFooterYear();
    initTabSystem();
    lucide.createIcons();
  });

  function orderLandingSections() {
    const orderedIds = [
      'servicios', 'promociones', 'giftcards', 'nosotros', 'equipo', 'beneficios',
      'cobertura', 'carrito', 'galeria', 'testimonios', 'videos', 'blog',
      'faq', 'contacto'
    ];
    let previous = document.getElementById('inicio');
    orderedIds.forEach(id => {
      const section = document.getElementById(id);
      if (!previous || !section) return;
      previous.insertAdjacentElement('afterend', section);
      previous = section;
    });
  }

  // ────────────────────────────────────────────
  //  SPLASH SCREEN
  // ────────────────────────────────────────────
  function initSplash() {
    const splash = document.getElementById('splash-screen');
    const fill   = document.getElementById('splashFill');
    if (!splash || !fill) return;

    document.body.classList.add('no-scroll');

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 4;
      if (progress >= 100) { progress = 100; clearInterval(interval); }
      fill.style.width = progress + '%';
      if (progress === 100) {
        setTimeout(() => {
          splash.classList.add('hidden');
          document.body.classList.remove('no-scroll');
          setTimeout(() => splash.remove(), 700);
        }, 400);
      }
    }, 80);
  }

  // ────────────────────────────────────────────
  //  NAVBAR
  // ────────────────────────────────────────────
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    hamburger?.addEventListener('click', () => {
      const isOpen = navMenu?.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
      document.body.classList.toggle('no-scroll', isOpen);
    });

    // Close menu on nav link click
    navMenu?.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
        hamburger?.setAttribute('aria-label', 'Abrir menú de navegación');
        document.body.classList.toggle('no-scroll', !!document.querySelector('.drawer-backdrop:not([hidden]), .modal-overlay:not([hidden])'));
      });
    });

    hamburger?.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !navMenu?.classList.contains('open')) return;
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
      document.body.classList.toggle('no-scroll', !!document.querySelector('.drawer-backdrop:not([hidden]), .modal-overlay:not([hidden])'));
      hamburger.focus();
    });

    navMenu?.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !navMenu.classList.contains('open')) return;
      navMenu.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      hamburger?.setAttribute('aria-label', 'Abrir menú de navegación');
      document.body.classList.toggle('no-scroll', !!document.querySelector('.drawer-backdrop:not([hidden]), .modal-overlay:not([hidden])'));
      hamburger?.focus();
    });
  }

  // ────────────────────────────────────────────
  //  SCROLL REVEAL
  // ────────────────────────────────────────────
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ────────────────────────────────────────────
  //  SCROLL SPY (active nav links)
  // ────────────────────────────────────────────
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
          active?.classList.add('active');
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(s => obs.observe(s));
  }

  // ────────────────────────────────────────────
  //  ANIMATED COUNTERS
  // ────────────────────────────────────────────
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count);
    const duration = 2000;
    const start    = performance.now();
    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(eased * target);
      el.textContent = value >= 1000 ? value.toLocaleString('es-PE') + '+' : value + (progress < 1 ? '' : '+');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ────────────────────────────────────────────
  //  SERVICES
  // ────────────────────────────────────────────
  function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;

    const filtered = serviceFilter === 'all'
      ? SERVICES_DATA
      : SERVICES_DATA.filter(s => s.category === serviceFilter);

    grid.innerHTML = filtered.map(s => {
      const isFav = favorites.includes(s.id);
      return `
        <article class="service-card reveal" role="listitem" data-category="${s.category}">
          <div class="service-img-wrap">
            <img src="${s.img}" alt="${s.name} en Triny Masajes" loading="lazy"
                 onerror="this.hidden=true" />
          </div>
          <div class="service-body">
            <div class="service-card-heading">
              <h3 class="service-name">${s.name}</h3>
              <div class="service-actions-top">
              <button class="sa-btn${isFav?' favorited':''}" onclick="toggleFavorite(${s.id},this)"
                aria-label="${isFav?'Quitar de':'Agregar a'} favoritos">
                <i data-lucide="heart"></i>
              </button>
              <button class="sa-btn" onclick="shareService('${s.name}')" aria-label="Compartir servicio">
                <i data-lucide="share-2"></i>
              </button>
              </div>
            </div>
            <p class="service-desc">${s.desc}</p>
            <div class="service-meta">
              <span class="service-duration"><i data-lucide="clock"></i>${s.duration}</span>
              <span class="service-price">${s.priceLabel}</span>
            </div>
          </div>
          <div class="service-card-actions">
            <button class="btn btn-outline" onclick="openServiceModal(${s.id})">Más info</button>
            <div class="quantity-picker" role="group" aria-label="Cantidad de sesiones para ${s.name}">
              <span>Sesiones</span>
              <div class="quantity-controls">
                <button type="button" aria-label="Quitar una sesión de ${s.name}" onclick="adjustQuantity('serviceQuantity-${s.id}',-1)">−</button>
                <input type="number" min="1" max="99" value="1" id="serviceQuantity-${s.id}" aria-label="Cantidad de sesiones de ${s.name}" />
                <button type="button" aria-label="Agregar una sesión de ${s.name}" onclick="adjustQuantity('serviceQuantity-${s.id}',1)">+</button>
              </div>
            </div>
            <button type="button" class="btn btn-primary" onclick="TrinyCart.add('service',${s.id},document.getElementById('serviceQuantity-${s.id}').value)">
              <i data-lucide="shopping-cart" aria-hidden="true"></i> Al carrito
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Re-observe reveals
    document.querySelectorAll('.service-card.reveal:not(.visible)').forEach(el => {
      setTimeout(() => el.classList.add('visible'), 100);
    });
    if (window.lucide) lucide.createIcons();
  }

  window.filterServices = function(cat, btn) {
    serviceFilter = cat;
    document.querySelectorAll('#servicios .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderServices();
  };

  window.toggleFavorite = function(id, btn) {
    const idx = favorites.indexOf(id);
    if (idx >= 0) {
      favorites.splice(idx, 1);
      btn?.classList.remove('favorited');
      showToast('Eliminado de favoritos', '', 'info', 2000);
    } else {
      favorites.push(id);
      btn?.classList.add('favorited');
      showToast('¡Agregado a favoritos!', '', 'success', 2000);
    }
    localStorage.setItem('triny_favorites', JSON.stringify(favorites));
  };

  window.shareService = function(name) {
    if (navigator.share) {
      navigator.share({
        title: `${name} — Triny Masajes`,
        text:  `Te recomiendo el ${name} en Triny Masajes. ¡Increíble experiencia!`,
        url:   window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Enlace copiado', 'Comparte con quien quieras.', 'success', 2000);
    }
  };

  // ── Service Modal ──
  window.openServiceModal = function(id) {
    const s = SERVICES_DATA.find(s => s.id === id);
    if (!s) return;
    const modal   = document.getElementById('serviceModal');
    const content = document.getElementById('serviceModalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <img src="${s.img}" alt="${s.name}" class="service-modal-img" onerror="this.hidden=true" loading="lazy" />
      <div class="service-modal-body">
        <h2 class="service-modal-title" id="modalServiceTitle">${s.name}</h2>
        <div class="service-modal-meta">
          <span class="smeta-item"><i data-lucide="clock"></i>${s.duration}</span>
          <span class="smeta-price">${s.priceLabel}</span>
        </div>
        <p class="service-modal-desc">${s.desc}</p>
        <div class="service-modal-benefits">
          <h4>Beneficios</h4>
          <ul>${s.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>
        <div class="service-modal-actions">
          <button class="btn btn-outline" onclick="TrinyCart.add('service',${s.id},1);closeModal('serviceModal')">
            <i data-lucide="shopping-cart" aria-hidden="true"></i> Agregar al carrito
          </button>
          <button class="btn btn-primary" onclick="closeModal('serviceModal');startBookingForService(${s.id})">
            Solicitar este masaje
          </button>
        </div>
      </div>
    `;

    modal.removeAttribute('hidden');
    document.body.classList.add('no-scroll');
    if (window.lucide) lucide.createIcons();
  };

  function renderPackages() {
    const grid = document.getElementById('packagesGrid');
    if (!grid) return;
    grid.innerHTML = PACKAGES_DATA.map(pack => `
      <article class="package-card">
        <h3>${pack.name}</h3>
        <p class="package-price">S/ ${pack.priceNum} <span>por ${pack.sessions} sesiones</span></p>
        <ul>${pack.details.map(detail => `<li>${detail}</li>`).join('')}</ul>
        ${pack.singleSessionPrice ? `<p>Sesión individual: S/ ${pack.singleSessionPrice}</p>` : ''}
        ${pack.terms ? `<p class="package-note">${pack.terms}</p><p>Domingos y feriados: S/ ${pack.holidayPrice} (condición por confirmar).</p>` : ''}
        <div class="quantity-picker" role="group" aria-label="Cantidad de paquetes de ${pack.name}">
          <span>Paquetes (cada uno incluye ${pack.sessions} sesiones)</span>
          <div class="quantity-controls">
            <button type="button" aria-label="Quitar un paquete de ${pack.name}" onclick="adjustQuantity('packageQuantity-${pack.id}',-1)">−</button>
            <input type="number" min="1" max="99" value="1" id="packageQuantity-${pack.id}" aria-label="Cantidad de paquetes de ${pack.name}" />
            <button type="button" aria-label="Agregar un paquete de ${pack.name}" onclick="adjustQuantity('packageQuantity-${pack.id}',1)">+</button>
          </div>
        </div>
        <button type="button" class="btn btn-primary" onclick="TrinyCart.add('package','${pack.id}',document.getElementById('packageQuantity-${pack.id}').value)">
          <i data-lucide="shopping-cart" aria-hidden="true"></i> Al carrito
        </button>
      </article>
    `).join('');
    if (window.lucide) lucide.createIcons();
  }

  window.adjustQuantity = function(id, delta) {
    const input = document.getElementById(id);
    if (!input) return;
    const current = Number(input.value);
    const value = Number.isFinite(current) ? current : 1;
    input.value = String(Math.max(1, Math.min(99, value + delta)));
  };

  function renderCoverage() {
    const root = document.getElementById('coverageGroups');
    const coverage = window.TRINY_CONFIG?.coverage;
    if (!root || !coverage) return;
    const lima = coverage.lima.map(place => place.label);
    const asia = coverage.playas['Asia y condominios'] || [];
    const pending = coverage.playas['Ubicación pendiente de validar'] || [];
    const south = Object.entries(coverage.playas)
      .filter(([group]) => group !== 'Asia y condominios' && group !== 'Ubicación pendiente de validar')
      .map(([group, places]) => `<div class="coverage-subgroup"><h4>${group}</h4><ul>${places.map(place => `<li>${place}</li>`).join('')}</ul></div>`)
      .join('');
    root.innerHTML = `
      <article class="coverage-group"><span class="coverage-index">01</span><h3>Lima</h3><p>Distritos incluidos en la información de cobertura.</p><ul>${lima.map(place => `<li>${place}</li>`).join('')}</ul></article>
      <article class="coverage-group"><span class="coverage-index">02</span><h3>Playas del Sur Chico</h3><p>Consulta disponibilidad específica de tu playa o localidad.</p>${south}</article>
      <article class="coverage-group"><span class="coverage-index">03</span><h3>Asia y condominios</h3><p>Confirma acceso, ubicación y disponibilidad con el equipo.</p><ul>${asia.map(place => `<li>${place}</li>`).join('')}</ul></article>
      ${pending.length ? `<p class="coverage-pending"><strong>Ubicación pendiente de validar:</strong> ${pending.join(', ')}. Consulta con la central antes de solicitar el servicio.</p>` : ''}
      <p class="coverage-note">La lista muestra las zonas configuradas, no garantiza disponibilidad. La reserva se coordina y confirma con el equipo.</p>
    `;
  }

  // ────────────────────────────────────────────
  //  PRODUCTS
  // ────────────────────────────────────────────
  function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let filtered = [...PRODUCTS_DATA];
    if (productCat !== 'all') filtered = filtered.filter(p => p.category === productCat);
    if (productSearch) {
      const q = productSearch.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    }

    if (productSort === 'price-asc')  filtered.sort((a,b) => a.price - b.price);
    if (productSort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
    if (productSort === 'name')       filtered.sort((a,b) => a.name.localeCompare(b.name));

    grid.innerHTML = filtered.length === 0
      ? `<div style="grid-column:1/-1;text-align:center;color:var(--gray-400);padding:3rem">Sin resultados para tu búsqueda.</div>`
      : filtered.map(p => `
        <article class="product-card" role="listitem">
          <div class="product-img-wrap">
            <img src="${p.img}" alt="${p.name}" loading="lazy"
                 onerror="this.src='img/Masaje relajante.png'" />
            ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
          </div>
          <div class="product-body">
            <div class="product-cat">${p.category}</div>
            <h3 class="product-name">${p.name}</h3>
            <p class="product-desc">${p.desc}</p>
          </div>
          <div class="product-footer">
            <span class="product-price">${p.priceLabel}</span>
            <button class="product-add-btn" onclick="addToCart('${p.name}',${p.price})">
              + Agregar
            </button>
          </div>
        </article>
      `).join('');
  }

  window.setProductCat = function(cat, btn) {
    productCat = cat;
    document.querySelectorAll('.products-cats .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderProducts();
  };

  window.filterProducts = function() {
    productSearch = document.getElementById('productSearch')?.value || '';
    renderProducts();
  };

  window.sortProducts = function() {
    productSort = document.getElementById('productSort')?.value || 'default';
    renderProducts();
  };

  window.addToCart = function(name, price) {
    showToast('¡Producto seleccionado!', `${name} — S/ ${price}. Contáctanos para coordinar tu pedido.`, 'success');
    // Future: integrate with payment gateway
  };

  // ────────────────────────────────────────────
  //  PROMOTIONS
  // ────────────────────────────────────────────
  function renderPromos() {
    const grid = document.getElementById('promosGrid');
    if (!grid) return;

    grid.innerHTML = PROMOS_DATA.map(p => `
      <article class="promo-card${p.featured?' featured':''} reveal" role="listitem">
        ${p.featured ? '<div class="promo-badge">POPULAR</div>' : ''}
        <div class="promo-header">
          <div class="promo-icon">${p.icon}</div>
          <div class="promo-name">${p.name}</div>
          <div class="promo-discount">${p.discount}</div>
          <div class="promo-discount-label">de descuento</div>
        </div>
        <div class="promo-body">
          <ul class="promo-includes">${p.includes.map(i => `<li>${i}</li>`).join('')}</ul>
          <div class="promo-price">
            <span class="promo-price-new">${p.priceNew}</span>
            <span class="promo-price-old">${p.priceOld}</span>
          </div>
          <a href="${window.WA?.link(`¡Hola! Quiero el ${p.name} de Triny Masajes por ${p.priceNew}`)||'#'}"
             target="_blank" rel="noopener" class="btn btn-primary w-full">
            Reservar este Pack
          </a>
        </div>
      </article>
    `).join('');

    // Coupons
    const cupGrid = document.getElementById('cuponesGrid');
    if (cupGrid) {
      cupGrid.innerHTML = CUPONES_DATA.map(c => `
        <div class="cupon-card reveal">
          <div class="cupon-info">
            <div class="cupon-code">${c.code}</div>
            <div class="cupon-desc">${c.desc}</div>
            <div class="cupon-desc" style="margin-top:0.25rem;opacity:0.6;font-size:0.72rem">🕐 ${c.expires}</div>
          </div>
          <button class="cupon-copy-btn" onclick="copyCoupon('${c.code}')" aria-label="Copiar código ${c.code}">
            <i data-lucide="copy"></i> Copiar
          </button>
        </div>
      `).join('');
    }

    document.querySelectorAll('.promo-card.reveal, .cupon-card.reveal').forEach(el => {
      setTimeout(() => el.classList.add('visible'), 100);
    });
    if (window.lucide) lucide.createIcons();
  }

  window.copyCoupon = function(code) {
    navigator.clipboard?.writeText(code).then(() => {
      showToast('¡Código copiado!', `${code} — Úsalo en tu próxima reserva.`, 'success');
    }).catch(() => {
      showToast('Código:', code, 'info');
    });
  };

  // ────────────────────────────────────────────
  //  TEAM
  // ────────────────────────────────────────────
  function renderTeam() {
    const grid = document.getElementById('teamGrid');
    if (!grid) return;
    grid.innerHTML = TEAM_DATA.map(member => `
      <article class="team-card reveal" role="listitem">
        <div class="team-photo">
          <img src="${member.image}" alt="${member.name}" loading="lazy" />
        </div>
        <h3>${member.name}</h3>
      </article>
    `).join('');
    grid.querySelectorAll('.team-card.reveal').forEach(card => card.classList.add('visible'));
  }

  // ────────────────────────────────────────────
  //  GALLERY
  // ────────────────────────────────────────────
  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const data = GALLERY_DATA.filter(image => image.category === galleryFilter);

    grid.innerHTML = data.length ? data.map(image => `
      <button class="gallery-preview" type="button" role="listitem"
            onclick="openLightbox('${image.src}', this, '${image.alt}')"
              aria-label="Ampliar fotografía: ${image.alt}">
        <img src="${image.src}" alt="${image.alt}" loading="lazy" />
      </button>
    `).join('') : `
      <p class="gallery-pending" role="status">
        ${galleryFilter === 'lima'
          ? 'Aún no contamos con fotografías verificadas de lugares de Lima para esta galería. No mostramos retratos del equipo como sustituto.'
          : 'Todavía no hay fotografías disponibles para esta galería.'}
      </p>
    `;

    // Before & After
    const baGrid = document.getElementById('beforeAfterGrid');
    if (baGrid) {
      const section = baGrid.closest('.before-after-section');
      if (section) section.hidden = BEFORE_AFTER_DATA.length === 0;
      baGrid.innerHTML = BEFORE_AFTER_DATA.map(ba => `
        <div class="ba-card">
          <div class="ba-images">
            <img src="${ba.img1}" alt="Antes del tratamiento" loading="lazy" />
            <img src="${ba.img2}" alt="Después del tratamiento" loading="lazy" />
            <div class="ba-divider" aria-hidden="true"></div>
          </div>
          <div class="ba-labels">
            <div class="ba-label">Antes</div>
            <div class="ba-label">Después</div>
          </div>
          <div class="ba-info">
            <h4>${ba.title}</h4>
            <p>${ba.desc}</p>
          </div>
        </div>
      `).join('');
    }
  }

  window.filterGallery = function(cat, btn) {
    galleryFilter = cat;
    document.querySelectorAll('#galeria .gallery-filter .filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#galeria .gallery-filter .filter-btn').forEach(button => button.setAttribute('aria-pressed', 'false'));
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    }
    renderGallery();
  };

  window.toggleBlogArticle = function(button) {
    const article = document.getElementById(button.getAttribute('aria-controls'));
    if (!article) return;
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    article.hidden = expanded;
    const label = button.querySelector('span');
    if (label) label.textContent = expanded ? 'Leer artículo completo' : 'Cerrar artículo';
  };

  window.openLightbox = function(src, trigger, alt = '') {
    if (lightboxCloser) lightboxCloser();
    const opener = trigger || document.activeElement;
    const lb = document.createElement('div');
    lb.id = 'lightboxOverlay';
    lb.className = 'gallery-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', alt ? `Vista ampliada: ${alt}` : 'Vista ampliada de la imagen');
    lb.tabIndex = -1;
    const image = document.createElement('img');
    image.src = src;
    image.alt = alt;
    lb.appendChild(image);

    const close = () => {
      document.removeEventListener('keydown', handleKeydown, true);
      document.removeEventListener('focusin', keepFocusInDialog, true);
      lb.remove();
      lightboxCloser = null;
      if (opener && opener.isConnected && typeof opener.focus === 'function') opener.focus();
    };
    const handleKeydown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        lb.focus();
      }
    };
    const keepFocusInDialog = event => {
      if (!lb.contains(event.target)) lb.focus();
    };
    lb.addEventListener('click', event => {
      if (event.target === lb) close();
    });
    document.body.appendChild(lb);
    lightboxCloser = close;
    document.addEventListener('keydown', handleKeydown, true);
    document.addEventListener('focusin', keepFocusInDialog, true);
    lb.focus();
  };

  // ────────────────────────────────────────────
  //  TESTIMONIALS
  // ────────────────────────────────────────────
  function renderTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    if (!TESTIMONIALS_DATA.length) {
      grid.innerHTML = '<p class="testimonials-empty">Aún no hay opiniones verificadas y autorizadas para publicar.</p>';
      return;
    }
    grid.innerHTML = TESTIMONIALS_DATA.map(t => `
      <article class="testimonial-card" role="listitem">
        <div class="test-header">
          <div class="test-avatar" style="background:${t.avatarColor}" aria-hidden="true">${t.initials}</div>
          <div class="test-info">
            <div class="test-name">${t.name}</div>
            <div class="test-service">${t.service}</div>
            <div class="test-stars" role="img" aria-label="${t.rating} de 5 estrellas">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</div>
          </div>
        </div>
        <blockquote class="test-text">${t.text}</blockquote>
      </article>
    `).join('');
  }

  // ────────────────────────────────────────────
  //  BLOG
  // ────────────────────────────────────────────
  function renderBlog() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    if (!BLOG_DATA.length) {
      grid.innerHTML = '<p class="blog-pending">Las publicaciones se mostrarán aquí cuando sus contenidos, autoría y fecha estén validados.</p>';
      return;
    }
    grid.innerHTML = BLOG_DATA.map(b => `
      <article class="blog-card" role="listitem">
        ${b.img ? `
          <div class="blog-img-wrap">
            <img src="${b.img}" alt="${b.imgAlt || ''}" loading="lazy" />
          </div>
        ` : ''}
        <div class="blog-body">
          <span class="blog-cat">${b.category}</span>
          <h3 class="blog-title" id="blog-title-${b.id}">${b.title}</h3>
          <p class="blog-excerpt">${b.excerpt}</p>
          <div class="blog-meta">
            <span>Lectura orientativa</span>
            <span>${b.readTime}</span>
          </div>
          <button type="button" class="blog-read-more" onclick="toggleBlogArticle(this)"
                  aria-expanded="false" aria-controls="blog-article-${b.id}">
            <span>Leer artículo completo</span><i data-lucide="arrow-right" aria-hidden="true"></i>
          </button>
          <div class="blog-article-content" id="blog-article-${b.id}" role="region"
               aria-labelledby="blog-title-${b.id}" hidden>
            ${b.sections.map(section => `
              <section class="blog-article-section">
                <h4>${section.heading}</h4>
                <p>${section.text}</p>
              </section>
            `).join('')}
            <div class="blog-sources">
              <h4>Fuentes para ampliar</h4>
              <ul>
                ${b.sources.map(source => `
                  <li><a href="${source.href}" target="_blank" rel="noopener noreferrer">${source.label}</a></li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      </article>
    `).join('');
    if (window.lucide) lucide.createIcons();
  }

  // ────────────────────────────────────────────
  //  FAQ (Accordion)
  // ────────────────────────────────────────────
  function renderFAQ() {
    const container = document.getElementById('faqContainer');
    if (!container) return;
    container.innerHTML = FAQ_DATA.map((f, i) => `
      <div class="faq-item" role="listitem">
        <button class="faq-question" type="button"
             onclick="toggleFAQ(this)"
             aria-expanded="false"
             aria-controls="faq-answer-${i}">
          <span>${f.q}</span>
          <span class="faq-chevron" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
        </button>
        <div class="faq-answer" id="faq-answer-${i}" role="region" hidden>
          <div class="faq-answer-inner">${f.a}</div>
        </div>
      </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
  }

  window.toggleFAQ = function(questionEl) {
    const item   = questionEl.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      const answer = i.querySelector('.faq-answer');
      if (answer) answer.hidden = true;
    });

    // Open clicked (unless it was already open)
    if (!isOpen) {
      item.classList.add('open');
      questionEl.setAttribute('aria-expanded', 'true');
      const answer = item.querySelector('.faq-answer');
      if (answer) answer.hidden = false;
    }
  };

  // ────────────────────────────────────────────
  //  TABS (Sobre Nosotros)
  // ────────────────────────────────────────────
  function initTabSystem() {
    // Already wired via onclick in HTML, but ensure icons
    if (window.lucide) lucide.createIcons();
  }

  window.switchTab = function(btn, tabId) {
    const panel = btn.closest('.nosotros-content');
    panel?.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    panel?.querySelectorAll('.tab-content').forEach(t => {
      t.classList.remove('active');
      t.hidden = true;
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const tab = document.getElementById(tabId);
    if (tab) { tab.classList.add('active'); tab.hidden = false; }
    if (window.lucide) lucide.createIcons();
  };

  // ────────────────────────────────────────────
  //  MODALS
  // ────────────────────────────────────────────
  function initModals() {
    // Close on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay:not([hidden])').forEach(m => closeModal(m.id));
      }
    });
  }

  window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.classList.remove('no-scroll');
  };

  // ────────────────────────────────────────────
  //  CONTACT FORM
  // ────────────────────────────────────────────
  function initContactForm() {
    // Handled via onsubmit in HTML
  }

  window.submitContactForm = function(e) {
    e.preventDefault();
    const form = e.target;
    const nombre   = document.getElementById('cNombre')?.value?.trim();
    const email    = document.getElementById('cEmail')?.value?.trim();
    const mensaje  = document.getElementById('cMensaje')?.value?.trim();
    const privacidad = document.getElementById('cPrivacidad')?.checked;

    if (!nombre || !email || !mensaje) {
      showToast('Campos requeridos', 'Por favor completa nombre, email y mensaje.', 'warning');
      return;
    }
    if (!privacidad) {
      showToast('Privacidad requerida', 'Debes aceptar las políticas de privacidad.', 'warning');
      return;
    }

    // Simulate sending
    showToast('¡Mensaje enviado!', 'Te responderemos a la brevedad posible. ¡Gracias!', 'success');
    form.reset();

    // Register in CRM
    if (window.CRM_addClient) {
      window.CRM_addClient({
        name:    nombre,
        email:   email,
        phone:   document.getElementById('cPhone')?.value || '',
        service: document.getElementById('cServicio')?.value || '',
        notes:   `Contacto web: ${mensaje}`,
      });
    }
  };

  // ────────────────────────────────────────────
  //  FOOTER YEAR
  // ────────────────────────────────────────────
  function setFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  console.log('[Triny Masajes] Main app module loaded ✓');
})();
