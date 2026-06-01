const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const header = document.querySelector('.site-header');
    const scrollTopButton = document.querySelector('.scroll-top');
    const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
    const observedSections = Array.from(document.querySelectorAll('section[id]'));

    const updateChrome = () => {
      const scrolled = window.scrollY > 12;
      header.classList.toggle('is-scrolled', scrolled);
      scrollTopButton.classList.toggle('is-visible', window.scrollY > 520);
    };

    const animateCount = (element) => {
      if (element.dataset.counted === 'true') return;
      element.dataset.counted = 'true';
      const target = Number(element.dataset.count);
      const suffix = element.dataset.suffix || '';

      if (prefersReducedMotion) {
        element.textContent = `${target}${suffix}`;
        return;
      }

      const duration = 1100;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
      });
    }, { threshold: 0.18 });

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    observedSections.forEach((section) => navObserver.observe(section));

    scrollTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    updateChrome();
    window.addEventListener('scroll', updateChrome, { passive: true });
