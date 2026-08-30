/* ============================================================
   PROFESSOR DO FUTURO — loader.js
   Página de carregamento (splash) em tela cheia.
   → Injetada de forma SINCRONA no <head>, antes de guard.js,
     para que nenhuma página apareça "quebrada" ou vazia.
   → Também injeta hélices de conexão (preconnect) para acelerar
     a conexão com o CDN e com o Supabase.

   API global (window.Loader):
     Loader.setMessage(texto)   — atualiza o texto sob a barra
     Loader.setProgress(0..100) — fixa a barra em um percentual
     Loader.hide()              — esconde e remove o splash
   ============================================================ */
(function(){
  'use strict';

  /* Hélice de rede — acelera a conexão com o Supabase */
  ['https://ngkkhpvganrfctvyyvle.supabase.co'].forEach(function(href){
    var pre = document.createElement('link');
    pre.rel = 'preconnect';
    pre.href = href;
    pre.crossOrigin = 'anonymous';
    document.head.appendChild(pre);
  });

  var CSS =
    '.pdf-loader{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;' +
    'background:radial-gradient(120% 120% at 20% 0%,#0a5c47,#0b7a5e 60%,#8a6414);color:#fff;' +
    'font-family:"Segoe UI",system-ui,sans-serif;transition:opacity .38s ease;}' +
    '.pdf-loader.gone{opacity:0;visibility:hidden;pointer-events:none;}' +
    '.pdf-loader-inner{text-align:center;max-width:340px;padding:0 24px;}' +
    '.pdf-loader-logo{width:84px;height:84px;margin:0 auto 18px;border-radius:24px;display:grid;place-items:center;' +
    'font-size:2.6rem;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.28);' +
    'box-shadow:0 16px 40px rgba(0,0,0,.28);animation:pdf-l-pulse 1.6s ease-in-out infinite;}' +
    '.pdf-loader-name{font-size:1.32rem;font-weight:700;letter-spacing:.3px;margin-bottom:4px;}' +
    '.pdf-loader-name em{font-style:normal;color:#f7d98c;font-weight:800;}' +
    '.pdf-loader-sub{font-size:.85rem;opacity:.85;margin-bottom:22px;}' +
    '.pdf-loader-bar{width:100%;height:8px;border-radius:999px;background:rgba(255,255,255,.24);overflow:hidden;' +
    'margin:0 auto 14px;}' +
    '.pdf-loader-bar>span{display:block;height:100%;width:28%;border-radius:999px;' +
    'background:linear-gradient(90deg,#f7d98c,#fff);animation:pdf-l-slide 1.05s ease-in-out infinite;}' +
    '.pdf-loader-msg{font-size:.9rem;font-weight:600;letter-spacing:.3px;opacity:.95;min-height:1.2em;}' +
    '@keyframes pdf-l-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}' +
    '@keyframes pdf-l-slide{0%{margin-left:-40%;width:30%}100%{margin-left:105%;width:30%}}';

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  function build(){
    var existing = document.getElementById('pdfLoader');
    if(existing) return existing;
    var root = document.createElement('div');
    root.id = 'pdfLoader';
    root.className = 'pdf-loader';
    root.setAttribute('aria-live', 'polite');
    root.innerHTML =
      '<div class="pdf-loader-inner">' +
        '<div class="pdf-loader-logo">🎓</div>' +
        '<div class="pdf-loader-name"><em>Professor</em> do Futuro</div>' +
        '<div class="pdf-loader-sub">Slides · IA · Inclusão · Gestão</div>' +
        '<div class="pdf-loader-bar"><span></span></div>' +
        '<div class="pdf-loader-msg">Carregando a plataforma…</div>' +
      '</div>';
    (document.body || document.documentElement).appendChild(root);
    return root;
  }

  var root = build();

  window.Loader = {
    setMessage: function(m){
      var el = document.getElementById('pdfLoaderMsg');
      if(el){ el.textContent = (m == null ? '' : m); }
    },
    setProgress: function(p){
      var el = root.querySelector('.pdf-loader-bar > span');
      if(el){
        el.style.animation = 'none';
        el.style.width = Math.max(0, Math.min(100, p)) + '%';
      }
    },
    hide: function(){
      window.Loader.setMessage('Tudo pronto, abrindo sua área…');
      setTimeout(function(){
        root.classList.add('gone');
        setTimeout(function(){
          var parent = root.parentNode;
          if(parent){ parent.removeChild(root); }
        }, 430);
      }, 300);
    }
  };
})();