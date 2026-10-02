/* ETAPA 4 — Chat flutuante do Tutor IA (em TODAS as páginas).
   Visual alinhado ao tema do site (verde/dourado) e aos dois temas
   (claro/escuro) via variáveis do style.css. A conversa é guardada
   no navegador para não se perder ao trocar de página.
   Uso: <script src="js/ia.js"></script><script src="js/tutor.js"></script> */
(function(){
  'use strict';
  var SUGESTOES = ['Gerar atividade', 'Plano de aula', 'Ideia de quiz'];
  var OLA = '👋 Oi! Sou o <b>Tutor do Professor do Futuro</b>. Gero atividades, planos e quizzes, e ajudo com dúvidas de sala e inclusão (AEE/TEA/TDAH). O que você precisa hoje?';
  var HIST_KEY = 'pdf.tutor.chat';   // conversa salva (últimas mensagens)
  var AVISO_KEY = 'pdf.tutor.nudge'; // dica já dispensada?
  var MAX_HIST = 12;                 // mensagens guardadas

  function IA(){ return window.LabIA || null; }
  function esc(s){ var a = IA(); return a ? a.esc(s) : String(s); }

  function salvar(hist){
    try{ localStorage.setItem(HIST_KEY, JSON.stringify(hist.slice(-MAX_HIST))); }catch(e){}
  }
  function carregar(){
    try{
      var v = JSON.parse(localStorage.getItem(HIST_KEY) || '[]');
      return Array.isArray(v) ? v : [];
    }catch(e){ return []; }
  }

  // Markdown MUITO simples e seguro (escapa antes de formatar):
  // **negrito**, *itálico*, `código`, listas com "-" e "1.".
  function inline(s){
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }
  function formatar(texto){
    var linhas = String(texto == null ? '' : texto).replace(/\r/g, '').split('\n');
    var out = [], tipo = null;
    function fechaLista(){ if(tipo){ out.push(tipo === 'ul' ? '</ul>' : '</ol>'); tipo = null; } }
    linhas.forEach(function(raw){
      var l = raw.trim();
      if(!l){ fechaLista(); return; }
      var ul = l.match(/^[-*•]\s+(.*)$/);
      var ol = l.match(/^\d+[.)]\s+(.*)$/);
      if(ul){
        if(tipo !== 'ul'){ fechaLista(); out.push('<ul>'); tipo = 'ul'; }
        out.push('<li>' + inline(ul[1]) + '</li>');
      } else if(ol){
        if(tipo !== 'ol'){ fechaLista(); out.push('<ol>'); tipo = 'ol'; }
        out.push('<li>' + inline(ol[1]) + '</li>');
      } else {
        fechaLista();
        out.push('<p>' + inline(l) + '</p>');
      }
    });
    fechaLista();
    return out.join('');
  }

  function montar(){
    if(document.getElementById('tutorFab')) return;
    var css = document.createElement('style');
    // Cores vêm do style.css (--grad, --card, --text, --border, --violet-600…)
    // com fallback para quando a página não tiver o CSS principal carregado.
    css.textContent = [
      '#tutorFab{position:fixed;right:1.1rem;bottom:1.1rem;z-index:9998;width:3.7rem;height:3.7rem;border-radius:50%;',
      'border:2px solid rgba(255,255,255,.9);cursor:pointer;display:grid;place-items:center;font-size:1.55rem;line-height:1;',
      'background:var(--grad,linear-gradient(135deg,#0d3a23,#0f9d72 55%,#c9971c));color:#fff;',
      'box-shadow:0 10px 30px rgba(6,43,27,.45);transition:transform .25s ease,box-shadow .25s ease;}',
      '#tutorFab:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 16px 40px rgba(6,43,27,.5);}',
      '#tutorFab:active{transform:scale(.95);}',
      '#tutorFab:focus-visible{outline:3px solid var(--accent,#f59e0b);outline-offset:3px;}',
      '#tutorDot{position:absolute;top:.28rem;right:.28rem;width:.9rem;height:.9rem;border-radius:50%;background:#22c55e;border:2px solid #fff;animation:tutorPulse 1.8s infinite;}',
      '@keyframes tutorPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.65)}70%{box-shadow:0 0 0 .55rem rgba(34,197,94,0)}}',
      '#tutorNudge{position:fixed;right:5.2rem;bottom:1.6rem;z-index:9998;max-width:15rem;text-align:left;padding:.6rem .85rem;',
      'border-radius:14px;border:1px solid var(--border,#e6efdc);background:var(--card,#fff);color:var(--text,#0f2a1e);',
      'font-size:.82rem;font-weight:600;font-family:var(--ff,"Segoe UI",system-ui,sans-serif);',
      'box-shadow:var(--shadow-lg,0 24px 60px rgba(6,43,27,.3));cursor:pointer;opacity:0;transform:translateY(8px);transition:.3s;}',
      '#tutorNudge.show{opacity:1;transform:translateY(0);}',
      '#tutorNudge b{color:var(--violet-600,#8a6a10);}',
      '#tutorPainel{position:fixed;right:1.1rem;bottom:5.3rem;z-index:9999;width:min(25rem,calc(100vw - 1.6rem));',
      'max-height:min(34rem,calc(100vh - 7.5rem));display:none;flex-direction:column;overflow:hidden;',
      'background:var(--card,#fff);color:var(--text,#0f2a1e);border:1px solid var(--border,#e6efdc);border-radius:18px;',
      'box-shadow:var(--shadow-lg,0 24px 60px rgba(6,43,27,.3));font-family:var(--ff,"Segoe UI",system-ui,sans-serif);}',
      '#tutorPainel.open{display:flex;animation:tutorUp .24s ease;}',
      '@keyframes tutorUp{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}',
      '#tutorTop{display:flex;align-items:center;gap:.6rem;padding:.8rem .95rem;',
      'background:var(--grad,linear-gradient(135deg,#0d3a23,#0f9d72 55%,#c9971c));color:#fff;}',
      '.tutor-avatar{width:2.3rem;height:2.3rem;border-radius:50%;display:grid;place-items:center;font-size:1.25rem;',
      'background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);flex:none;}',
      '.tutor-id{flex:1;min-width:0;line-height:1.2;}',
      '.tutor-id b{display:block;font-size:.98rem;}',
      '.tutor-id small{font-size:.72rem;opacity:.92;}',
      '.tutor-top-actions{display:flex;gap:.25rem;align-items:center;}',
      '.tutor-top-actions a{display:grid;place-items:center;text-decoration:none;color:#fff;width:2rem;height:2rem;border-radius:50%;',
      'background:rgba(255,255,255,.16);font-size:.9rem;line-height:1;transition:.2s;}',
      '.tutor-top-actions a:hover{background:rgba(255,255,255,.32);}',
      '.tutor-top-actions button{border:none;background:rgba(255,255,255,.16);color:#fff;width:2rem;height:2rem;border-radius:50%;',
      'cursor:pointer;font-size:.9rem;line-height:1;transition:.2s;}',
      '.tutor-top-actions button:hover{background:rgba(255,255,255,.32);}',
      '#tutorMsgs{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:.6rem;padding:.9rem;background:var(--bg-soft,#eef3e4);}',
      '.tmsg{max-width:88%;padding:.6rem .8rem;border-radius:14px;font-size:.9rem;line-height:1.55;overflow-wrap:anywhere;word-break:break-word;}',
      '.tmsg p{margin:0 0 .45rem;}.tmsg p:last-child{margin-bottom:0;}',
      '.tmsg ul,.tmsg ol{margin:.3rem 0;padding-left:1.15rem;}.tmsg li{margin:.15rem 0;}',
      '.tmsg ul{list-style:disc;}.tmsg ol{list-style:decimal;}',
      '.tmsg strong{font-weight:800;}',
      '.tmsg code{background:var(--bg-soft,#eef3e4);color:var(--text,#0f2a1e);padding:.05rem .35rem;border-radius:6px;font-size:.86em;}',
      '.tmsg.bot{background:var(--card,#fff);border:1px solid var(--border,#e6efdc);color:var(--text,#0f2a1e);align-self:flex-start;border-bottom-left-radius:6px;}',
      '.tmsg.eu{background:linear-gradient(135deg,var(--indigo-900,#062b1b),var(--indigo-800,#0b7a5e));color:#fff;align-self:flex-end;border-bottom-right-radius:6px;}',
      '.tmsg.erro{border-color:rgba(220,38,38,.45);background:rgba(220,38,38,.06);}',
      '.tutor-retry{margin-left:.4rem;border:1px solid currentColor;background:transparent;color:inherit;border-radius:999px;padding:.15rem .6rem;font-size:.78rem;cursor:pointer;}',
      '.tutor-typing{display:inline-flex;gap:.22rem;align-items:center;}',
      '.tutor-typing i{width:.42rem;height:.42rem;border-radius:50%;background:var(--violet-600,#8a6a10);animation:tutorBlink 1s infinite ease-in-out;}',
      '.tutor-typing i:nth-child(2){animation-delay:.15s;}',
      '.tutor-typing i:nth-child(3){animation-delay:.3s;}',
      '@keyframes tutorBlink{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-2px)}}',
      '#tutorChips{display:flex;gap:.4rem;flex-wrap:wrap;padding:.5rem .9rem;background:var(--bg-soft,#eef3e4);border-top:1px solid var(--border,#e6efdc);}',
      '#tutorChips button{border:1px solid var(--violet-600,#8a6a10);background:var(--card,#fff);color:var(--violet-600,#8a6a10);',
      'border-radius:999px;padding:.32rem .75rem;font-size:.78rem;font-weight:700;cursor:pointer;transition:.2s;}',
      '#tutorChips button:hover{background:var(--violet-600,#8a6a10);color:var(--card,#fff);}',
      '#tutorForm{display:flex;gap:.45rem;align-items:flex-end;padding:.7rem;border-top:1px solid var(--border,#e6efdc);background:var(--card,#fff);}',
      '#tutorInput{flex:1;min-width:0;max-height:7rem;resize:none;border:1px solid var(--border,#e6efdc);border-radius:12px;padding:.6rem .75rem;',
      'font-size:.92rem;font-family:inherit;line-height:1.4;background:var(--bg,#f6f8ee);color:var(--text,#0f2a1e);}',
      '#tutorInput::placeholder{color:var(--text-muted,#5c6850);}',
      '#tutorInput:focus{outline:2px solid var(--violet-600,#8a6a10);outline-offset:1px;border-color:var(--violet-600,#8a6a10);}',
      '#tutorSend{border:none;border-radius:12px;padding:.6rem .9rem;font-size:1rem;cursor:pointer;color:#fff;flex:none;',
      'background:var(--grad,linear-gradient(135deg,#0d3a23,#0f9d72 55%,#c9971c));transition:.2s;}',
      '#tutorSend:hover:not(:disabled){filter:brightness(1.08);}',
      '#tutorSend:disabled{opacity:.55;cursor:not-allowed;}',
      '@media(max-width:640px){#tutorNudge{right:1.1rem;bottom:5.2rem;}#tutorPainel{right:.6rem;left:.6rem;width:auto;bottom:5rem;max-height:min(36rem,calc(100vh - 6.5rem));}}',
      '@media print{#tutorFab,#tutorPainel,#tutorNudge,#tutorDot{display:none !important;}}'
    ].join('');
    document.head.appendChild(css);

    var fab = document.createElement('button');
    fab.id = 'tutorFab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Abrir o chat do Tutor IA');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = '<span aria-hidden="true">🤖</span><span id="tutorDot"></span>';
    document.body.appendChild(fab);

    // Dica (aparece só na primeira visita) — ajuda a descobrir o Tutor.
    var nudge = null;
    try{
      if(localStorage.getItem(AVISO_KEY) !== '1'){
        nudge = document.createElement('button');
        nudge.id = 'tutorNudge';
        nudge.type = 'button';
        nudge.innerHTML = 'Precisa de ajuda? <b>Fale com o Tutor IA</b> 👋';
        document.body.appendChild(nudge);
      }
    }catch(e){}

    var painel = document.createElement('div');
    painel.id = 'tutorPainel';
    painel.setAttribute('role', 'dialog');
    painel.setAttribute('aria-label', 'Chat do Tutor IA');
    painel.innerHTML =
      '<div id="tutorTop">' +
        '<span class="tutor-avatar" aria-hidden="true">🤖</span>' +
        '<div class="tutor-id"><b>Tutor do Professor</b><small>IA do Laboratório · responde na hora</small></div>' +
        '<div class="tutor-top-actions">' +
          '<a href="perguntas.html" title="Abrir chat completo" aria-label="Abrir chat completo">💬</a>' +
          '<button type="button" id="tutorClear" title="Limpar conversa" aria-label="Limpar conversa">🧹</button>' +
          '<button type="button" id="tutorClose" title="Fechar" aria-label="Fechar chat">✕</button>' +
        '</div>' +
      '</div>' +
      '<div id="tutorMsgs"></div><div id="tutorChips"></div>' +
      '<form id="tutorForm">' +
        '<textarea id="tutorInput" rows="1" maxlength="600" placeholder="Escreva sua dúvida…" autocomplete="off" aria-label="Sua mensagem"></textarea>' +
        '<button id="tutorSend" type="submit" aria-label="Enviar mensagem">➤</button>' +
      '</form>';
    document.body.appendChild(painel);

    var msgs = document.getElementById('tutorMsgs');
    var chips = document.getElementById('tutorChips');
    var form = document.getElementById('tutorForm');
    var input = document.getElementById('tutorInput');
    var envia = document.getElementById('tutorSend');
    var hist = carregar();

    function bolha(html, quem){
      var d = document.createElement('div');
      d.className = 'tmsg ' + quem;
      d.innerHTML = html;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      return d;
    }
    function mostrarChips(lista){
      chips.innerHTML = '';
      var itens = (lista || []).filter(Boolean).slice(0, 4);
      chips.style.display = itens.length ? 'flex' : 'none';
      itens.forEach(function(s){
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = s;
        b.addEventListener('click', function(){ enviar(s); });
        chips.appendChild(b);
      });
    }
    function crescer(){
      input.style.height = 'auto';
      input.style.height = Math.min(112, input.scrollHeight) + 'px';
    }
    function esconderDica(){
      if(!nudge) return;
      try{
        nudge.classList.remove('show');
        if(nudge.parentNode) nudge.parentNode.removeChild(nudge);
        localStorage.setItem(AVISO_KEY, '1');
      }catch(e){}
      nudge = null;
    }
    function abrir(forcar){
      var querAberto = (typeof forcar === 'boolean') ? forcar : !painel.classList.contains('open');
      painel.classList.toggle('open', querAberto);
      fab.setAttribute('aria-expanded', querAberto ? 'true' : 'false');
      var dot = document.getElementById('tutorDot');
      if(dot && querAberto) dot.style.display = 'none';
      esconderDica();
      if(querAberto){ setTimeout(function(){ input.focus(); }, 60); }
    }

    // Reconstrói a conversa salva (se houver) ou mostra a saudação.
    if(hist.length){
      hist.forEach(function(m){
        bolha(m && m.role === 'user' ? esc(m.content) : formatar(m && m.content), (m && m.role === 'user') ? 'eu' : 'bot');
      });
    } else {
      bolha(OLA, 'bot');
    }
    mostrarChips(SUGESTOES);

    function enviar(texto){
      texto = String(texto || '').trim();
      if(!texto) return;
      bolha(esc(texto), 'eu');
      hist.push({ role: 'user', content: texto });
      hist = hist.slice(-MAX_HIST);
      input.value = '';
      crescer();
      var aguarde = bolha('<span class="tutor-typing" aria-label="digitando"><i></i><i></i><i></i></span>', 'bot');
      mostrarChips([]);
      if(envia) envia.disabled = true;
      var a = IA();
      if(!a){
        aguarde.className = 'tmsg bot erro';
        aguarde.innerHTML = '⚠️ O chat ainda está carregando. Tente de novo em 1 segundo.';
        if(envia) envia.disabled = false;
        return;
      }
      var ctx = (document.title || '') + ' | ' + (location.pathname.split('/').pop() || '');
      a.chamar('tutor-chat', { mensagem: texto, historico: hist.slice(-10), contexto: ctx }, 60000).then(function(d){
        var resp = (d && d.resposta) ? String(d.resposta) : 'Não recebi resposta. Pode reformular a pergunta?';
        aguarde.innerHTML = formatar(resp);
        hist.push({ role: 'assistant', content: resp });
        hist = hist.slice(-MAX_HIST);
        salvar(hist);
        mostrarChips(d && d.sugestoes && d.sugestoes.length ? d.sugestoes : SUGESTOES);
        if(envia) envia.disabled = false;
      }).catch(function(err){
        aguarde.className = 'tmsg bot erro';
        aguarde.innerHTML = '⚠️ ' + esc((err && err.message) || 'Tutor indisponível.') +
          ' <button type="button" class="tutor-retry">Tentar de novo</button>';
        var rb = aguarde.querySelector('.tutor-retry');
        if(rb) rb.addEventListener('click', function(){
          if(aguarde.parentNode) aguarde.parentNode.removeChild(aguarde);
          if(hist.length && hist[hist.length - 1].role === 'user') hist.pop();
          enviar(texto);
        });
        mostrarChips(SUGESTOES);
        if(envia) envia.disabled = false;
      });
      msgs.scrollTop = msgs.scrollHeight;
    }

    fab.addEventListener('click', function(){ abrir(); });
    var btFechar = document.getElementById('tutorClose');
    if(btFechar) btFechar.addEventListener('click', function(){ abrir(false); });
    var btLimpar = document.getElementById('tutorClear');
    if(btLimpar) btLimpar.addEventListener('click', function(){
      hist = [];
      salvar(hist);
      msgs.innerHTML = '';
      bolha(OLA, 'bot');
      mostrarChips(SUGESTOES);
      input.focus();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && painel.classList.contains('open')) abrir(false);
    });
    form.addEventListener('submit', function(e){ e.preventDefault(); enviar(input.value); });
    input.addEventListener('input', crescer);
    input.addEventListener('keydown', function(e){
      if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); enviar(input.value); }
    });

    // Dica: aparece depois de alguns segundos, se o chat não foi aberto.
    if(nudge){
      nudge.addEventListener('click', function(){ abrir(true); });
      setTimeout(function(){ if(nudge && !painel.classList.contains('open')) nudge.classList.add('show'); }, 6000);
      setTimeout(function(){ if(nudge) nudge.classList.remove('show'); }, 22000);
    }
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', montar); }
  else { montar(); }

  // API pública do Tutor — permite perguntar a partir de outras telas (ex.: slides).
  var API = {
    abrir: function(){ var f = document.getElementById('tutorFab'); if(f) f.click(); },
    perguntar: function(texto){
      var f = document.getElementById('tutorFab');
      var painel = document.getElementById('tutorPainel');
      if(f && painel && !painel.classList.contains('open')) f.click();
      var inp = document.getElementById('tutorInput');
      var form = document.getElementById('tutorForm');
      if(inp && form){
        inp.value = String(texto || '');
        if(form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event('submit', { cancelable:true }));
      }
    }
  };
  if(typeof window !== 'undefined') window.Tutor = API;
})();
