
      (() => {
        const sectionIds = ['survival', 'learn', 'challenge', 'community', 'my-siaga'];
        const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
        const navLinks = [...document.querySelectorAll('header nav a[href^="#"]')];
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        sections.forEach((section) => section.classList.add('section-reveal'));
        if (reduceMotion || !('IntersectionObserver' in window)) {
          sections.forEach((section) => section.classList.add('is-visible'));
        } else {
          const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            });
          }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
          sections.forEach((section) => revealObserver.observe(section));
        }

        const activeObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
              const active = link.getAttribute('href') === `#${entry.target.id}`;
              link.classList.toggle('text-primary', active);
              link.classList.toggle('font-semibold', active);
              link.setAttribute('aria-current', active ? 'location' : 'false');
            });
          });
        }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
        sections.forEach((section) => activeObserver.observe(section));
      })();
    
