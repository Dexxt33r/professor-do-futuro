/* ETAPA 4 — Chat flutuante do Tutor (todas as páginas).
   Uso: <script src="js/ia.js"></script><script src="js/tutor.js"></script> */
(function(){
  'use strict';
  var SUGESTOES = ['Gerar atividade', 'Plano de aula', 'Ideia de quiz'];
  var OLA = '👋 Oi! Sou o <b>Tutor do Professor do Futuro</b>. Gero atividades, planos, quizzes e tiro dúvidas de sala. O que você precisa hoje?';

  function IA(){ return window.LabIA || null; }
  function esc(s){ var a = IA(); return a ? a.esc(s) : String(s); }

  function montar(){
    if(document.getElementById('tutorFab')) return;
    var css = document.createElement('style');
    css.textContent = '#tutorFab{position:fixed;right:1.1rem;bottom:1.1rem;z-index:9998;width:3.6rem;height:3.6rem;border-radius:50%;border:none;cursor:pointer;font-size:1.7rem;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;box-shadow:0 8px 28px rgba(76,29,149,.45)}'
      + '#tutorDot{position:absolute;top:.35rem;right:.45rem;width:.7rem;height:.7rem;border-radius:50%;background:#22c55e;border:2px solid #fff}'
      + '#tutorPainel{position:fixed;right:1.1rem;bottom:5.2rem;z-index:9999;width:min(24rem,calc(100vw - 2rem));max-height:min(32rem,calc(100vh - 7rem));display:none;flex-direction:column;overflow:hidden;background:#fff;border-radius:1rem;box-shadow:0 18px 60px rgba(0,0,0,.28);border:1px solid #e5e7eb}'
      + '#tutorPainel.open{display:flex}'
      + '#tutorTop{background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;padding:.8rem 1rem;display:flex;gap:.6rem;align-items:center}'
      + '#tutorMsgs{padding:.8rem;display:flex;flex-direction:column;gap:.55rem;overflow-y:auto;flex:1;background:#f8fafc}'
      + '.tmsg{max-width:88%;padding:.55rem .75rem;border-radius:.8rem;font-size:.88rem;line-height:1.5}'
      + '.tmsg.bot{background:#fff;border:1px solid #e5e7eb;align-self:flex-start}'
      + '.tmsg.eu{background:#4f46e5;color:#fff;align-self:flex-end}'
      + '#tutorChips{display:flex;gap:.4rem;flex-wrap:wrap;padding:.4rem .8rem;background:#f8fafc}'
      + '#tutorChips button{border:1px solid #c7d2fe;background:#eef2ff;color:#3730a3;border-radius:999px;padding:.28rem .7rem;font-size:.78rem;cursor:pointer}'
      + '#tutorForm{display:flex;gap:.45rem;padding:.7rem;border-top:1px solid #e5e7eb;background:#fff}'
      + '#tutorInput{flex:1;border:1px solid #cbd5e1;border-radius:.7rem;padding:.55rem .7rem;font-size:.9rem}'
      + '#tutorSend{border:none;border-radius:.7rem;background:#4f46e5;color:#fff;padding:.55rem .9rem;cursor:pointer}';
    document.head.appendChild(css);

    var fab = document.createElement('button');
    fab.id = 'tutorFab';
    fab.setAttribute('aria-label', 'Abrir o chat do Tutor IA');
    fab.innerHTML = '🤖<span id="tutorDot"></span>';
    fab.style.position = 'fixed';
    document.body.appendChild(fab);

    var painel = document.createElement('div');
    painel.id = 'tutorPainel';
    painel.setAttribute('role', 'dialog');
    painel.innerHTML = '<div id="tutorTop"><span style="font-size:1.5rem">🤖</span><div><b>Tutor do Professor</b><br><small>IA do Laboratório · responde na hora</small></div></div>'
      + '<div id="tutorMsgs"></div><div id="tutorChips"></div>'
      + '<form id="tutorForm"><input id="tutorInput" maxlength="500" placeholder="Pergunte…" autocomplete="off"><button id="tutorSend" type="submit">➤</button></form>';
    document.body.appendChild(painel);

    var msgs = document.getElementById('tutorMsgs');
    var chips = document.getElementById('tutorChips');
    var form = document.getElementById('tutorForm');
    var input = document.getElementById('tutorInput');
    var hist = [];

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
      (lista || []).forEach(function(s){
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = s;
        b.addEventListener('click', function(){ enviar(s); });
        chips.appendChild(b);
      });
    }
    bolha(OLA, 'bot');
    mostrarChips(SUGESTOES);
    fab.addEventListener('click', function(){
      painel.classList.toggle('open');
      var dot = document.getElementById('tutorDot');
      if(dot) dot.style.display = 'none';
      if(painel.classList.contains('open')) input.focus();
    });
    function enviar(texto){
      texto = String(texto || '').trim();
      if(!texto) return;
      bolha(esc(texto), 'eu');
      hist.push({ role: 'user', content: texto });
      input.value = '';
      var aguarde = bolha('Digitando…', 'bot');
      mostrarChips([]);
      var a = IA();
      if(!a){ aguarde.innerHTML = '⚠️ Chat carregando…'; return; }
      a.chamar('tutor-chat', { mensagem: texto, historico: hist.slice(-6), contexto: document.title || '' }, 60000).then(function(d){
        aguarde.innerHTML = esc(d.resposta || '…');
        hist.push({ role: 'assistant', content: d.resposta || '' });
        hist = hist.slice(-8);
        mostrarChips(d.sugestoes && d.sugestoes.length ? d.sugestoes : SUGESTOES);
      }).catch(function(err){
        aguarde.innerHTML = '⚠️ ' + esc((err && err.message) || 'Tutor indisponível.');
        mostrarChips(SUGESTOES);
      });
    }
    form.addEventListener('submit', function(e){ e.preventDefault(); enviar(input.value); });
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', montar); }
  else { montar(); }
})();
