(function () {
  'use strict';

  const whatsappNumber = '923499019790';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');
  const progressBar = document.getElementById('scroll-progress-bar');
  const backToTop = document.getElementById('back-to-top');
  const pointerGlow = document.querySelector('.pointer-glow');
  const currentYear = document.getElementById('current-year');

  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  // Mobile navigation: open, close, and close when a section is selected.
  function closeMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !isOpen);
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Reading progress, sticky navigation treatment, and back-to-top visibility.
  let ticking = false;
  function updateScrollUI() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = Math.min(100, Math.max(0, percent)) + '%';
    if (backToTop) backToTop.classList.toggle('is-visible', window.scrollY > 550);
    if (header) header.classList.toggle('has-scrolled', window.scrollY > 20);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // Reveal elements only when they enter the viewport; support reduced motion.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  // Highlight the navigation item corresponding to the section in view.
  const sectionLinks = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
  const trackedSections = sectionLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(function (link) {
          const matches = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-current', matches);
        });
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });
    trackedSections.forEach(function (section) { sectionObserver.observe(section); });
  }

  // Keep the cursor aura subtle and avoid expensive work on touch devices.
  if (pointerGlow && window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    let glowFrame = 0;
    window.addEventListener('pointermove', function (event) {
      if (glowFrame) return;
      glowFrame = window.requestAnimationFrame(function () {
        pointerGlow.style.left = event.clientX + 'px';
        pointerGlow.style.top = event.clientY + 'px';
        glowFrame = 0;
      });
    }, { passive: true });
  } else if (pointerGlow) {
    pointerGlow.remove();
  }

  // Light pointer tilt for cards on devices that actually have a precise pointer.
  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    document.querySelectorAll('.service-card').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-5px) perspective(800px) rotateX(' + (-y * 2.5).toFixed(2) + 'deg) rotateY(' + (x * 2.5).toFixed(2) + 'deg)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  // Project category filters.
  const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const filter = button.dataset.filter || 'all';
      filterButtons.forEach(function (candidate) {
        const active = candidate === button;
        candidate.classList.toggle('is-active', active);
        candidate.setAttribute('aria-pressed', String(active));
      });
      projectCards.forEach(function (card) {
        const categories = (card.dataset.category || '').split(/\s+/);
        const show = filter === 'all' || categories.includes(filter);
        card.classList.toggle('is-hidden', !show);
        if (show) card.setAttribute('aria-hidden', 'false');
        else card.setAttribute('aria-hidden', 'true');
      });
    });
  });

  // Accessible project detail modal, populated from a small local data object.
  const projects = {
    gigup: {
      number: 'PROJECT / 001', title: 'GigUp', type: 'WEB PLATFORM · PRODUCT EXPERIENCE',
      description: 'A product-oriented platform concept focused on making opportunity discovery and follow-up workflows feel more organized. The key design goal is to reduce friction, keep information scannable, and give users a clearer next step.',
      tags: ['Web platform', 'Product thinking', 'Growth tools'],
      ctaText: 'Visit GigUp ↗', url: 'https://giguphq.com'
    },
    openride: {
      number: 'PROJECT / 002', title: 'OpenRide', type: 'MOBILE APP · RIDE BOOKING',
      description: 'A city and intercity ride-booking experience exploring the full passenger and driver journey: trip planning, location selection, driver matching, and clear ride states. The focus is on practical flows that stay understandable on a phone.',
      tags: ['React Native', 'Maps', 'Ride workflows'], ctaText: 'Discuss a similar app ↗', url: '#contact'
    },
    sortlab: {
      number: 'PROJECT / 003', title: 'Water Sort', type: 'MOBILE GAME · PUZZLE SYSTEMS',
      description: 'A colour-sorting puzzle experience built around simple rules, readable states, satisfying interactions, and levels designed to remain solvable. The work combines interface polish with the logic that makes each move feel dependable.',
      tags: ['Mobile game', 'Game UI', 'Level systems'], ctaText: 'Discuss a similar app ↗', url: '#contact'
    },
    chess: {
      number: 'PROJECT / 004', title: 'Chess Arena', type: 'MOBILE APP · GAME LOGIC',
      description: 'A mobile-first chess experience centered on clear move feedback, legal-move handling, board states, and a focused play screen. The design direction keeps the interface game-like without sacrificing readability or usability.',
      tags: ['React Native', 'Game logic', 'Interactive UI'], ctaText: 'Discuss a similar app ↗', url: '#contact'
    }
  };

  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalKicker = document.getElementById('modal-kicker');
  const modalType = document.getElementById('modal-type');
  const modalDescription = document.getElementById('modal-description');
  const modalTags = document.getElementById('modal-tags');
  const modalCta = document.getElementById('modal-cta');
  let previousFocus = null;

  function closeModal() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  function openModal(key, trigger) {
    const project = projects[key];
    if (!project || !modal) return;
    previousFocus = trigger;
    modalKicker.textContent = project.number;
    modalTitle.textContent = project.title;
    modalType.textContent = project.type;
    modalDescription.textContent = project.description;
    modalTags.replaceChildren();
    project.tags.forEach(function (tag) {
      const item = document.createElement('span');
      item.textContent = tag;
      modalTags.appendChild(item);
    });
    modalCta.textContent = project.ctaText;
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = ' ↗';
    modalCta.appendChild(arrow);
    modalCta.href = project.url;
    if (project.url.startsWith('http')) {
      modalCta.target = '_blank';
      modalCta.rel = 'noopener noreferrer';
    } else {
      modalCta.removeAttribute('target');
      modalCta.removeAttribute('rel');
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) closeButton.focus();
  }

  projectCards.forEach(function (card) {
    const trigger = card.querySelector('.project-image');
    if (trigger) trigger.addEventListener('click', function () { openModal(card.dataset.project, trigger); });
  });
  if (modal) {
    modal.querySelectorAll('[data-close-modal]').forEach(function (element) { element.addEventListener('click', closeModal); });
    if (modalCta) {
      modalCta.addEventListener('click', function () {
        if ((modalCta.getAttribute('href') || '').startsWith('#')) closeModal();
      });
    }
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeModal();
      if (event.key === 'Tab' && modal.classList.contains('is-open')) {
        const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  // Contact form generates a personalised WhatsApp message; nothing is submitted to a server.
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const project = String(formData.get('project') || '').trim();
      const message = String(formData.get('message') || '').trim();
      if (!name || !project || !message) {
        if (formStatus) formStatus.textContent = 'Please complete all required fields first.';
        return;
      }
      const whatsappMessage = [
        'Hi Hussain, I would like to discuss a project.',
        '',
        'Name: ' + name,
        'Project type: ' + project,
        'Project details: ' + message,
        '',
        'Sent from the NEXORA Studio portfolio.'
      ].join('\n');
      const url = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(whatsappMessage);
      if (formStatus) formStatus.textContent = 'Your message is ready in WhatsApp. Send it there to start the conversation.';
      const openedWindow = window.open(url, '_blank');
      if (openedWindow) {
        openedWindow.opener = null;
      } else {
        window.location.href = url;
      }
    });
  }

  // Copy the WhatsApp number where clipboard permissions are available.
  const copyPhone = document.getElementById('copy-phone');
  const copyLabel = document.getElementById('copy-label');
  if (copyPhone) {
    copyPhone.addEventListener('click', async function () {
      const phone = copyPhone.dataset.phone || '+92349 9019790';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(phone);
        } else {
          const temporary = document.createElement('textarea');
          temporary.value = phone;
          temporary.setAttribute('readonly', '');
          temporary.style.position = 'absolute';
          temporary.style.left = '-9999px';
          document.body.appendChild(temporary);
          temporary.select();
          const copied = document.execCommand('copy');
          temporary.remove();
          if (!copied) throw new Error('Copy command unavailable');
        }
        if (copyLabel) copyLabel.textContent = 'Copied ✓';
      } catch (error) {
        if (copyLabel) copyLabel.textContent = phone;
      }
      window.setTimeout(function () {
        if (copyLabel) copyLabel.textContent = 'Copy number ↗';
      }, 2200);
    });
  }

  // Prevent stale open states on browser history navigation.
  window.addEventListener('pageshow', function () {
    closeMenu();
    updateScrollUI();
  });
})();
