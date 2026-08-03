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
  let galleryFilter  = 'all';

  // ── DOM Ready ──
  document.addEventListener('DOMContentLoaded', function() {
    initSplash();
    initNavbar();
    initScrollReveal();
    initScrollSpy();
    initCounters();
    renderServices();
    renderProducts();
    renderPromos();
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
      document.body.classList.toggle('no-scroll', isOpen);
    });

    // Close menu on nav link click
    navMenu?.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
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
                 onerror="this.src='img/491791637_3930027970579804_1729663323855883877_n.jpg'" />
            <div class="service-badge">${s.icon}</div>
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
          <div class="service-body">
            <h3 class="service-name">${s.name}</h3>
            <p class="service-desc">${s.desc}</p>
            <div class="service-meta">
              <span class="service-duration"><i data-lucide="clock"></i>${s.duration}</span>
              <span class="service-price">${s.price}</span>
            </div>
          </div>
          <div class="service-card-actions">
            <button class="btn btn-outline" onclick="openServiceModal(${s.id})">Más info</button>
            <a href="${window.WA?.bookService(s.name)||'#'}" target="_blank" rel="noopener" class="btn btn-primary">
              <i data-lucide="calendar-plus"></i> Reservar
            </a>
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
      <img src="${s.img}" alt="${s.name}" class="service-modal-img"
           onerror="this.src='img/491791637_3930027970579804_1729663323855883877_n.jpg'" loading="lazy" />
      <div class="service-modal-body">
        <h2 class="service-modal-title" id="modalServiceTitle">${s.name}</h2>
        <div class="service-modal-meta">
          <span class="smeta-item"><i data-lucide="clock"></i>${s.duration}</span>
          <span class="smeta-item"><i data-lucide="tag"></i>${s.category}</span>
          <span class="smeta-price">${s.price}</span>
        </div>
        <p class="service-modal-desc">${s.desc}</p>
        <div class="service-modal-benefits">
          <h4>Beneficios</h4>
          <ul>${s.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>
        <div class="service-modal-actions">
          <a href="${window.WA?.bookService(s.name)||'#'}" target="_blank" rel="noopener" class="btn btn-hero-wa">
            Reservar por WhatsApp
          </a>
          <button class="btn btn-primary" onclick="document.getElementById('reservas').scrollIntoView({behavior:'smooth'});closeModal('serviceModal')">
            <i data-lucide="calendar-plus"></i> Reservar Online
          </button>
        </div>
      </div>
    `;

    modal.removeAttribute('hidden');
    document.body.classList.add('no-scroll');
    if (window.lucide) lucide.createIcons();
  };

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
                 onerror="this.src='img/491791637_3930027970579804_1729663323855883877_n.jpg'" />
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
  //  GALLERY
  // ────────────────────────────────────────────
  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const data = GALLERY_DATA.filter(g => galleryFilter === 'all' || g.category === galleryFilter);

    grid.innerHTML = data.map(g => `
      <figure class="gallery-item${g.tall ? ' tall' : ''}" 
              role="listitem" 
              onclick="openLightbox('${g.src}','${g.alt}')"
              tabindex="0"
              aria-label="Ver imagen: ${g.alt}">
        <img src="${g.src}" alt="${g.alt}" loading="lazy" />
        <div class="gallery-overlay" aria-hidden="true">
          <svg class="gallery-overlay-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1"/>
          </svg>
        </div>
      </figure>
    `).join('');

    // Before & After
    const baGrid = document.getElementById('beforeAfterGrid');
    if (baGrid) {
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
    if (btn) btn.classList.add('active');
    renderGallery();
  };

  window.openLightbox = function(src, alt) {
    const existing = document.getElementById('lightboxOverlay');
    if (existing) existing.remove();
    const lb = document.createElement('div');
    lb.id = 'lightboxOverlay';
    lb.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;cursor:zoom-out;animation:modalBgIn 0.2s ease';
    lb.innerHTML = `<img src="${src}" alt="${alt}" style="max-width:92vw;max-height:90vh;object-fit:contain;border-radius:12px;box-shadow:0 0 60px rgba(0,0,0,0.5);" loading="lazy"/>`;
    lb.addEventListener('click', () => lb.remove());
    lb.addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'Enter') lb.remove(); });
    document.body.appendChild(lb);
    lb.focus();
  };

  // ────────────────────────────────────────────
  //  TESTIMONIALS
  // ────────────────────────────────────────────
  function renderTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
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
    grid.innerHTML = BLOG_DATA.map(b => `
      <article class="blog-card" role="listitem">
        <div class="blog-img-wrap">
          <img src="${b.img}" alt="${b.title}" loading="lazy"
               onerror="this.src='img/494072324_3943036845945583_4337052228856049629_n.jpg'" />
        </div>
        <div class="blog-body">
          <span class="blog-cat">${b.category}</span>
          <h3 class="blog-title">${b.title}</h3>
          <p class="blog-excerpt">${b.excerpt}</p>
          <div class="blog-meta">
            <span class="blog-author">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              ${b.author}
            </span>
            <span>${b.date} · ${b.readTime}</span>
          </div>
          <button class="blog-read-more" onclick="showToast('Próximamente','El blog completo estará disponible pronto.','info')" aria-label="Leer artículo completo">
            Leer más <i data-lucide="arrow-right"></i>
          </button>
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
        <div class="faq-question" 
             onclick="toggleFAQ(this)" 
             role="button" 
             tabindex="0"
             aria-expanded="false"
             aria-controls="faq-answer-${i}"
             onkeydown="if(event.key==='Enter'||event.key===' ')toggleFAQ(this)">
          <span>${f.q}</span>
          <span class="faq-chevron" aria-hidden="true"><i data-lucide="chevron-down"></i></span>
        </div>
        <div class="faq-answer" id="faq-answer-${i}" role="region">
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
    });

    // Open clicked (unless it was already open)
    if (!isOpen) {
      item.classList.add('open');
      questionEl.setAttribute('aria-expanded', 'true');
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
