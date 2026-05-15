/* main.js — Cabinet ExpertImmo
   JavaScript vanilla minimal
   FAQ accordéon, menu mobile, formulaire, scroll reveal */
'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* === MOBILE MENU === */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  var closeBtn = document.querySelector('.mobile-menu-close');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* === FAQ ACCORDION === */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var isOpen = item.classList.contains('is-open');
      /* Close all */
      document.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('is-open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* === SCROLL REVEAL (fade-in) === */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* === CONTACT FORM BASIC VALIDATION === */
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          field.classList.add('field-error');
          valid = false;
        } else {
          field.classList.remove('field-error');
        }
      });
      if (valid) {
        /* TODO: connect to backend or email service */
        alert('Votre saisine a bien été transmise. Le Cabinet vous répondra dans les meilleurs délais.');
        form.reset();
      }
    });
  }

  /* === DOMAINS SLIDER === */
  var track = document.querySelector('.domains-track');
  var dotsContainer = document.querySelector('.domains-dots');
  var prevBtn = document.querySelector('.slider-arrow--prev');
  var nextBtn = document.querySelector('.slider-arrow--next');
  if (track && dotsContainer) {
    var cards = track.querySelectorAll('.domain-card');
    var cardCount = cards.length;
    /* Create dots */
    for (var i = 0; i < cardCount; i++) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Domaine ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.dataset.index = i;
      dot.addEventListener('click', function () {
        var idx = parseInt(this.dataset.index);
        cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
      dotsContainer.appendChild(dot);
    }
    var dots = dotsContainer.querySelectorAll('button');
    /* Update active dot on scroll */
    track.addEventListener('scroll', function () {
      var scrollLeft = track.scrollLeft;
      var cardWidth = cards[0].offsetWidth + 24; /* gap */
      var activeIdx = Math.round(scrollLeft / cardWidth);
      dots.forEach(function (d, j) {
        d.classList.toggle('active', j === activeIdx);
      });
    });
    /* Arrow navigation */
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        var cardWidth = cards[0].offsetWidth + 24;
        track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var cardWidth = cards[0].offsetWidth + 24;
        track.scrollBy({ left: cardWidth, behavior: 'smooth' });
      });
    }
  }

});
