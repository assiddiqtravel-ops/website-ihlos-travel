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

  /* Lead form → Netlify function → Telegram */
  var form = document.getElementById('leadForm');
  var note = document.getElementById('formNote');
  if (form) {
    var submitBtn = form.querySelector('button[type="submit"]');

    function showNote(msg, isError) {
      if (!note) return;
      note.hidden = false;
      note.textContent = msg;
      note.classList.toggle('error', !!isError);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().trim();

      if (!name || !phone) {
        showNote('Iltimos, ism va telefon raqamini kiriting.', true);
        return;
      }

      var payload = {
        name: name,
        phone: phone,
        message: (data.get('message') || '').toString().trim(),
        company: (data.get('company') || '').toString() // honeypot
      };

      showNote('Yuborilmoqda...', false);
      if (submitBtn) submitBtn.disabled = true;

      fetch('/.netlify/functions/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
        .then(function (res) {
          if (res && res.ok) {
            showNote('Rahmat, ' + (name || 'mijoz') + '! Arizangiz yuborildi, tez orada bog\'lanamiz.', false);
            form.reset();
          } else {
            showNote('Xatolik yuz berdi. Iltimos, qo\'ng\'iroq qiling: +998 97 164 55 77', true);
          }
        })
        .catch(function () {
          showNote('Xatolik yuz berdi. Iltimos, qo\'ng\'iroq qiling: +998 97 164 55 77', true);
        })
        .finally(function () { if (submitBtn) submitBtn.disabled = false; });
    });
  }

  /* Footer year */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
