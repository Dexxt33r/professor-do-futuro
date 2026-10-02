/* ============================================================
   IA NA BIBLIOTECA DE SLIDES — slides-ia.js
   ------------------------------------------------------------
   Gera apresentações completas com IA a partir de um tema,
   salva no navegador ("Minhas apresentações com IA") e abre no
   MESMO player da biblioteca. Adiciona também um botão para
   pedir ao Tutor uma explicação do slide que está na tela.
   Requer: js/ia.js (LabIA), js/present.js (Present), js/tutor.js (Tutor).
   ============================================================ */
(function(){
  'use strict';
  // Apresentações geradas por IA ficam SOMENTE no navegador deste professor
  // (localStorage) — nunca entram na biblioteca compartilhada do site.
  // Limite de gerações guardadas: para criar uma nova, é preciso apagar uma.
  var KEY = 'pdf.slides.ia';
  var LIMITE = 5;

  function IA(){ return window.LabIA || null; }
  function $(id){ return document.getElementById(id); }
  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  /* ---------- armazenamento ---------- */
  function carregar(){
    try{ var v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; }
    catch(e){ return []; }
  }
  function salvarTodos(arr){
    try{ localStorage.setItem(KEY, JSON.stringify(arr.slice(-LIMITE))); }catch(e){}
  }
  function registrar(deck){
    if(!deck || !deck.id) return;
    window.DECKS = window.DECKS || [];
    var i = -1;
    window.DECKS.forEach(function(d, k){ if(d.id === deck.id) i = k; });
    if(i >= 0){ window.DECKS[i] = deck; } else { window.DECKS.push(deck); }
    window.MODULES = window.MODULES || {};
    window.MODULES[deck.id] = { label:'IA', name:deck.titulo, pill:(deck.pill || 'pill-green') };
  }

  // Restaura as apresentações salvas ANTES de o present.js montar a biblioteca.
  // Se houver mais que o limite (versões antigas guardavam até 12), mantém só as 5 mais recentes.
  var iniciais = carregar();
  if(iniciais.length > LIMITE){ salvarTodos(iniciais); iniciais = carregar(); }
  iniciais.forEach(registrar);

  /* ---------- estilos ---------- */
  function montarEstilos(){
    if($('iaSlidesCss')) return;
    var css = document.createElement('style');
    css.id = 'iaSlidesCss';
    css.textContent = [
      '.ia-btn{border:none;cursor:pointer;font-weight:700;white-space:nowrap;color:#fff;border-radius:999px;',
      'padding:.7rem 1.15rem;font-size:.9rem;font-family:inherit;background:var(--grad,linear-gradient(135deg,#0d3a23,#0f9d72 55%,#c9971c));',
      'box-shadow:0 8px 20px rgba(201,151,28,.35);transition:.2s;}',
      '.ia-btn:hover{transform:translateY(-2px);box-shadow:0 12px 26px rgba(201,151,28,.45);}',
      '.ia-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;}',
      '.iam-overlay{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:1rem;',
      'background:rgba(6,20,13,.55);backdrop-filter:blur(3px);}',
      '.iam-overlay.open{display:flex;}',
      '.iam-card{width:min(40rem,100%);max-height:92vh;overflow:auto;background:var(--card,#fff);color:var(--text,#0f2a1e);',
      'border:1px solid var(--border,#e6efdc);border-radius:20px;box-shadow:var(--shadow-lg,0 24px 60px rgba(0,0,0,.35));',
      'font-family:var(--ff,"Segoe UI",system-ui,sans-serif);}',
      '.iam-head{display:flex;align-items:center;gap:.6rem;padding:1rem 1.2rem;color:#fff;',
      'background:var(--grad,linear-gradient(135deg,#0d3a23,#0f9d72 55%,#c9971c));}',
      '.iam-head h3{font-size:1.1rem;} .iam-head small{display:block;opacity:.9;font-size:.76rem;font-weight:400;}',
      '.iam-head button{margin-left:auto;border:none;background:rgba(255,255,255,.18);color:#fff;width:2rem;height:2rem;',
      'border-radius:50%;cursor:pointer;font-size:.95rem;}',
      '.iam-head button:hover{background:rgba(255,255,255,.34);}',
      '.iam-body{padding:1.1rem 1.2rem 1.3rem;}',
      '.iam-field{margin-bottom:.85rem;}',
      '.iam-field label{display:block;font-size:.82rem;font-weight:700;color:var(--heading);margin-bottom:.3rem;}',
      '.iam-field input,.iam-field select,.iam-field textarea{width:100%;padding:.6rem .75rem;border-radius:12px;',
      'border:1px solid var(--border);background:var(--bg);color:var(--text);font-family:inherit;font-size:.92rem;}',
      '.iam-field textarea{resize:vertical;min-height:3.4rem;}',
      '.iam-field input:focus,.iam-field select:focus,.iam-field textarea:focus{outline:2px solid var(--violet-600,#8a6a10);outline-offset:1px;}',
      '.iam-row{display:grid;grid-template-columns:1fr 1fr;gap:.8rem;}',
      '.iam-hint{font-size:.78rem;color:var(--text-muted);margin:-.2rem 0 .8rem;}',
      '.iam-actions{display:flex;gap:.6rem;align-items:center;flex-wrap:wrap;margin-top:.4rem;}',
      '.iam-ghost{border:2px solid var(--violet-600,#8a6a10);background:transparent;color:var(--violet-600,#8a6a10);',
      'border-radius:999px;padding:.6rem 1.1rem;font-weight:700;cursor:pointer;font-family:inherit;font-size:.9rem;}',
      '.iam-status{font-size:.85rem;color:var(--text-muted);min-height:1.3em;flex:1;min-width:12rem;}',
      '.iam-saved{margin-top:1rem;border-top:1px solid var(--border);padding-top:.9rem;}',
      '.iam-saved h4{font-size:.86rem;color:var(--heading);margin-bottom:.5rem;display:flex;align-items:center;gap:.45rem;flex-wrap:wrap;}',
      '.iam-count{font-weight:600;font-size:.74rem;color:var(--text-muted);border:1px solid var(--border);',
      'border-radius:999px;padding:.1rem .55rem;}',
      '.iam-count.full{color:#b91c1c;border-color:rgba(220,38,38,.5);}',
      '.iam-item{display:flex;align-items:center;gap:.55rem;padding:.5rem .6rem;border:1px solid var(--border);',
      'border-radius:12px;margin-bottom:.45rem;background:var(--bg-soft);}',
      '.iam-item b{flex:1;font-size:.86rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
      '.iam-item span{font-size:.74rem;color:var(--text-muted);white-space:nowrap;}',
      '.iam-icon{border:none;background:transparent;cursor:pointer;font-size:1rem;line-height:1;padding:.15rem .3rem;}',
      '.iam-del{display:inline-flex;align-items:center;gap:.25rem;border:1px solid rgba(220,38,38,.45);background:transparent;',
      'color:#b91c1c;cursor:pointer;font-family:inherit;font-size:.75rem;font-weight:700;border-radius:999px;padding:.2rem .6rem;}',
      '.iam-del:hover{background:rgba(220,38,38,.1);}',
      'html[data-theme="dark"] .iam-del{color:#fca5a5;border-color:rgba(252,165,165,.5);}',
      '.iam-limit{display:none;font-size:.8rem;color:#b91c1c;margin-top:.5rem;line-height:1.45;}',
      '.iam-limit.show{display:block;}',
      'html[data-theme="dark"] .iam-limit{color:#fca5a5;}',
      '@media(max-width:560px){.iam-row{grid-template-columns:1fr;}}'
    ].join('');
    document.head.appendChild(css);
  }

  /* ---------- modal ---------- */
  var ERRO = '#b91c1c';
  function montarModal(){
    if($('iaSlideModal')) return;
    var ov = document.createElement('div');
    ov.id = 'iaSlideModal';
    ov.className = 'iam-overlay';
    ov.innerHTML =
      '<div class="iam-card" role="dialog" aria-label="Gerar apresentação com IA">' +
        '<div class="iam-head">' +
          '<span aria-hidden="true" style="font-size:1.3rem">✨</span>' +
          '<div><h3>Gerar apresentação com IA</h3><small>Slides prontos sobre qualquer tema, na altura da sua turma</small></div>' +
          '<button type="button" id="iamClose" aria-label="Fechar">✕</button>' +
        '</div>' +
        '<div class="iam-body">' +
          '<div class="iam-field"><label for="iamTema">Tema da apresentação *</label>' +
            '<input id="iamTema" type="text" maxlength="120" placeholder="Ex.: Frações, Revolução Francesa, Fotossíntese…"></div>' +
          '<div class="iam-row">' +
            '<div class="iam-field"><label for="iamSeg">Série / segmento</label>' +
              '<select id="iamSeg">' +
                '<option value="infantil">Educação Infantil</option>' +
                '<option value="fund1">Anos Iniciais (1º–5º)</option>' +
                '<option value="fund2" selected>Anos Finais (6º–9º)</option>' +
                '<option value="medio">Ensino Médio</option>' +
              '</select></div>' +
            '<div class="iam-field"><label for="iamNum">Quantidade de slides</label>' +
              '<select id="iamNum"><option>6</option><option selected>8</option><option>10</option><option>12</option><option>15</option></select></div>' +
          '</div>' +
          '<div class="iam-field"><label for="iamFoco">Foco extra</label>' +
            '<select id="iamFoco">' +
              '<option value="nenhum">Nenhum</option>' +
              '<option value="inclusao">Inclusão (AEE / língua fácil)</option>' +
              '<option value="engajamento">Engajamento da turma</option>' +
              '<option value="avaliacao">Avaliação e checklist</option>' +
            '</select></div>' +
          '<div class="iam-field"><label for="iamObs">Observações (opcional)</label>' +
            '<textarea id="iamObs" maxlength="300" placeholder="Ex.: turma agitada, focar em exemplos do cotidiano, incluir 1 dinâmica em grupo…"></textarea></div>' +
          '<p class="iam-hint">A IA pode errar fatos e datas. Revise antes de projetar. Nada de dados pessoais de alunos.</p>' +
          '<div class="iam-actions">' +
            '<button type="button" class="ia-btn" id="iamGo">✨ Gerar apresentação</button>' +
            '<button type="button" class="iam-ghost" id="iamCancel">Cancelar</button>' +
            '<span class="iam-status" id="iamStatus"></span>' +
          '</div>' +
          '<div class="iam-saved">' +
            '<h4>📁 Minhas apresentações com IA <span class="iam-count" id="iamCount"></span></h4>' +
            '<p class="iam-hint" style="margin:0 0 .6rem">🔒 Ficam só neste navegador (só você vê). Limite de ' + LIMITE + ' apresentações.</p>' +
            '<div id="iamSaved"></div>' +
            '<p class="iam-limit" id="iamLimit"></p>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);

    $('iamClose').addEventListener('click', fechar);
    $('iamCancel').addEventListener('click', fechar);
    ov.addEventListener('click', function(e){ if(e.target === ov) fechar(); });
    $('iamGo').addEventListener('click', gerar);
    $('iamTema').addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); gerar(); } });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && ov.classList.contains('open')) fechar(); });
  }

  function abrir(){
    montarModal();
    renderSalvos();
    status('');
    $('iaSlideModal').classList.add('open');
    setTimeout(function(){ var t = $('iamTema'); if(t) t.focus(); }, 50);
  }
  function fechar(){ var ov = $('iaSlideModal'); if(ov) ov.classList.remove('open'); }
  function status(msg, cor){ var s = $('iamStatus'); if(s){ s.textContent = msg || ''; s.style.color = cor || ''; } }

  function renderSalvos(){
    var box = $('iamSaved'); if(!box) return;
    var arr = carregar();
    var cnt = $('iamCount');
    if(cnt){
      cnt.textContent = arr.length + '/' + LIMITE;
      cnt.className = 'iam-count' + (arr.length >= LIMITE ? ' full' : '');
    }
    if(!arr.length){
      box.innerHTML = '<span class="iam-hint">Nenhuma ainda. Gere a primeira acima 👆</span>';
      atualizarLimite(0);
      return;
    }
    box.innerHTML = arr.slice().reverse().map(function(d){
      var n = (d.slides || []).length;
      return '<div class="iam-item" data-id="' + esc(d.id) + '">' +
        '<b title="' + esc(d.titulo) + '">' + esc(d.titulo) + '</b>' +
        '<span>' + n + ' slides</span>' +
        '<button type="button" class="iam-open iam-icon" title="Abrir" aria-label="Abrir apresentação">▶</button>' +
        '<button type="button" class="iam-del" title="Apagar esta apresentação" aria-label="Apagar apresentação">🗑 Apagar</button>' +
      '</div>';
    }).join('');
    Array.prototype.forEach.call(box.querySelectorAll('.iam-item'), function(row){
      var id = row.getAttribute('data-id');
      var op = row.querySelector('.iam-open'), dl = row.querySelector('.iam-del');
      if(op) op.addEventListener('click', function(){ fechar(); if(window.Present) window.Present.openTheme(id); });
      if(dl) dl.addEventListener('click', function(){ remover(id); });
    });
    atualizarLimite(arr.length);
  }

  // Trava a geração quando o professor chegou ao limite: precisa apagar uma.
  function atualizarLimite(total){
    var aviso = $('iamLimit'), btn = $('iamGo');
    var cheio = total >= LIMITE;
    if(aviso){
      aviso.className = 'iam-limit' + (cheio ? ' show' : '');
      aviso.innerHTML = cheio
        ? '⚠️ Limite de ' + LIMITE + ' apresentações atingido. <b>Apague uma</b> na lista acima (🗑 Apagar) para poder gerar outra.'
        : '';
    }
    if(btn){
      btn.disabled = cheio;
      btn.title = cheio ? 'Apague uma apresentação para gerar outra' : '';
    }
  }

  function remover(id){
    var arr = carregar();
    var alvo = arr.filter(function(d){ return d.id === id; })[0];
    var titulo = (alvo && alvo.titulo) ? alvo.titulo : 'esta apresentação';
    if(!confirm('Apagar "' + titulo + '"? Isso libera espaço para gerar outra.')) return;
    salvarTodos(arr.filter(function(d){ return d.id !== id; }));
    if(window.Present) window.Present.removeDeck(id);
    renderSalvos();
  }

  /* ---------- gerar ---------- */
  function gerar(){
    var temaEl = $('iamTema');
    var tema = (temaEl && temaEl.value || '').trim();
    if(tema.length < 3){ status('Escreva o tema da apresentação.', ERRO); if(temaEl) temaEl.focus(); return; }
    // Limite de gerações: precisa apagar uma antiga para criar outra.
    if(carregar().length >= LIMITE){
      status('Limite de ' + LIMITE + ' apresentações atingido. Apague uma na lista abaixo (🗑 Apagar) para gerar outra.', ERRO);
      atualizarLimite(LIMITE);
      return;
    }
    var a = IA();
    if(!a){ status('A IA ainda está carregando. Tente de novo em 1 segundo.'); return; }
    var corpo = {
      tema: tema,
      segmento: $('iamSeg').value,
      nSlides: parseInt($('iamNum').value, 10) || 8,
      foco: $('iamFoco').value,
      observacoes: ($('iamObs') && $('iamObs').value || '').trim()
    };
    var btn = $('iamGo'), old = btn.textContent;
    btn.disabled = true; btn.textContent = '⏳ Criando os slides…';
    status('A IA está escrevendo a apresentação… 10 a 40 segundos.', '');
    a.chamar('gerar-slides', corpo, 120000).then(function(d){
      btn.disabled = false; btn.textContent = old;
      var deck = montarDeck(d && d.deck ? d.deck : {}, tema);
      var arr = carregar().filter(function(x){ return x.id !== deck.id; });
      arr.push(deck);
      salvarTodos(arr);
      registrar(deck);
      if(window.Present){ window.Present.addDeck(deck); window.Present.openTheme(deck.id); }
      fechar();
    }).catch(function(err){
      btn.disabled = false; btn.textContent = old;
      status('⚠️ ' + ((err && err.message) || 'IA indisponível.'), ERRO);
    });
  }

  function montarDeck(d, tema){
    var slides = (Array.isArray(d.slides) ? d.slides : []).map(function(s){
      return { type: s.type || 'list', color: 'green', title: s.title || 'Slide', body: s.body };
    });
    return {
      id: 'ia-' + Date.now(),
      label: 'IA',
      icon: '✨',
      color: 'green',
      pill: 'pill-green',
      title: (d.titulo || ('Apresentação — ' + tema)).slice(0, 80),
      tag: 'Gerada por IA',
      desc: d.subtitulo || ('Gerada por IA sobre ' + tema + '. Revise antes de aplicar.'),
      criadoEm: Date.now(),
      slides: slides
    };
  }

  /* ---------- botões ---------- */
  function montarBotao(){
    var bar = document.querySelector('.pres-toolbar .container');
    if(!bar || $('iaGerarBtn')) return;
    var b = document.createElement('button');
    b.id = 'iaGerarBtn'; b.type = 'button'; b.className = 'ia-btn';
    b.innerHTML = '✨ Gerar com IA';
    b.setAttribute('aria-label', 'Gerar uma apresentação com IA');
    b.addEventListener('click', abrir);
    bar.appendChild(b);
  }

  function montarBotaoSlide(){
    var acoes = document.querySelector('.viewer-actions');
    if(!acoes || $('iaSlideAsk')) return;
    var b = document.createElement('button');
    b.id = 'iaSlideAsk'; b.className = 'vbtn'; b.type = 'button';
    b.title = 'Pedir ao Tutor para explicar este slide';
    b.setAttribute('aria-label', 'Explicar este slide com IA');
    b.textContent = '✨';
    b.addEventListener('click', function(){
      var s = (window.Present && window.Present.currentSlide) ? window.Present.currentSlide() : null;
      var txt = s
        ? ('Explique de forma simples e me dê 1 ideia de como ensinar o slide "' + s.title + '".')
        : 'Me explique este conteúdo, por favor.';
      if(window.Tutor && window.Tutor.perguntar) window.Tutor.perguntar(txt);
      else alert('O Tutor ainda está carregando. Tente de novo em 1 segundo.');
    });
    acoes.insertBefore(b, acoes.firstChild);
  }

  function iniciar(){
    montarEstilos();
    montarBotao();
    montarModal();
    montarBotaoSlide();
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', iniciar); }
  else { iniciar(); }
})();

