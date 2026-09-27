/* ============================================
   InAmigos Foundation — Awareness Campaign
   JavaScript Interactions
   ============================================ */

(function () {
  'use strict';

  // -----------------------------------------------
  // Utility: Check if user prefers reduced motion
  // -----------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -----------------------------------------------
  // NAVBAR — Scroll Behavior & Compact Transform
  // -----------------------------------------------
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Compact navbar on scroll
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Initial check

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('mobile-active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Close mobile menu on link click
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navMenu.classList.contains('mobile-active')) {
        navMenu.classList.remove('mobile-active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  // -----------------------------------------------
  // ACTIVE NAV LINK — Highlight on Scroll
  // -----------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // -----------------------------------------------
  // SCROLL REVEAL — Intersection Observer
  // -----------------------------------------------
  if (!prefersReducedMotion) {
    var revealElements = document.querySelectorAll('.reveal');

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // If reduced motion, make everything visible immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // -----------------------------------------------
  // ANIMATED COUNTERS — Impact Numbers
  // -----------------------------------------------
  var impactNumbers = document.querySelectorAll('.impact-number[data-target]');
  var countersAnimated = false;

  function formatNumber(num) {
    if (num >= 1000) {
      return num.toLocaleString('en-IN');
    }
    return num.toString();
  }

  function animateCounter(element) {
    var target = parseInt(element.getAttribute('data-target'), 10);
    var duration = 2200;
    var startTime = null;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = easeOutExpo(progress);
      var currentValue = Math.floor(easedProgress * target);

      element.textContent = formatNumber(currentValue) + '+';

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = formatNumber(target) + '+';
      }
    }

    if (prefersReducedMotion) {
      element.textContent = formatNumber(target) + '+';
    } else {
      requestAnimationFrame(step);
    }
  }

  if (impactNumbers.length > 0) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          impactNumbers.forEach(function (el, index) {
            // Stagger the start of each counter
            setTimeout(function () {
              animateCounter(el);
            }, index * 150);
          });
          counterObserver.disconnect();
        }
      });
    }, {
      threshold: 0.3
    });

    // Observe the first impact number
    counterObserver.observe(impactNumbers[0]);
  }

  // -----------------------------------------------
  // BACK TO TOP — Button
  // -----------------------------------------------
  var backToTop = document.getElementById('backToTop');

  function handleBackToTopVisibility() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  // -----------------------------------------------
  // SMOOTH SCROLL — For Internal Anchor Links
  // -----------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        var offsetTop = targetElement.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // -----------------------------------------------
  // HERO IMAGE — Subtle Parallax on Desktop
  // -----------------------------------------------
  if (!prefersReducedMotion && window.innerWidth > 768) {
    var heroImg = document.querySelector('.hero-bg img');
    if (heroImg) {
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            var scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
              heroImg.style.transform = 'scale(1.08) translateY(' + (scrolled * 0.12) + 'px)';
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }

  // -----------------------------------------------
  // KEYBOARD NAVIGATION — Escape to Close Menu
  // -----------------------------------------------
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('mobile-active')) {
      navMenu.classList.remove('mobile-active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navToggle.focus();
    }
  });

  // -----------------------------------------------
  // LOAD EVENT — Final setup
  // -----------------------------------------------
  window.addEventListener('load', function () {
    // Trigger initial scroll-based checks
    handleNavScroll();
    handleBackToTopVisibility();
    updateActiveNav();

    // Add loaded class for entry animations
    document.body.classList.add('loaded');
  });

})();
