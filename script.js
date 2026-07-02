// Cúspides v56 — JS liviano sobre base v54
const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

// Navbar compacta sin trabar scroll
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 42);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
})();

// Hero: cambio automático de título con entrada hacia arriba, sin movimiento hacia abajo
(() => {
  const hero = document.querySelector('.hero-v50');
  const title = hero?.querySelector('.hero-title-one');
  const titleTwo = hero?.querySelector('.hero-title-two');
  if (!hero || !title) return;

  const titles = ['La altura<br>se gana.', 'El límite<br>se entrena.'];
  let index = 0;
  if (titleTwo) titleTwo.setAttribute('aria-hidden', 'true');

  const animateTitle = () => {
    index = (index + 1) % titles.length;
    title.classList.remove('title-shift-up');
    void title.offsetWidth;
    title.innerHTML = titles[index];
    title.classList.add('title-shift-up');
  };

  title.classList.add('title-shift-up');
  window.setInterval(animateTitle, 2700);
})();

// Carrusel de expediciones v96: fluido, estable y con card central destacada
(() => {
  const carousel = document.querySelector('#expediciones .course-carousel');
  const track = carousel?.querySelector('.course-carousel-track');
  const prev = carousel?.querySelector('[data-course-prev]');
  const next = carousel?.querySelector('[data-course-next]');
  if (!carousel || !track || !prev || !next) return;

  const cards = Array.from(track.querySelectorAll('.premium-course'));
  if (cards.length < 3) return;

  let activeIndex = 1;
  let locked = false;
  const transitionMs = 520;

  const clampIndex = (value) => Math.max(1, Math.min(cards.length - 2, value));

  const paint = () => {
    activeIndex = clampIndex(activeIndex);

    cards.forEach((card, index) => {
      let position = 'hidden-right';
      if (index < activeIndex - 1) position = 'hidden-left';
      if (index === activeIndex - 1) position = 'prev';
      if (index === activeIndex) position = 'center';
      if (index === activeIndex + 1) position = 'next';
      if (index > activeIndex + 1) position = 'hidden-right';

      card.dataset.coursePosition = position;
      card.classList.toggle('is-visible-course', position === 'prev' || position === 'center' || position === 'next');
      card.classList.toggle('is-center', position === 'center');
      card.classList.toggle('is-side', position === 'prev' || position === 'next');
      card.setAttribute('aria-hidden', String(!(position === 'prev' || position === 'center' || position === 'next')));
    });

    prev.disabled = activeIndex <= 1;
    next.disabled = activeIndex >= cards.length - 2;
  };

  const goTo = (nextIndex) => {
    if (locked) return;
    const target = clampIndex(nextIndex);
    if (target === activeIndex) return;
    locked = true;
    carousel.classList.add('is-sliding');
    activeIndex = target;
    paint();
    window.setTimeout(() => {
      locked = false;
      carousel.classList.remove('is-sliding');
    }, transitionMs);
  };

  prev.addEventListener('click', () => goTo(activeIndex - 1));
  next.addEventListener('click', () => goTo(activeIndex + 1));

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const position = card.dataset.coursePosition;
      if (position === 'prev' || position === 'next') goTo(index);
    });
  });

  paint();
})();

// Galería: visibilidad + modal
(() => {
  const modal = document.querySelector('.gallery-modal');
  const modalImg = modal?.querySelector('img');
  const closeButton = modal?.querySelector('.gallery-modal-close');
  const galleryButtons = document.querySelectorAll('.gallery-photo-v47');

  galleryButtons.forEach((button) => button.classList.add('is-visible'));
  if (!modal || !modalImg || !galleryButtons.length) return;

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  galleryButtons.forEach((button) => {
    const image = button.querySelector('img');
    if (!image) return;
    button.addEventListener('click', () => {
      modalImg.src = image.currentSrc || image.src;
      modalImg.alt = image.alt || 'Imagen de galería ampliada';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    });
  });

  closeButton?.addEventListener('click', close);
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
})();

// FAQ
(() => {
  document.querySelectorAll('.faq-list button').forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('is-open');
      const icon = button.querySelector('span');
      if (icon) icon.textContent = button.classList.contains('is-open') ? '−' : '+';
    });
  });
})();

// Formularios demo
(() => {
  document.querySelectorAll('form').forEach((form) => {
    const formMessage = form.querySelector('small');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        if (formMessage) formMessage.textContent = 'Completá los campos requeridos para continuar.';
        return;
      }
      if (formMessage) {
        formMessage.textContent = form.dataset.form === 'contact'
          ? 'Mensaje preparado. Te responderemos con una propuesta de expedición.'
          : 'Gracias. Te sumamos a la lista de novedades.';
      }
      form.reset();
    });
  });
})();

// Testimonios expandibles
(() => {
  const toggle = document.querySelector('.reviews-toggle');
  const moreReviews = document.querySelector('.more-reviews');
  if (!toggle || !moreReviews) return;

  toggle.addEventListener('click', () => {
    const isOpen = moreReviews.classList.toggle('is-open');
    moreReviews.setAttribute('aria-hidden', String(!isOpen));
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? 'Ocultar reseñas' : 'Mostrar todas las reseñas';
  });
})();



