/* ============================================================
   Pizza Leve Búzios — JavaScript Principal
   ============================================================ */

(function () {
  'use strict';

  /* ── Header com efeito de scroll ── */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Menu mobile ── */
  const menuToggle  = document.querySelector('.menu-toggle');
  const mobileMenu  = document.querySelector('.mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Link ativo na navegação ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll suave para âncoras ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = (header ? header.offsetHeight : 80) + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Animações de entrada (IntersectionObserver) ── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => obs.observe(el));
  } else {
    // Fallback: mostrar tudo sem animação
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Filtro de Cardápio ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems  = document.querySelectorAll('.menu-item');

  if (filterBtns.length && menuItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        menuItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.style.display = match ? '' : 'none';
          if (match) {
            // Re-animar ao filtrar
            item.classList.remove('visible');
            requestAnimationFrame(() => {
              requestAnimationFrame(() => item.classList.add('visible'));
            });
          }
        });
      });
    });
  }

  /* ── Counter animado nas estatísticas do hero ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.dataset.count);
        const isDecimal = target % 1 !== 0;
        const duration  = 1500;
        const start     = performance.now();

        const tick = now => {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const current  = target * ease;
          el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('pt-BR');
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObs.observe(el));
  }

  /* ── Indicador de scroll no hero ── */
  const scrollInd = document.querySelector('.scroll-indicator');
  if (scrollInd) {
    window.addEventListener('scroll', () => {
      scrollInd.style.opacity = window.scrollY > 80 ? '0' : '1';
    }, { passive: true });
  }

  /* ── Lazy load de imagens com placeholder ── */
  document.querySelectorAll('img[data-src]').forEach(img => {
    const loadImg = () => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    };
    if ('IntersectionObserver' in window) {
      const imgObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { loadImg(); imgObs.disconnect(); }
      });
      imgObs.observe(img);
    } else {
      loadImg();
    }
  });

  /* ── Formulário de contato → redireciona para WhatsApp ── */
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name    = (contactForm.querySelector('#nome')?.value || '').trim();
      const message = (contactForm.querySelector('#mensagem')?.value || '').trim();
      const phone   = '5522996068776';
      const text    = encodeURIComponent(
        `Olá! Meu nome é ${name}. ${message}`
      );
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });
  }

})();
