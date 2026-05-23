document.addEventListener('DOMContentLoaded', () => {
    // ── NAV SCROLL BEHAVIOUR ──
    const nav = document.getElementById('nav');
    const bc = document.getElementById('breadcrumb');
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 60;
      if (nav) nav.classList.toggle('scrolled', scrolled);
      if (bc) {
        bc.style.background = scrolled ? 'rgba(28,43,30,0.88)' : 'rgba(28,43,30,0.0)';
        bc.style.borderColor = scrolled ? 'rgba(184,168,152,0.1)' : 'transparent';
        bc.style.backdropFilter = scrolled ? 'blur(12px)' : 'none';
        bc.style.opacity = scrolled ? '1' : '0';
      }
    }, { passive: true });
    if (bc) { bc.style.opacity = '0'; }

    // ── GSAP: hero entrance (scale) + parallax scroll ──
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const heroImg = document.getElementById('hero-img');
        if (heroImg) {
            gsap.fromTo(heroImg,
              { scale: 1.08 },
              { scale: 1, duration: 1.8, ease: 'power2.out' }
            );

            gsap.to(heroImg, {
              y: '18%',
              ease: 'none',
              scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              }
            });
        }
    }

    // Ficha items fade-in on scroll
    const ficha = document.getElementById('ficha');
    if (ficha) {
        const fichaItems = document.querySelectorAll('.ficha-item');
        fichaItems.forEach((el, i) => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(14px)';
          el.style.transition = `opacity 0.5s ${i * 0.1}s ease-out, transform 0.5s ${i * 0.1}s ease-out`;
        });
        const fichaObs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              fichaItems.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
              });
              fichaObs.disconnect();
            }
          });
        }, { threshold: 0.3 });
        fichaObs.observe(ficha);
    }

    // Description columns fade-in
    const descricao = document.getElementById('descricao');
    if (descricao) {
        const descEls = [
          { el: document.querySelector('.desc-left'), delay: 0 },
          { el: document.querySelector('.desc-right'), delay: 0.15 },
        ];
        descEls.forEach(({ el, delay }) => {
          if (!el) return;
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = `opacity 0.7s ${delay}s ease-out, transform 0.7s ${delay}s ease-out`;
        });
        const descObs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              descEls.forEach(({ el }) => {
                if (!el) return;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
              });
              descObs.disconnect();
            }
          });
        }, { threshold: 0.2 });
        descObs.observe(descricao);
    }

    // ── Gallery scroll reveal ──
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(el => el.classList.add('hidden-init'));
        const galleryObs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const items = document.querySelectorAll('.gallery-item.hidden-init');
              items.forEach((el, i) => {
                setTimeout(() => {
                  el.style.opacity = '1';
                  el.style.transform = 'translateY(0)';
                  el.classList.remove('hidden-init');
                }, i * 80);
              });
              galleryObs.disconnect();
            }
          });
        }, { threshold: 0.1 });
        galleryObs.observe(galleryGrid);
    }

    // Gallery header reveal
    const ghdr = document.querySelector('.gallery-header');
    if (ghdr) {
      ghdr.style.opacity = '0'; ghdr.style.transform = 'translateY(14px)';
      ghdr.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { ghdr.style.opacity = '1'; ghdr.style.transform = 'translateY(0)'; }
      }, { threshold: 0.3 }).observe(ghdr);
    }

    // ── Lightbox ──
    const lb = document.getElementById('lightbox');
    if (lb) {
        const lbImg = document.getElementById('lb-img');
        const lbCap = document.getElementById('lb-caption');
        const lbCtr = document.getElementById('lb-counter');
        const lbPrev = document.getElementById('lb-prev');
        const lbNext = document.getElementById('lb-next');

        const realItems = [...document.querySelectorAll('.gallery-item:not([data-placeholder])')];
        let current = 0;

        function openLightbox(index) {
          current = index;
          const item = realItems[current];
          lbImg.classList.remove('loaded');
          lbImg.src = item.dataset.src;
          lbImg.alt = item.dataset.caption || '';
          lbCap.textContent = item.dataset.caption || '';
          lbCtr.textContent = `${current + 1} / ${realItems.length}`;
          lbImg.onload = () => lbImg.classList.add('loaded');
          lb.classList.add('active');
          lb.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
          lbPrev.style.display = realItems.length > 1 ? 'flex' : 'none';
          lbNext.style.display = realItems.length > 1 ? 'flex' : 'none';
        }

        function closeLightbox() {
          lb.classList.remove('active');
          lb.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          setTimeout(() => { lbImg.src = ''; lbImg.classList.remove('loaded'); }, 300);
        }

        function navigate(dir) {
          current = (current + dir + realItems.length) % realItems.length;
          lbImg.classList.remove('loaded');
          const item = realItems[current];
          lbImg.src = item.dataset.src;
          lbCap.textContent = item.dataset.caption || '';
          lbCtr.textContent = `${current + 1} / ${realItems.length}`;
          lbImg.onload = () => lbImg.classList.add('loaded');
        }

        if (realItems.length > 0) {
          realItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
        }
        
        const lbClose = document.getElementById('lb-close');
        if (lbClose) lbClose.addEventListener('click', closeLightbox);
        
        const lbBackdrop = document.getElementById('lb-backdrop');
        if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
        
        if (lbPrev) lbPrev.addEventListener('click', () => navigate(-1));
        if (lbNext) lbNext.addEventListener('click', () => navigate(1));
        
        document.addEventListener('keydown', e => {
          if (!lb.classList.contains('active')) return;
          if (e.key === 'Escape') closeLightbox();
          if (e.key === 'ArrowLeft') navigate(-1);
          if (e.key === 'ArrowRight') navigate(1);
        });
    }

    // CTA fade-in
    const ctaBlock = document.querySelector('.cta-block');
    if (ctaBlock) {
      ctaBlock.style.opacity = '0';
      ctaBlock.style.transform = 'translateY(24px)';
      ctaBlock.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          ctaBlock.style.opacity = '1';
          ctaBlock.style.transform = 'translateY(0)';
        }
      }, { threshold: 0.25 }).observe(ctaBlock);
    }

    // Proj nav fade-in
    const projNav = document.getElementById('proj-nav');
    if (projNav) {
      projNav.style.opacity = '0';
      projNav.style.transform = 'translateY(16px)';
      projNav.style.transition = 'opacity 0.6s 0.1s ease-out, transform 0.6s 0.1s ease-out';
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          projNav.style.opacity = '1';
          projNav.style.transform = 'translateY(0)';
        }
      }, { threshold: 0.2 }).observe(projNav);
    }
});