// Nuestra forma de subir: prepara textos para aparición escalonada
(() => {
  const process = document.querySelector('.process-v47');
  if (!process) return;
  const textCol = process.querySelector(':scope > div:first-child');
  if (textCol) {
    Array.from(textCol.children).forEach((child) => child.classList.add('process-reveal-item'));
  }
})();

// Reveal sutil al scrollear: liviano y sin bloquear la página
(() => {
  const selectors = [
    '.method-card', '.split-section', '.expeditions', '#expediciones',
    '.gallery', '.staff-section-v47', '.testimonials', '.articles',
    '.mountain-system', '.patagonia-viewer', '.school-2027', '.faq', '.contact-section'
  ];
  const items = selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)));
  const uniqueItems = [...new Set(items)].filter((el) => !el.closest('.site-header') && !el.classList.contains('hero'));
  if (!uniqueItems.length) return;

  uniqueItems.forEach((el) => el.classList.add('reveal-on-scroll'));

  if (!('IntersectionObserver' in window)) {
    uniqueItems.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  uniqueItems.forEach((el) => observer.observe(el));
})();

// v72: reveal específico y más visible para Nuestra forma de subir
(() => {
  const process = document.querySelector('.process-v47');
  if (!process) return;

  const textCol = process.querySelector(':scope > div:first-child') || process.firstElementChild;
  if (textCol) {
    Array.from(textCol.children).forEach((child) => child.classList.add('process-reveal-item'));
  }

  process.classList.remove('process-visible');

  if (!('IntersectionObserver' in window)) {
    process.classList.add('process-visible');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      process.classList.add('process-visible');
      observer.disconnect();
    });
  }, { threshold: 0.22, rootMargin: '0px 0px -12% 0px' });

  observer.observe(process);
})();


// v73: galería automática infinita con clones y modal también en las copias
(() => {
  const track = document.querySelector('.gallery-grid-v47');
  const modal = document.querySelector('.gallery-modal');
  const modalImg = modal?.querySelector('img');
  if (!track || track.dataset.carouselReady === 'true') return;

  const originals = Array.from(track.querySelectorAll('.gallery-photo-v47'));
  if (!originals.length) return;

  originals.forEach((button) => button.classList.add('is-visible'));

  originals.forEach((button) => {
    const clone = button.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('gallery-clone-v73', 'is-visible');
    track.appendChild(clone);
  });

  const openModal = (button) => {
    if (!modal || !modalImg) return;
    const image = button.querySelector('img');
    if (!image) return;
    modalImg.src = image.currentSrc || image.src;
    modalImg.alt = image.alt || 'Imagen de galería ampliada';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  track.querySelectorAll('.gallery-photo-v47').forEach((button) => {
    button.addEventListener('click', () => openModal(button));
  });

  track.dataset.carouselReady = 'true';
})();


// v89: aparición escalonada de la línea de tiempo horizontal
(() => {
  const section = document.querySelector('.method-timeline-section');
  if (!section) return;
  const steps = Array.from(section.querySelectorAll('.method-step'));
  steps.forEach((step) => step.classList.remove('is-visible'));
  const reveal = () => steps.forEach((step, index) => {
    window.setTimeout(() => step.classList.add('is-visible'), index * 170);
  });
  if (!('IntersectionObserver' in window)) { reveal(); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal();
      observer.disconnect();
    });
  }, { threshold: 0.22, rootMargin: '0px 0px -12% 0px' });
  observer.observe(section);
})();

// v108: carga diferida de videos secundarios para mejorar el primer render
(() => {
  const videos = Array.from(document.querySelectorAll('video.lazy-video[data-src]'));
  if (!videos.length) return;

  const loadVideo = (video) => {
    if (!video.dataset.src) return;
    video.src = video.dataset.src;
    video.removeAttribute('data-src');
    video.load();
    if (video.autoplay) video.play().catch(() => {});
  };

  if (!('IntersectionObserver' in window)) {
    videos.forEach(loadVideo);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadVideo(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '400px 0px', threshold: 0.01 });

  videos.forEach((video) => observer.observe(video));
})();

// v108: cache local para navegadores compatibles (ideal para GitHub Pages / hosting)
(() => {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
})();

// v112: al recargar, volver siempre al inicio de la página
(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('load', () => {
    window.setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
  });
})();

// v113: contador de Cúspides en números
(() => {
  const section = document.querySelector('.cuspides-stats');
  if (!section) return;
  const numbers = Array.from(section.querySelectorAll('[data-count]'));
  if (!numbers.length) return;

  const animate = () => {
    numbers.forEach((el) => {
      if (el.dataset.done === 'true') return;
      el.dataset.done = 'true';
      const target = Number(el.dataset.count || 0);
      const suffix = el.dataset.suffix || '';
      const duration = 1050;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  if (!('IntersectionObserver' in window)) { animate(); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate();
      observer.disconnect();
    });
  }, { threshold: 0.35 });
  observer.observe(section);
})();

// v119: evita duplicados extra en Postales para que el marquee no se trabe
(() => {
  const track = document.querySelector('.gallery-grid-v47.gallery-auto-v74');
  if (!track) return;
  track.querySelectorAll('.gallery-clone-v73').forEach((clone) => clone.remove());
})();
