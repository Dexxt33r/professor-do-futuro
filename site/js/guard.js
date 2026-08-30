/* ============================================================
   PROFESSOR DO FUTURO — guard.js
   GATE de autenticação obrigatória.
   Este script (carregado nas páginas protegidas) BLOQUEIA a
   renderização do conteúdo até confirmar a sessão no Supabase.
   - Se autenticado: libera o conteúdo.
   - Se não autenticado: redireciona para o login ANTES de
     mostrar qualquer coisa (sem "flash" de conteúdo).
   ------------------------------------------------------------
   Coloque logo após auth.js e ANTES dos scripts de conteúdo.
   ============================================================ */
(function(){
  'use strict';

  /* ============================================================
     PROFESSOR DO FUTURO — guard.js  (gate de autenticação)
     Deve ser carregado NO <head> das páginas protegidas.
     Bloqueia TODA a página (via <html class="pdf-auth-lock">)
     ANTES de qualquer conteúdo renderizar. Falha fechada:
     sem sessão validada no Supabase, o conteúdo nunca aparece.
     ============================================================ */

  // 1) Injeta o CSS de bloqueio SINCRONAMENTE no <head> (antes do body existir)
  var style = document.createElement('style');
  style.textContent =
    'html.pdf-auth-lock, html.pdf-auth-lock body{visibility:hidden!important;overflow:hidden!important;height:100%;}' +
    '.pdf-auth-overlay{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;' +
    'align-items:center;justify-content:center;gap:1rem;background:' +
    'linear-gradient(135deg,#0b7a5e,#07875730 55%,#c9971c);color:#fff;font-family:"Segoe UI",system-ui,sans-serif;}' +
    '.pdf-auth-overlay .spinner{width:42px;height:42px;border-radius:50%;border:4px solid rgba(255,255,255,.3);' +
    'border-top-color:#f7d98c;animation:pdf-spin .8s linear infinite;}' +
    '.pdf-auth-overlay p{font-size:1rem;font-weight:600;letter-spacing:.3px;}' +
    '@keyframes pdf-spin{to{transform:rotate(360deg);}}';
  document.head.appendChild(style);   // ← anexado de fato (bug corrigido)

  // 2) Estado de bloqueio
  var BLOCK_KEY = 'pdf-auth-blocked';

  function unlock(){
    document.documentElement.classList.remove('pdf-auth-lock');
    var ov = document.querySelector('.pdf-auth-overlay');
    if(ov && ov.parentNode) ov.parentNode.removeChild(ov);
    try{ localStorage.removeItem(BLOCK_KEY); }catch(e){}
  }

  function block(){
    document.documentElement.classList.add('pdf-auth-lock');
    if(document.body && !document.querySelector('.pdf-auth-overlay')){
      var ov = document.createElement('div');
      ov.className = 'pdf-auth-overlay';
      ov.innerHTML = '<div class="spinner"></div><p>Verificando seu acesso…</p>';
      document.body.appendChild(ov);
    }
  }

  function goLogin(){
    var dest = encodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
    window.location.replace('login.html?next=' + dest);
  }

  // 3) Bloqueia IMEDIATAMENTE (o body ainda não existe; o overlay entra no DOMContentLoaded)
  block();
  document.addEventListener('DOMContentLoaded', block);

  // 4) Verifica a sessão quando o Supabase estiver pronto
  function check(){
    if(!window.Auth){ goLogin(); return; }
    if(!Auth.configured()){
      // Falha fechada: sem Supabase configurado, nunca libera — vai para o login.
      goLogin();
      return;
    }
    Auth.requireAuth().then(function(ok){
      if(ok){ unlock(); }
      // se !ok, requireAuth já redireciona para o login
    });
  }

  if(window.Auth){ Auth.ready(check); }
  else {
    // auth.js carrega antes do guard nas páginas protegidas; se por algum
    // motivo não existir ainda, tenta quando o DOM estiver pronto.
    document.addEventListener('DOMContentLoaded', function(){
      if(window.Auth){ Auth.ready(check); } else { goLogin(); }
    });
  }

  // 5) Rede de segurança: se em 12s nada liberou, falha fechada → login
  setTimeout(function(){
    if(document.documentElement.classList.contains('pdf-auth-lock')){
      goLogin();
    }
  }, 12000);

  window.__pdfUnlock = unlock; // apenas para depuração
})();