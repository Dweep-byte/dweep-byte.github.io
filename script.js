/**
 * Dweep Shah - Portfolio Scripts
 * - Scroll-Spy for Navigation
 * - Mobile Navigation Menu
 * - Collapsible Project Details
 * - Modal Lightbox with Focus Management
 * - Email Clipboard Copy & Toast
 * - Progressive Scroll-Reveal
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mark JS as loaded for progressive enhancement
  document.documentElement.classList.add('js-loaded');

  initMobileMenu();
  initScrollSpy();
  initCollapsibleProjects();
  initModal();
  initClipboard();
  initScrollReveal();
});

/* ==========================================================================
   Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');
  if (!toggleBtn || !siteNav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when clicking a nav link
  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   Scroll-Spy for Active Nav Links
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  function onScroll() {
    const scrollY = window.scrollY + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   Collapsible Project Cards
   ========================================================================== */
function initCollapsibleProjects() {
  const toggleButtons = document.querySelectorAll('[data-toggle-details]');

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-toggle-details');
      const targetBody = document.getElementById(targetId);
      if (!targetBody) return;

      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const newExpanded = !isExpanded;

      button.setAttribute('aria-expanded', newExpanded ? 'true' : 'false');
      
      if (newExpanded) {
        targetBody.removeAttribute('hidden');
        button.querySelector('span').textContent = 'Hide case study';
      } else {
        targetBody.setAttribute('hidden', '');
        button.querySelector('span').textContent = 'Read case study';
      }
    });
  });
}

/* ==========================================================================
   Modal Lightbox with Focus Management
   ========================================================================== */
let lastFocusedElement = null;

function initModal() {
  const modal = document.getElementById('cert-modal');
  const modalTitle = document.getElementById('modal-cert-title');
  const modalSubtitle = document.getElementById('modal-cert-subtitle');
  const modalImg = document.getElementById('modal-cert-img');
  const modalLink = document.getElementById('modal-cert-link');
  const fallbackMsg = document.getElementById('modal-fallback-msg');
  if (!modal || !modalImg) return;

  // Image onerror fallback
  modalImg.onerror = () => {
    modalImg.style.display = 'none';
    if (fallbackMsg) fallbackMsg.style.display = 'flex';
  };

  // Open Handlers
  document.addEventListener('click', (e) => {
    // 1. Certificate trigger
    const certBtn = e.target.closest('[data-open-cert]');
    if (certBtn) {
      e.preventDefault();
      lastFocusedElement = certBtn;
      const title = certBtn.getAttribute('data-cert-title') || 'Certificate';
      const subtitle = certBtn.getAttribute('data-cert-subtitle') || '';
      const img = certBtn.getAttribute('data-cert-img') || '';
      openModal(title, subtitle, img);
      return;
    }

    // 2. Project preview image trigger
    const imgBtn = e.target.closest('[data-open-img]');
    if (imgBtn) {
      e.preventDefault();
      lastFocusedElement = imgBtn;
      const title = imgBtn.getAttribute('data-img-title') || 'Project Preview';
      const subtitle = imgBtn.getAttribute('data-img-subtitle') || '';
      const img = imgBtn.getAttribute('data-open-img') || '';
      openModal(title, subtitle, img);
      return;
    }

    // 3. Modal close trigger
    const closeBtn = e.target.closest('[data-action="close-modal"]');
    if (closeBtn) {
      e.preventDefault();
      closeModal();
      return;
    }
  });

  function openModal(title, subtitle, imageSrc) {
    modalTitle.textContent = title;
    modalSubtitle.textContent = subtitle;

    if (fallbackMsg) fallbackMsg.style.display = 'none';
    modalImg.style.display = 'block';
    modalImg.src = imageSrc;
    modalImg.alt = title;
    if (modalLink) modalLink.href = imageSrc;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Move focus to modal close button
    const closeBtn = modal.querySelector('.btn-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to trigger button
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  // Escape key listener & Focus Trap
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

/* ==========================================================================
   Email Clipboard Copy
   ========================================================================== */
function initClipboard() {
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('[data-copy-email]');
    if (!copyBtn) return;

    e.preventDefault();
    const email = copyBtn.getAttribute('data-copy-email') || 'shahdweep11@gmail.com';

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied!');
      }).catch(() => {
        fallbackCopy(email);
      });
    } else {
      fallbackCopy(email);
    }
  });

  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Email address copied!');
    } catch {
      window.location.href = 'mailto:' + text;
    }
  }
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

/* ==========================================================================
   Progressive Scroll Reveal
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('is-revealed'));
  }
}
