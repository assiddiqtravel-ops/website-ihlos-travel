(function () {
  'use strict';

  var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav    = document.getElementById('nav');

  /* Header shadow on scroll */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  burger.addEventListener('click', function () {
    burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      burger.classList.remove('is-open');
      nav.classList.remove('is-open');
    }
  });

  /* Reveal on scroll */
  var targets = document.querySelectorAll(
    '.trust__item, .step, .card, .service, .gallery__item, .about__text, .about__media, .faq__item'
  );

  targets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('is-in'); }, (i % 4) * 80);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Hide gallery items whose photo is not added yet */
  document.querySelectorAll('.gallery__item img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.closest('.gallery__item').style.display = 'none';
    });
  });

  /* Footer year */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
