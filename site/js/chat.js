/* ============================================================
   PROFESSOR DO FUTURO — chat.js
   Chat de perguntas em página própria (perguntas.html).

   • Mesma Edge Function do Tutor flutuante (tutor-chat) → já no ar.
   • Histórico salvo SÓ neste navegador (localStorage privado).
   • Markdown simples e seguro (escapa antes de formatar).
   • Sugestões da IA em chips + perguntas prontas por categoria.

   Carregar depois de js/ia.js:
   <script src="js/ia.js"></script><script src="js/chat.js"></script>
   ============================================================ */
(function(){
  'use strict';

  var HIST_KEY = 'pdf.chat.page';  // conversa desta página (privada)
  var MAX_HIST = 40;               // mensagens guardadas
  var OLA = '👋 Oi! Sou o <b>Assistente do Professor do Futuro</b>. Pode perguntar sobre slides com IA, inclusão (AEE/TEA/TDAH), gestão de sala, avaliação ou o curso — ou clique numa sugestão ao lado.';

  var SUGESTOES = ['Como faço um plano de aula?', 'Ideia de atividade', 'Como adaptar para TEA?'];

  // Perguntas prontas da coluna lateral (categorias do curso)
  var IDEIAS = [
    { cat: 'Slides com IA', itens: [
      'Crie um prompt pronto para slides sobre fotosíntese (9º ano)',
      'Qual ferramenta de IA escolher: Gamma, Canva ou Google Slides?',
      'Como deixar slides com poucas palavras para a Educação Infantil?'
    ]},
    { cat: 'Inclusão (AEE)', itens: [
      'Como adaptar esta atividade para aluno com TEA?',
      'O que é CAA e como aplicar numa aula?',
      'Como reduzir sobrecarga sensorial em slides para TDAH?'
    ]},
    { cat: 'Gestão de sala', itens: [
      'Dinâmica rápida para recuperar a atenção da turma',
      'Como combinar regras com turma que fala demais?',
      'Plano de convivência para aluno com conduta desafiadora'
    ]},
    { cat: 'Avaliação', itens: [
      'Como montar uma rubrica à prova de IA?',
      '5 perguntas de defesa oral para o trabalho final',
      'Como adaptar uma prova para deficiência intelectual?'
    ]}
  ];

  function IA(){ return window.LabIA || null; }
  function esc(s){
    var a = IA();
    if(a && a.esc) return a.esc(s);
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  // ---- Markdown simples e seguro (igual ao do Tutor) ----
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

  // ---- Histórico (privado, neste navegador) ----
  function salvar(hist){
    try{ localStorage.setItem(HIST_KEY, JSON.stringify(hist.slice(-MAX_HIST))); }catch(e){}
  }
  function carregar(){
    try{
      var v = JSON.parse(localStorage.getItem(HIST_KEY) || '[]');
      return Array.isArray(v) ? v : [];
    }catch(e){ return []; }
  }

  // ---- Interface ----
  function $(id){ return document.getElementById(id); }

  function montar(){
    var msgs = $('chatMsgs');
    if(!msgs) return;

    var form = $('chatForm'), input = $('chatInput'), envia = $('chatSend');
    var chips = $('chatChips'), status = $('chatStatus');
    var hist = carregar();
    var ocupado = false;

    function bolha(html, quem, bruto){
      var d = document.createElement('div');
      d.className = 'cmsg ' + quem;
      d.innerHTML = html;
      if(bruto){
        var cp = document.createElement('button');
        cp.type = 'button'; cp.className = 'msg-copy'; cp.textContent = '📋 Copiar';
        cp.setAttribute('aria-label', 'Copiar resposta');
        cp.addEventListener('click', function(){ if(window.copyText) window.copyText(bruto, cp); });
        d.appendChild(cp);
      }
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      return d;
    }

    function mostrarChips(lista){
      chips.innerHTML = '';
      (lista || []).filter(Boolean).slice(0, 4).forEach(function(s){
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = s;
        b.addEventListener('click', function(){ enviar(s); });
        chips.appendChild(b);
      });
    }

    function crescer(){
      input.style.height = 'auto';
      input.style.height = Math.min(120, input.scrollHeight) + 'px';
    }

    function ocupar(sim){
      ocupado = !!sim;
      if(envia) envia.disabled = ocupado;
      if(input) input.disabled = ocupado;
      if(status) status.textContent = ocupado ? 'IA digitando uma resposta…' : 'IA do Laboratório · responde na hora';
    }

    // Restaura a conversa salva (ou a saudação)
    if(hist.length){
      hist.forEach(function(m){
        if(m && m.role === 'user') bolha(esc(m.content), 'eu');
        else if(m) bolha(formatar(m.content), 'bot', m.content);
      });
    } else {
      bolha(OLA, 'bot');
    }
    mostrarChips(SUGESTOES);

    function enviar(texto){
      texto = String(texto || '').trim();
      if(!texto || ocupado) return;
      bolha(esc(texto), 'eu');
      hist.push({ role:'user', content: texto });
      hist = hist.slice(-MAX_HIST);
      input.value = ''; crescer();
      mostrarChips([]);

      var aguarde = bolha('<span class="typing" aria-label="digitando"><i></i><i></i><i></i></span>', 'bot');
      ocupar(true);

      var a = IA();
      if(!a){
        aguarde.className = 'cmsg bot erro';
        aguarde.innerHTML = '⚠️ O chat ainda está carregando. Tente de novo em 1 segundo.';
        ocupar(false);
        mostrarChips(SUGESTOES);
        return;
      }

      var ctx = (document.title || '') + ' | ' + (location.pathname.split('/').pop() || '');
      a.chamar('tutor-chat', { mensagem: texto, historico: hist.slice(-10), contexto: ctx }, 60000).then(function(d){
        var resp = (d && d.resposta) ? String(d.resposta) : 'Não recebi resposta. Pode reformular a pergunta?';
        aguarde.innerHTML = formatar(resp);
        hist.push({ role:'assistant', content: resp });
        hist = hist.slice(-MAX_HIST);
        salvar(hist);
        // botão copiar na resposta recém-chegada
        var cp = document.createElement('button');
        cp.type = 'button'; cp.className = 'msg-copy'; cp.textContent = '📋 Copiar';
        cp.setAttribute('aria-label', 'Copiar resposta');
        cp.addEventListener('click', function(){ if(window.copyText) window.copyText(resp, cp); });
        aguarde.appendChild(cp);
        mostrarChips(d && d.sugestoes && d.sugestoes.length ? d.sugestoes : SUGESTOES);
        ocupar(false);
      }).catch(function(err){
        aguarde.className = 'cmsg bot erro';
        aguarde.innerHTML = '⚠️ ' + esc((err && err.message) || 'Assistente indisponível.') +
          ' <button type="button" class="msg-copy">Tentar de novo</button>';
        var rb = aguarde.querySelector('.msg-copy');
        if(rb) rb.addEventListener('click', function(){
          if(aguarde.parentNode) aguarde.parentNode.removeChild(aguarde);
          if(hist.length && hist[hist.length - 1].role === 'user') hist.pop();
          enviar(texto);
        });
        mostrarChips(SUGESTOES);
        ocupar(false);
      });
      msgs.scrollTop = msgs.scrollHeight;
    }

    // ---- Ligações ----
    form.addEventListener('submit', function(e){ e.preventDefault(); enviar(input.value); });
    input.addEventListener('input', crescer);
    input.addEventListener('keydown', function(e){
      if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); enviar(input.value); }
    });

    var btLimpar = $('chatClear');
    if(btLimpar) btLimpar.addEventListener('click', function(){
      if(!confirm('Apagar esta conversa?')) return;
      hist = [];
      salvar(hist);
      msgs.innerHTML = '';
      bolha(OLA, 'bot');
      mostrarChips(SUGESTOES);
      input.focus();
    });

    // Perguntas prontas da lateral
    var boxIdeias = $('chatIdeas');
    if(boxIdeias){
      IDEIAS.forEach(function(g){
        var wrap = document.createElement('div');
        var cat = document.createElement('span');
        cat.className = 'idea-cat'; cat.textContent = g.cat;
        wrap.appendChild(cat);
        g.itens.forEach(function(t){
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'idea'; b.textContent = t;
          b.addEventListener('click', function(){
            enviar(t);
            var alvo = document.querySelector('.chat-main');
            if(alvo) alvo.scrollIntoView({ behavior:'smooth', block:'start' });
          });
          wrap.appendChild(b);
        });
        boxIdeias.appendChild(wrap);
      });
    }

    crescer();
    setTimeout(function(){ input.focus(); }, 80);
  }

  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', montar); }
  else { montar(); }
})();

