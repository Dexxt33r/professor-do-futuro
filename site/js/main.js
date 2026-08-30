/* ============================================================
   PROFESSOR DO FUTURO — main.js
   Navbar/footer compartilhados, animações, utilitários
   ============================================================ */
(function(){
  'use strict';

  var COURSE = {
    name: 'Professor do Futuro',
    tag: 'Criação de Slides com IA, Inclusão e Gestão da Sala de Aula Digital',
    slogan: 'Diminua sua carga horária'
  };

  // Bordão global — selo discreto fixo no canto (TODAS as páginas)
  function renderRibbon(){
    var seal = document.createElement('a');
    seal.className = 'foco-seal';
    seal.setAttribute('href', 'prompts.html');
    seal.setAttribute('title', 'Foco do curso: ' + COURSE.slogan);
    seal.innerHTML =
      '<span class="foco-ic">⏱️</span>' +
      '<span class="foco-txt"><b>Foco do curso:</b> ' + COURSE.slogan + '</span>';
    document.body.appendChild(seal);
  }

  var NAV_LINKS = [
    { href:'index.html', label:'Início' },
    { href:'curso.html', label:'O Curso' },
    { href:'prompts.html', label:'Prompts' },
    { href:'slides.html', label:'Biblioteca' },
    { href:'ferramentas.html', label:'Laboratório' }
  ];

  function currentPage(){
    var p = location.pathname.split('/').pop() || 'index.html';
    return p.toLowerCase();
  }

  function renderNav(){
    var nav = document.getElementById('siteNav');
    if(!nav) return;
    var links = '';
    NAV_LINKS.forEach(function(l){
      var cls = (currentPage() === l.href) ? 'class="active"' : '';
      links += '<a href="' + l.href + '" ' + cls + '>' + l.label + '</a>';
    });

    // Conta: mostra nome + Sair se logado, senão botão Entrar (preenchido via sessão)
    var acct = '<span class="auth-chip" id="authArea">…</span>';

    nav.innerHTML =
      '<div class="container topbar">' +
        '<a href="index.html" class="logo"><span class="logo-ic">🎓</span><span><em>Professor</em> do Futuro</span></a>' +
        '<nav class="nav-links" id="navLinks">' + links + '</nav>' +
        '<div class="top-actions" id="topActions">' +
          '<button class="theme-btn" id="themeToggle" aria-label="Alternar tema claro/escuro" title="Alternar tema">🌙</button>' +
          acct +
          '<a href="slides.html" class="btn btn-primary top-cta" style="padding:.6rem 1.2rem;font-size:.9rem">▶ Ver apresentações</a>' +
        '</div>' +
        '<button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '</div>';

    function showAccount(user){
      var area = document.getElementById('authArea');
      if(!area) return;
      if(user){
        var n = (user.name || 'Conta').trim().split(' ')[0];
        area.innerHTML =
          '<span class="auth-chip" title="' + (window.Auth.escapeHtml(user.email)) + '">' + (window.Auth.escapeHtml(n)) + '</span>' +
          '<a href="#" class="btn btn-outline auth-btn" id="authLogout" style="padding:.5rem 1rem;font-size:.85rem">Sair</a>';
      } else {
        area.innerHTML = '';
        var loginA = document.createElement('a');
        loginA.href = 'login.html';
        loginA.className = 'btn btn-outline auth-btn';
        loginA.style.cssText = 'padding:.5rem 1.1rem;font-size:.85rem';
        loginA.textContent = 'Entrar';
        area.appendChild(loginA);
      }
      bindLogout();
    }

    // Preenche o estado da conta de forma assíncrona
    window.Auth.ready(function(){
      Auth.getUser().then(showAccount);
    });

    var burger = document.getElementById('burger');
    if(burger){
      burger.addEventListener('click', function(){ document.body.classList.toggle('side-open'); });
    }
    var tt = document.getElementById('themeToggle');
    if(tt){
      tt.textContent = (document.documentElement.getAttribute('data-theme') === 'dark') ? '☀️' : '🌙';
      tt.addEventListener('click', function(){
        var dark = document.documentElement.getAttribute('data-theme') !== 'dark';
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        tt.textContent = dark ? '☀️' : '🌙';
        try{ localStorage.setItem('pdf-theme', dark ? 'dark' : 'light'); }catch(e){}
      });
    }
    bindLogout();
  }

  function bindLogout(){
    var lo = document.getElementById('authLogout');
    if(lo){
      lo.addEventListener('click', function(e){
        e.preventDefault();
        Auth.logout().then(function(){ window.location.replace('login.html'); });
      });
    }
  }

  // Retorna o link "Continuar curso" apontando para o último módulo visitado
  function continuarHref(){
    try{
      var m = localStorage.getItem('pdf-modulo');
      if(m && /^modulo\d+$/.test(m)) return 'modulos.html#' + m;
    }catch(e){}
    return 'modulos.html#modulo1';
  }

  // Menu lateral por categorias — injetado em TODAS as páginas
  function renderSide(){
    if(document.getElementById('sidenav')) return;
    var cur = currentPage();
    var groups = [
      { label:'Navegação', links:[
        { href:'index.html', ic:'🏠', label:'Início' },
        { href:'curso.html',  ic:'📘', label:'Ver Curso' }
      ]},
      { label:'Aprender', links:[
        { href: continuarHref(), ic:'▶️', label:'Continuar Curso' },
        { href:'slides.html', ic:'🎞️', label:'Biblioteca de Slides' }
      ]},
      { label:'Recursos', links:[
        { href:'prompts.html', ic:'⚡', label:'Prompts' },
        { href:'leitura.html', ic:'📖', label:'Leitura' },
        { href:'ferramentas.html', ic:'🧪', label:'Lab & Ferramentas' }
      ]}
    ];
    function item(l){
      var active = (cur === l.href.split('#')[0]) ? ' active' : '';
      return '<a class="sl-link'+active+'" href="'+l.href+'"><span class="sl-ic">'+l.ic+'</span><span>'+l.label+'</span></a>';
    }
    var html =
      '<div class="side-head">' +
        '<a href="index.html" class="side-logo">🎓 <em>Professor</em> do Futuro</a>' +
        '<span class="side-tag">Slides · IA · Inclusão · Gestão</span>' +
      '</div>' +
      '<nav class="side-nav">' +
        groups.map(function(g){
          return '<div class="side-group"><span class="side-label">'+g.label+'</span>' + g.links.map(item).join('') + '</div>';
        }).join('') +
      '</nav>' +
      '<div class="side-foot">' +
        '<a class="side-promo" href="prompts.html">' +
          '<span class="sp-ic">⏱️</span>' +
          '<span><b>Diminua sua carga horária</b><small>Materiais prontos em minutos</small></span>' +
        '</a>' +
      '</div>';

    var aside = document.createElement('aside');
    aside.className = 'sidenav'; aside.id = 'sidenav';
    aside.innerHTML = html;
    document.body.appendChild(aside);

    var ov = document.createElement('div');
    ov.className = 'side-overlay'; ov.id = 'sideOverlay';
    document.body.appendChild(ov);
    ov.addEventListener('click', function(){ document.body.classList.remove('side-open'); });
    document.body.addEventListener('keydown', function(e){
      if(e.key === 'Escape') document.body.classList.remove('side-open');
    });
  }

  // Em modulos.html, grava o último módulo visto para o "Continuar curso"
  function trackModule(){
    if(currentPage() !== 'modulos.html') return;
    var els = document.querySelectorAll('.panel[id^="modulo"]');
    if(!els.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ try{ localStorage.setItem('pdf-modulo', e.target.id); }catch(x){} }
      });
    }, { threshold:.4 });
    els.forEach(function(el){ io.observe(el); });
  }

  function renderFooter(){
    var foot = document.getElementById('siteFooter');
    if(!foot) return;
    foot.innerHTML =
      '<div class="container">' +
        '<div class="foot-tag">⚡ <b>' + COURSE.slogan + '</b> — slides, inclusão e gestão de sala com IA, sem virar madrugada montando aula.</div>' +
        '<div class="foot-grid">' +
          '<div><h4>🎓 ' + COURSE.name + '</h4>' +
          '<p style="max-width:340px">Criação de Slides com IA, Inclusão e Gestão da Sala de Aula Digital. Do infantil ao EM, com foco em AEE e comportamento.</p></div>' +
          '<div><h4>Navegação</h4><ul class="foot-links">' +
            '<li><a href="curso.html">O Curso</a></li>' +
            '<li><a href="modulos.html">Módulos</a></li>' +
            '<li><a href="ferramentas.html">Laboratório</a></li>' +
            '<li><a href="prompts.html">Banco de Prompts</a></li>' +
            '<li><a href="slides.html">Biblioteca de apresentações</a></li>' +
            '<li><a href="leitura.html">Biblioteca de Leitura</a></li>' +
          '</ul></div>' +
          '<div><h4>Recursos</h4><ul class="foot-links">' +
            '<li><a href="curso.html#avaliacao">Avaliação</a></li>' +
            '<li><a href="modulos.html#checklists">Checklists</a></li>' +
            '<li><a href="modulos.html#modulo1">Conteúdo por módulo</a></li>' +
            '<li><a href="leitura.html">📖 Leitura & Estudo</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="foot-bottom">© ' + new Date().getFullYear() + ' Professor do Futuro — Feito para educadores ♥</div>' +
      '</div>';
  }

  // Reveal on scroll
  function initReveal(){
    var els = document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)){
      els.forEach(function(el){ el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    },{ threshold:.12 });
    els.forEach(function(el){ io.observe(el); });
  }

  // Clipboard helper global
  window.copyText = function(text, btn){
    var done = function(){
      if(btn){ var o = btn.textContent; btn.textContent = 'Copiado! ✓'; btn.classList.add('done');
        setTimeout(function(){ btn.textContent = 'Copiar'; btn.classList.remove('done'); }, 1800); }
    };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done, function(){
        fallback(text); done();
      });
    } else { fallback(text); done(); }
  };
  function fallback(t){
    var ta = document.createElement('textarea');
    ta.value = t; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta);
  }

  // Botões "Copiar" — delegação global (funciona em prompts.html, modulos.html
  // e em qualquer <pre> renderizado dinamicamente)
  document.addEventListener('click', function(e){
    var btn = e.target.closest ? e.target.closest('.copy-btn') : null;
    if(!btn || !btn.parentNode) return;
    // Copia o texto do <pre>, removendo o rótulo do próprio botão
    var code = btn.parentNode.textContent.replace(/Copiar|Copiado! ✓/g,'').trim();
    copyText(code, btn);
  });

  // Botão "voltar ao topo"
  function addTopBtn(){
    var b = document.createElement('button');
    b.id = 'topBtn';
    b.setAttribute('aria-label','Voltar ao topo');
    b.innerHTML = '↑';
    b.style.cssText =
      'position:fixed;right:1.2rem;bottom:1.2rem;z-index:150;width:46px;height:46px;' +
      'border:none;border-radius:50%;cursor:pointer;font-size:1.3rem;color:#fff;' +
      'background:linear-gradient(135deg,#0b7a5e,#c9971c);box-shadow:0 10px 25px rgba(6,43,27,.35);' +
      'opacity:0;visibility:hidden;transform:translateY(10px);transition:.3s;';
    b.onclick = function(){ window.scrollTo({ top:0, behavior:'smooth' }); };
    document.body.appendChild(b);
    window.addEventListener('scroll', function(){
      var show = (window.scrollY || document.documentElement.scrollTop) > 480;
      b.style.opacity = show ? '1' : '0';
      b.style.visibility = show ? 'visible' : 'hidden';
      b.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
    }, { passive:true });
  }

  // Tema claro/escuro — lê preferência salva ou do sistema
  function initTheme(){
    var dark = false;
    try{
      var saved = localStorage.getItem('pdf-theme');
      if(saved){ dark = (saved === 'dark'); }
      else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){ dark = true; }
    }catch(e){
      if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){ dark = true; }
    }
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  // Mark active nav + inject
  document.addEventListener('DOMContentLoaded', function(){
    initTheme();
    renderRibbon();
    renderNav();
    renderSide();
    renderFooter();
    trackModule();
    initReveal();
    addTopBtn();
  });

  window.COURSE = COURSE;
})();
