(function() {
  'use strict';

  function initCarousel() {
    const images = window.TRINY_CONFIG?.carouselImages || [];
    const image = document.getElementById('mainCarouselImage');
    const root = document.getElementById('mainCarousel');
    if (!root || !image || images.length === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const failedImages = new Set();
    let index = 0;
    let timer;

    function showImage(nextIndex) {
      let attempts = 0;
      let candidate = (nextIndex + images.length) % images.length;
      while (failedImages.has(candidate) && attempts < images.length) {
        candidate = (candidate + 1) % images.length;
        attempts++;
      }
      if (attempts >= images.length) {
        stop();
        image.hidden = true;
        root.setAttribute('aria-label', 'No se pudieron cargar las imágenes del carrusel.');
        return;
      }

      const entry = images[candidate];
      const preload = new Image();
      preload.onload = () => {
        index = candidate;
        image.hidden = false;
        image.alt = entry.alt;
        image.classList.add('is-changing');
        image.src = entry.src;
        requestAnimationFrame(() => image.classList.remove('is-changing'));
      };
      preload.onerror = () => {
        failedImages.add(candidate);
        showImage(candidate + 1);
      };
      preload.src = entry.src;
    }

    function stop() {
      window.clearInterval(timer);
    }

    function start() {
      stop();
      if (!reducedMotion.matches && !document.hidden) {
        timer = window.setInterval(() => showImage(index + 1), 3000);
      }
    }

    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener?.('change', start);
    showImage(0);
    start();
  }

  document.addEventListener('DOMContentLoaded', initCarousel);
})();
