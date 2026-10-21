(function() {
  'use strict';

  const reelIds = [
    'C9ktqboJ-uV',
    'DcxXsm5Bd6C',
    'Dclpv4nhbAF',
    'Dchik23Bsnw',
    'DccDEFOh5O3',
    'DcYpYkHh2Lh',
    'DcVxcQThue5',
    'DcTyxU5hhY2',
    'C900juTJEnm',
    'C9lSGjZJada',
    'C9Vka5FSDnF',
    'C8-kZ8OO5T6',
    'C8awCkcIrhK'
  ];

  function initReels() {
    const track = document.getElementById('reelTrack');
    const previous = document.getElementById('reelPrevious');
    const next = document.getElementById('reelNext');
    const position = document.getElementById('reelPosition');
    if (!track || !previous || !next) return;

    const cards = reelIds.map((id, index) => {
      const card = document.createElement('article');
      card.className = 'reel-card';
      card.dataset.reelId = id;
      card.dataset.reelIndex = String(index);
      card.setAttribute('aria-label', `Video ${index + 1} de ${reelIds.length}`);
      track.appendChild(card);
      return card;
    });

    function loadPlayer(card) {
      if (card.querySelector('iframe')) return;
      const index = Number(card.dataset.reelIndex);
      const frame = document.createElement('iframe');
      frame.src = `https://www.instagram.com/reel/${card.dataset.reelId}/embed/`;
      frame.title = `Video de Instagram de Triny Masajes ${index + 1} de ${reelIds.length}`;
      frame.loading = 'lazy';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture';
      frame.allowFullscreen = true;
      card.appendChild(frame);
    }

    function firstVisibleIndex() {
      const trackLeft = track.getBoundingClientRect().left;
      let closest = 0;
      let closestDistance = Infinity;
      cards.forEach((card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (distance < closestDistance) {
          closest = index;
          closestDistance = distance;
        }
      });
      return closest;
    }

    let visibilityFrame = 0;
    function loadNearbyPlayers() {
      visibilityFrame = 0;
      const trackBounds = track.getBoundingClientRect();
      if (trackBounds.bottom < -300 || trackBounds.top > window.innerHeight + 300) return;

      cards.forEach(card => {
        const bounds = card.getBoundingClientRect();
        const nearTrack = bounds.right > trackBounds.left - 300 &&
          bounds.left < trackBounds.right + 300;
        const nearViewport = bounds.bottom > -300 &&
          bounds.top < window.innerHeight + 300;
        if (nearTrack && nearViewport) loadPlayer(card);
      });
    }

    function schedulePlayerCheck() {
      if (visibilityFrame) return;
      visibilityFrame = window.requestAnimationFrame(loadNearbyPlayers);
    }

    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) schedulePlayerCheck();
      }, { rootMargin: '300px 0px' });
      sectionObserver.observe(track);
    }

    window.addEventListener('scroll', schedulePlayerCheck, { passive: true });
    window.addEventListener('resize', schedulePlayerCheck);
    track.addEventListener('scroll', schedulePlayerCheck, { passive: true });
    schedulePlayerCheck();

    function updateControls() {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      previous.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= maxScroll - 1;
      if (position) {
        const index = firstVisibleIndex();
        position.textContent = `Video ${index + 1} de ${reelIds.length}`;
      }
    }

    function move(direction) {
      const card = cards[firstVisibleIndex()];
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const step = card.getBoundingClientRect().width + gap;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollBy({ left: direction * step, behavior: reducedMotion ? 'auto' : 'smooth' });
    }

    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls);
    updateControls();
  }

  document.addEventListener('DOMContentLoaded', initReels);
})();
