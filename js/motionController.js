/**
 * CHOP CHOP GRILL HOUSE & COFFEE SHOP — Central Motion & Depth Controller
 * Harare, Zimbabwe
 *
 * Layer 1: Atmosphere (Scroll-driven ambient background lighting)
 * Layer 2: Structure (Header spatial compression, travelling category indicator, section choreography)
 * Layer 3: Food & Content (Card internal stagger, image parallax depth, touch pressure)
 * Layer 4: Interaction (Shared-element product expansion, traveling cart particle, price transitions)
 *
 * Architecture Principles:
 * - 100% native scrolling. Never intercept or hijack scrolling.
 * - Single requestAnimationFrame scroll ticker writing CSS custom properties.
 * - Viewport-bounded parallax (only updates elements currently in view).
 * - Section choreography with persistent state (no awkward re-triggering on scroll up).
 * - Full prefers-reduced-motion compliance.
 */

export class MotionController {
  constructor(menuController) {
    this.menuController = menuController;

    // Environment & capabilities
    this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Scroll state
    this.scrollY = window.scrollY || 0;
    this.lastScrollY = this.scrollY;
    this.scrollDirection = 'down'; // 'down' | 'up'
    this.scrollVelocity = 0;
    this.lastScrollTime = performance.now();
    this.ticking = false;

    // Visible elements tracking for parallax
    this.visibleCardImages = new Set();
    this.revealedSections = new Set();

    // Observers
    this.sectionObserver = null;
    this.cardParallaxObserver = null;
    this.footerObserver = null;

    // Transition proxy state
    this.activeProxy = null;
  }

  init() {
    this.initReducedMotionListener();

    if (this.prefersReduced) {
      document.body.classList.add('reduced-motion-active');
      this.revealAllImmediately();
      return;
    }

    document.body.classList.add('chopchop-motion-active');

    this.initScrollEngine();
    this.initSectionChoreography();
    this.initCardParallax();
    this.initDesktopPointerDepth();
  }

