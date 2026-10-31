/* ============================================================================
   PROFESSOR DO FUTURO — Interações Glassmorphism (Site Principal)
   Cursor-glare dinâmico + reveal por scroll (ajuste para .revealed do DS)
   ============================================================================ */
(function(){
  'use strict';

  // ---------- Brilho que segue o cursor ----------
  var glare = document.getElementById('cursorGlare');
  if (glare) {
    document.addEventListener('mousemove', function(e) {
      glare.style.left = e.clientX + 'px';
      glare.style.top = e.clientY + 'px';
    }, { passive: true });
    document.addEventListener('mouseenter', function() {
      glare.classList.add('active');
    }, { passive: true });
    document.addEventListener('mouseleave', function() {
      glare.classList.remove('active');
    }, { passive: true });
  }

  // ---------- Reveal on scroll (usa classe .revealed do design-system) ----------
  function initReveal(){
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function(el){ el.classList.add('revealed'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function(el){ io.observe(el); });
  }

  // ---------- Navbar scrolled ----------
  function initNavbar(){
    var nav = document.getElementById('siteNav');
    if (!nav) return;
    window.addEventListener('scroll', function() {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }, { passive: true });
  }

  // ---------- Burger menu ----------
  function initBurger(){
    var burger = document.getElementById('burger');
    var navLinks = document.getElementById('navLinks');
    if (!burger || !navLinks) return;
    burger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });
    navLinks.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        document.body.classList.remove('menu-open');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    initReveal();
    initNavbar();
    initBurger();
  });
})();
