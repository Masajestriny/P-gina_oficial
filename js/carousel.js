(function() {
  'use strict';

  function initCarousel() {
    const images = window.TRINY_CONFIG?.carouselImages || [];
    const image = document.getElementById('mainCarouselImage');
    const counter = document.getElementById('carouselCounter');
    const root = document.getElementById('mainCarousel');
    const intervalControl = document.getElementById('carouselInterval');
    if (!root || !image || images.length === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const failedImages = new Set();
    let index = 0;
    let interval = window.TRINY_CONFIG.carouselIntervalSeconds || 5;
    let timer;

    function showImage(nextIndex) {
      let attempts = 0;
      index = (nextIndex + images.length) % images.length;
      while (failedImages.has(index) && attempts < images.length) {
        index = (index + 1) % images.length;
        attempts++;
      }
      if (attempts >= images.length) {
        stop();
        image.hidden = true;
        root.setAttribute('aria-label', 'No se pudieron cargar las imágenes del carrusel.');
        return;
      }
      image.hidden = false;
      const entry = images[index];
      image.src = entry.src;
      image.alt = entry.alt;
      if (counter) counter.textContent = `${index + 1} / ${images.length}`;
    }

    function stop() {
      window.clearInterval(timer);
    }

    function start() {
      stop();
      if (!reducedMotion.matches && !document.hidden) {
        timer = window.setInterval(() => showImage(index + 1), interval * 1000);
      }
    }

    root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => {
      showImage(index - 1);
      start();
    });
    root.querySelector('[data-carousel-next]')?.addEventListener('click', () => {
      showImage(index + 1);
      start();
    });
    intervalControl?.addEventListener('change', () => {
      interval = Number(intervalControl.value);
      start();
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener?.('change', start);

    image.addEventListener('error', () => {
      failedImages.add(index);
      console.error(`[Carousel] No se pudo cargar la imagen: ${images[index].src}`);
      showImage(index + 1);
    });
    showImage(0);
    start();
  }

  document.addEventListener('DOMContentLoaded', initCarousel);
})();