  // --------------------------------------------------------------------------
  // Reduced Motion Support
  // --------------------------------------------------------------------------
  initReducedMotionListener() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this.prefersReduced = e.matches;
      if (this.prefersReduced) {
        document.body.classList.remove('chopchop-motion-active');
        document.body.classList.add('reduced-motion-active');
        this.revealAllImmediately();
      } else {
        document.body.classList.remove('reduced-motion-active');
        document.body.classList.add('chopchop-motion-active');
        this.init();
      }
    });
  }

  revealAllImmediately() {
    document.querySelectorAll('.category-group-section, .category-group-header, .menu-card.compact-card, #app-footer, .footer-stagger-item')
      .forEach(el => el.classList.add('is-revealed'));
  }

  // --------------------------------------------------------------------------
  // Layer 1 & 2: Centralized rAF Scroll Engine
  // Writes CSS custom properties for ambient light and header compression
  // --------------------------------------------------------------------------
  initScrollEngine() {
    const root = document.documentElement;

    const onScroll = () => {
      this.scrollY = window.scrollY || 0;

      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.updateScrollMetrics(root);
          this.updateCardParallax();
          this.ticking = false;
        });
        this.ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial calculation
    this.updateScrollMetrics(root);
  }

  updateScrollMetrics(root) {
    const now = performance.now();
    const dt = Math.max(now - this.lastScrollTime, 16);
    const dy = this.scrollY - this.lastScrollY;

    this.scrollVelocity = Math.abs(dy / dt);
    this.scrollDirection = dy >= 0 ? 'down' : 'up';
    this.lastScrollY = this.scrollY;
    this.lastScrollTime = now;

    // Header compression threshold (24px)
    const isScrolled = this.scrollY > 24;
    document.body.classList.toggle('is-scrolled', isScrolled);

    // Write CSS variables
    root.style.setProperty('--scroll-y', `${Math.round(this.scrollY)}px`);
    root.style.setProperty('--scroll-dir', this.scrollDirection === 'down' ? '1' : '-1');

    // Document scroll progress (0 to 1)
    const docHeight = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(this.scrollY / docHeight, 0), 1);
    root.style.setProperty('--scroll-progress', progress.toFixed(4));

    // Ambient radial light coordinates (slow, imperceptible shift)
    const ambientY = Math.round(progress * 180);
    root.style.setProperty('--ambient-light-y', `${ambientY}px`);
  }

  // --------------------------------------------------------------------------
  // Layer 2: Section Entry Choreography (Not Generic Fade-In)
  // Phase 1: Section Heading
  // Phase 2: Hairline Divider Line Draws Across
  // Phase 3: Supporting Subtitle & Count Badge
  // Phase 4 & 5: Food Cards Stagger In
  // --------------------------------------------------------------------------
  initSectionChoreography() {
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
    }

    this.sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const target = entry.target;

        // When section approaches viewport while scrolling down
        if (entry.isIntersecting) {
          const sectionId = target.id;
          if (this.revealedSections.has(sectionId)) return;
          this.revealedSections.add(sectionId);

          target.classList.add('is-revealed');

          // Phase 1: Heading
          const headingWrap = target.querySelector('.category-group-header');
          if (headingWrap) {
            headingWrap.classList.add('is-revealed');
          }

          // Phase 4 & 5: Stagger cards
          const cards = target.querySelectorAll('.menu-card.compact-card');
          cards.forEach((card, idx) => {
            const delay = 60 + Math.min(idx * 35, 300);
            setTimeout(() => {
              card.classList.add('is-revealed');
            }, delay);
          });

          // Unobserve once revealed to maintain 60fps
          observer.unobserve(target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.05
    });

    document.querySelectorAll('.category-group-section').forEach(sec => {
      this.sectionObserver.observe(sec);
    });

    // Choreographed Footer Entrance
    this.initFooterChoreography();
  }

  initFooterChoreography() {
    const footer = document.getElementById('app-footer');
    if (!footer) return;

    if (this.footerObserver) {
      this.footerObserver.disconnect();
    }

    this.footerObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.08
    });

    this.footerObserver.observe(footer);
  }

  // --------------------------------------------------------------------------
  // Layer 3: Food Image Parallax Depth Inside Cards
  // Subtle offset counter-movement so photograph feels placed inside the card
  // --------------------------------------------------------------------------
  initCardParallax() {
    if (this.prefersReduced) return;

    if (this.cardParallaxObserver) {
      this.cardParallaxObserver.disconnect();
    }

    this.visibleCardImages.clear();

    this.cardParallaxObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const img = entry.target.querySelector('.card-thumb-img');
        if (!img) return;

        if (entry.isIntersecting) {
          this.visibleCardImages.add(entry.target);
        } else {
          this.visibleCardImages.delete(entry.target);
          img.style.transform = '';
        }
      });
    }, {
      root: null,
      rootMargin: '100px 0px 100px 0px',
      threshold: 0
    });

    document.querySelectorAll('.menu-card.compact-card').forEach(card => {
      this.cardParallaxObserver.observe(card);
    });
  }

  updateCardParallax() {
    if (this.prefersReduced || this.scrollVelocity > 2.8) return;

    const vh = window.innerHeight;
    const halfVh = vh / 2;

    this.visibleCardImages.forEach(card => {
      const img = card.querySelector('.card-thumb-img');
      if (!img) return;

      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distanceFromCenter = (cardCenter - halfVh) / halfVh; // -1 to 1

      // Very subtle counter parallax: -4px to +4px
      const offsetY = Math.round(-distanceFromCenter * 4.5);
      img.style.setProperty('--img-parallax-y', `${offsetY}px`);
    });
  }

  // --------------------------------------------------------------------------
  // Layer 3: Desktop Subtle Pointer Depth (2-3px Max, Disabled on Touch)
  // --------------------------------------------------------------------------
  initDesktopPointerDepth() {
    if (this.isTouchDevice || this.prefersReduced) return;

    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.menu-card.compact-card');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width - 0.5) * 2; // -1 to 1
      const normY = (y / rect.height - 0.5) * 2;

      const tiltX = (normX * 2).toFixed(2);
      const tiltY = (normY * 2).toFixed(2);

      card.style.setProperty('--card-tilt-x', `${tiltX}px`);
      card.style.setProperty('--card-tilt-y', `${tiltY}px`);
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest('.menu-card.compact-card');
      if (card) {
        card.style.removeProperty('--card-tilt-x');
        card.style.removeProperty('--card-tilt-y');
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // Layer 4: Shared-Element Product Transition (Major Cinematic Feature)
  // Card thumbnail expands seamlessly into the modal hero photo in 320ms!
  // --------------------------------------------------------------------------
  executeSharedElementTransition(triggerCard, targetModalHeroImg, onComplete) {
    if (this.prefersReduced || !triggerCard || !targetModalHeroImg) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    const sourceImg = triggerCard.querySelector('.card-thumb-img');
    if (!sourceImg) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    const sourceRect = sourceImg.getBoundingClientRect();
    if (sourceRect.width === 0 || sourceRect.height === 0) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    // Modal destination geometry calculation
    const isDesktop = window.innerWidth >= 640;
    const modalMaxW = isDesktop ? 500 : Math.min(window.innerWidth, 500);
    const modalLeft = (window.innerWidth - modalMaxW) / 2;
    const heroH = window.innerWidth >= 480 ? 240 : 220;

    // Approximate final position of modal hero photo
    let destTop;
    if (isDesktop) {
      // Centered dialog
      const approxModalH = Math.min(window.innerHeight * 0.88, 620);
      destTop = (window.innerHeight - approxModalH) / 2;
    } else {
      // Bottom sheet
      destTop = window.innerHeight - Math.min(window.innerHeight * 0.92, 620);
    }

    // Create flying proxy element
    const proxy = document.createElement('div');
    proxy.className = 'shared-element-proxy';
    proxy.setAttribute('aria-hidden', 'true');

    proxy.style.position = 'fixed';
    proxy.style.top = `${sourceRect.top}px`;
    proxy.style.left = `${sourceRect.left}px`;
    proxy.style.width = `${sourceRect.width}px`;
    proxy.style.height = `${sourceRect.height}px`;
    proxy.style.backgroundImage = `url(${sourceImg.src})`;
    proxy.style.backgroundSize = 'cover';
    proxy.style.backgroundPosition = 'center';
    proxy.style.borderRadius = '10px';
    proxy.style.zIndex = '1100';
    proxy.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.6)';
    proxy.style.pointerEvents = 'none';
    proxy.style.willChange = 'transform, opacity, border-radius';
    proxy.style.transition = 'top 320ms cubic-bezier(0.16, 1, 0.3, 1), left 320ms cubic-bezier(0.16, 1, 0.3, 1), width 320ms cubic-bezier(0.16, 1, 0.3, 1), height 320ms cubic-bezier(0.16, 1, 0.3, 1), border-radius 320ms ease, opacity 320ms ease';

    document.body.appendChild(proxy);
    this.activeProxy = proxy;

    // Trigger expansion in next frame
    requestAnimationFrame(() => {
      proxy.style.top = `${destTop}px`;
      proxy.style.left = `${modalLeft}px`;
      proxy.style.width = `${modalMaxW}px`;
      proxy.style.height = `${heroH}px`;
      proxy.style.borderRadius = isDesktop ? '14px 14px 0 0' : '20px 20px 0 0';
    });

    setTimeout(() => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
      proxy.style.opacity = '0';
      setTimeout(() => {
        proxy.remove();
        if (this.activeProxy === proxy) this.activeProxy = null;
      }, 140);
    }, 280);
  }

  // --------------------------------------------------------------------------
  // Layer 4: Signature Add-to-Order Traveling Particle Beam
  // A glowing amber light particle arcs from the CTA button to the sticky cart pill
  // --------------------------------------------------------------------------
  spawnAddToCartBeam(sourceButton, targetCartPill) {
    if (this.prefersReduced || !sourceButton) return;

    const targetEl = targetCartPill || document.getElementById('btn-sticky-cart') || document.getElementById('sticky-cart-container');
    if (!targetEl) return;

    const sourceRect = sourceButton.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;

    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    // Create particle
    const spark = document.createElement('div');
    spark.className = 'add-to-cart-spark';
    spark.setAttribute('aria-hidden', 'true');

    spark.style.position = 'fixed';
    spark.style.left = `${startX}px`;
    spark.style.top = `${startY}px`;
    spark.style.zIndex = '1200';
    spark.style.pointerEvents = 'none';

    document.body.appendChild(spark);

    // Animate along trajectory with gentle arc
    const duration = 380;
    const startTime = performance.now();

    const animateSpark = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease curve
      const ease = 1 - Math.pow(1 - progress, 3);

      const curX = startX + (endX - startX) * ease;
      // Arc slightly upward (-20px peak)
      const arcOffset = Math.sin(progress * Math.PI) * -24;
      const curY = startY + (endY - startY) * ease + arcOffset;

      const scale = 1 - progress * 0.4;
      const opacity = 1 - Math.pow(progress, 4);

      spark.style.transform = `translate3d(${curX - startX}px, ${curY - startY}px, 0) scale(${scale})`;
      spark.style.opacity = `${opacity}`;

      if (progress < 1) {
        requestAnimationFrame(animateSpark);
      } else {
        spark.remove();
      }
    };

    requestAnimationFrame(animateSpark);
  }
}
