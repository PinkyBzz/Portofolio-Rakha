// Smooth reveal on scroll using IntersectionObserver
(function() {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// Auto year in footer
(function() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Smooth scroll for internal links
(function() {
  const links = document.querySelectorAll('a[href^="#"]');
  for (const link of links) {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', id);
        }
      }
    });
  }
})();

// Mobile menu toggle
(function() {
  const btn = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.classList.toggle('active', open);
  });
  // Close on link click (mobile)
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('active');
    }
  }));
})();

// Header shadow on scroll (avoid fixed border line)
(function() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    const scrolled = window.scrollY > 6;
    header.classList.toggle('scrolled', scrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Typewriter effect for the hero lead paragraph
(function() {
  const el = document.querySelector('.typewriter');
  if (!el) return;
  const full = el.textContent.replace(/\s+/g, ' ').trim();
  el.textContent = '';
  let i = 0;
  const speedAttr = Number(el.getAttribute('data-type-speed')) || 22;
  const startDelay = Number(el.getAttribute('data-start-delay')) || 250;

  const type = () => {
    if (i <= full.length) {
      el.textContent = full.slice(0, i);
      i++;
      if (i <= full.length) el.classList.add('caret');
      setTimeout(type, speedAttr);
    } else {
      el.classList.remove('caret');
    }
  };

  // start when hero enters viewport
  const io = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      setTimeout(type, startDelay);
      io.disconnect();
    }
  }, { threshold: 0.2 });
  io.observe(el);
})();

// Simple lightbox for gallery images (init after DOM is ready)
(function() {
  const init = () => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const imgEl = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const open = (src, alt) => {
      imgEl.src = src; imgEl.alt = alt || 'Gambar';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    };
    const close = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      imgEl.src = '';
    };
    document.querySelectorAll('#gallery .gallery-item img').forEach(img => {
      img.addEventListener('click', () => open(img.src, img.alt));
    });
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
