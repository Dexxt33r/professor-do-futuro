/* ============================================================
   PROFESSOR DO FUTURO - present.js
   Motor da apresentação:
   - Uma BIBLIOTECA de temas (o curso + decks de estratégias)
   - Dentro de cada tema, grade de slides + player em tela cheia
   ============================================================ */
(function(){
  'use strict';

  var state = { view:'library', deckKey:null, idx:0, filter:[], viewerOpen:false, modOverride:null };
  var els = {};

  function esc(s){
    if(typeof s !== 'string') s = String(s==null?'':s);
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function findDeck(id){ return (window.DECKS||[]).filter(function(d){ return d.id===id; })[0] || null; }
  function currentSlides(){
    var d = state.deckKey ? findDeck(state.deckKey) : null;
    return d ? d.slides : window.SLIDES;
  }
  function modOf(s){ return state.deckKey ? state.deckKey : (s.mod||'intro'); }
  function labelFor(s){ var m=window.MODULES[modOf(s)]; return m? m.label : 'SLIDE'; }
  function nameFor(s){ var m=window.MODULES[modOf(s)]; return m? m.name : ''; }
  function typeLabel(t){
    return { list:'• Lista', prompt:'💬 Prompt', table:'◫ Tabela', checklist:'✓ Checklist', section:'✦ Abertura', text:'• Texto', leitura:'📖 Leitura' }[t] || '•';
  }

  /* Lista de temas exibidos na biblioteca (curso na frente + decks) */
  function buildLibrary(){
    var base = [{ key:'curso', color:'dark', icon:'🎓', slides:null,
      title:'Apresentação do curso', tag:'Curso completo',
      desc:'Todo o conteúdo do Professor do Futuro em ' + window.SLIDES.length + ' slides: slides com IA, inclusão, ética e gestão de sala.' }];
    (window.DECKS||[]).forEach(function(d){ base.push({ key:d.id, color:d.color, icon:d.icon, slides:d.slides, title:d.title, tag:d.tag||'Gestão', desc:d.desc||'' }); });
    return base;
  }

  function toggleToolbar(mode){
    // 'lib' = biblioteca | 'mods' = tela inicial de módulos | 'slides' = grade de slides
    if(els.search)    els.search.style.display   = mode==='slides' ? 'block' : 'none';
    if(els.searchWrap)els.searchWrap.style.display= mode==='slides' ? 'flex' : 'none';
    if(els.btnBack)   els.btnBack.style.display = mode==='lib' ? 'none' : 'inline-flex';
    if(els.modSelectWrapper) els.modSelectWrapper.style.display = mode==='slides' ? 'block' : 'none';
  }

  function init(){
    els.search    = document.getElementById('presSearch');
    els.modSelect = document.getElementById('presMod');
    els.grid      = document.getElementById('deckGrid');
    els.head      = document.getElementById('presHead');
    els.stage     = document.getElementById('presStage');
    els.viewer    = document.getElementById('viewer');
    els.board     = document.getElementById('board');
    els.fill      = document.getElementById('progFill');
    els.vtProgress= document.getElementById('vtProgress');
    els.vtTitle   = document.getElementById('vtTitle');
    els.btnClose  = document.getElementById('btnClose');
    els.btnBack   = document.getElementById('btnBack');
    els.searchWrap= document.getElementById('searchWrap');
    els.modSelectWrapper = document.getElementById('presModWrap');
    els.presCount = document.getElementById('presCount');
    if(!els.grid) return;

    els.modSelect.addEventListener('change', function(){ state.modOverride=null; applyFilters(); });
    els.search.addEventListener('input', applyFilters);
    els.btnClose.addEventListener('click', closeViewer);
    if(els.btnBack) els.btnBack.addEventListener('click', openLibrary);
    document.getElementById('navLeft').addEventListener('click', function(){ go(state.idx-1); });
    document.getElementById('navRight').addEventListener('click', function(){ go(state.idx+1); });

    els.grid.addEventListener('click', function(e){
      var card = e.target.closest('.deck-card');
      if(!card) return;
      var k;
      if((k = card.getAttribute('data-key'))){ openTheme(k); }
      else if((k = card.getAttribute('data-mod'))){ chooseModule(k); }
      else { openViewer(parseInt(card.getAttribute('data-i'),10)); }
    });

    // Enter ou Espaço também abrem o card selecionado (acessibilidade)
    els.grid.addEventListener('keydown', function(e){
      if(e.key!=='Enter' && e.key!==' ') return;
      var card = e.target.closest('.deck-card');
      if(!card) return;
      e.preventDefault();
      card.click();
    });

    document.addEventListener('keydown', function(e){
      if(!state.viewerOpen) return;
      if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){ e.preventDefault(); go(state.idx+1); }
      else if(e.key==='ArrowLeft'||e.key==='PageUp'){ e.preventDefault(); go(state.idx-1); }
      else if(e.key==='Home'){ e.preventDefault(); go(0); }
      else if(e.key==='End'){ e.preventDefault(); go(state.filter.length-1); }
      else if(e.key==='Escape'){ closeViewer(); }
      else if(e.key==='f'||e.key==='F'){ toggleFull(); }
    });

    openLibrary();
  }

  /* BIBLIOTECA */
  function openLibrary(){
    state.view='library'; state.deckKey=null; state.viewerOpen=false;
    if(els.viewer) els.viewer.classList.remove('open');
    document.body.style.overflow='';
    renderLibrary();
  }
  function renderLibrary(){
    var lib = buildLibrary();
    if(els.presCount) els.presCount.textContent = lib.length + ' temas';
    els.head.innerHTML = '<div class="lib-head">' +
      '<div>' +
        '<h2 style="color:var(--indigo-900);margin-bottom:.4rem">🎞️ Biblioteca de apresentações</h2>' +
        '<p style="margin-bottom:.6rem;color:var(--text-muted);line-height:1.6">Escolha um tema para abrir os slides. O <b>curso</b> tem os '+ window.SLIDES.length +' slides completos; os <b>temas adicionais</b> são coleções rápidas sobre gestão e sala de aula (clique num card para ver os slides deste tema) — ou crie a sua com o botão <b>✨ Gerar com IA</b>. Navegue com as setas <kbd>←</kbd> <kbd>→</kbd> e use <kbd>F</kbd> para tela cheia.</p>' +
      '</div>' +
      '<div class="lib-img"><img src="img/cat-biblioteca.svg" alt="Ilustração de projeção de slides em sala" width="400" height="300"></div>' +
    '</div>';
    els.grid.innerHTML = lib.map(function(d){
      var col = window.DECK_COLOR[d.color] || 'dc-dark';
      var n = d.slides ? d.slides.length : window.SLIDES.length;
      return '<article class="deck-card" data-key="'+ (d.key==='curso'?'curso':d.key) +'" tabindex="0" role="button" aria-label="' + esc(d.title) + '">' +
        '<div class="dc-top '+col+'">' +
          '<span class="dc-num">'+ n +' slides</span>' +
          '<span class="dc-big">'+(d.icon||'✦')+'</span>' +
          '<h3>' + esc(d.title) + '</h3>' +
        '</div>' +
        '<div class="dc-body">' +
          '<p>' + esc(d.desc||'') + '</p>' +
          '<div class="dc-meta"><span class="dc-type">'+ esc(d.tag||'Tema') +'</span><span>▶ Abrir</span></div>' +
        '</div>' +
      '</article>';
    }).join('');
    toggleToolbar('lib');
  }

  function openTheme(key){
    state.deckKey = (key==='curso') ? null : key;
    state.viewerOpen=false;
    if(els.search) els.search.value='';
    if(!state.deckKey){
      renderModuleStart();
    } else {
      state.view='deck';
      if(els.modSelect) els.modSelect.value='all';
      applyFilters();
      toggleToolbar('slides');
    }
  }

  /* ---------- TELA INICIAL DE MODULOS (curso) ---------- */
  var MOD_START = {
    intro:{ icon:'🎬', color:'dark',  desc:'Boas-vindas, o que você vai aprender e como aproveitar a formação.' },
    '1':  { icon:'🎨', color:'blue',  desc:'Crie apresentações completas em minutos com Gamma, Canva, Google Slides/Gemini e ChatGPT.' },
    '2':  { icon:'♿', color:'pink',   desc:'Adapte qualquer material para TEA, TDAH e inclusão real com CAA e Easy Read.' },
    '3':  { icon:'🤖', color:'green', desc:'IA como tutora de estudos, ética escolar e avaliações à prova de colagem.' },
    '4':  { icon:'🎯', color:'amber', desc:'Dinâmicas, storytelling, combinados e estratégias para turmas difíceis.' },
    fim:  { icon:'🏁', color:'dark',  desc:'Checklist final, próximos passos e onde continuar evoluindo.' }
  };

  function renderModuleStart(){
    state.view='modules';
    var total = window.SLIDES.length;
    if(els.presCount) els.presCount.textContent = total+' slides em 6 módulos';
    els.head.innerHTML =
      '<button class="btn btn-ghost" id="backLib" style="margin-bottom:.8rem;padding:.5rem 1rem;font-size:.88rem">← Biblioteca</button>' +
      '<div class="mods-start-head"><h2>🎓 Apresentação do curso</h2>' +
        '<p>Escolha um <b>módulo de início</b> para ver os slides — ideal para revisar um assunto específico — ou assista <b>tudo do início ao fim</b>. Dentro da apresentação, navegue com <kbd>←</kbd> <kbd>→</kbd>, tela cheia com <kbd>F</kbd> e saia com <kbd>Esc</kbd>.</p></div>';
    var bl=document.getElementById('backLib');
    if(bl) bl.addEventListener('click', openLibrary);

    function card(cls,top,body,attrs){
      return '<article class="deck-card '+cls+'"'+(attrs||'')+' tabindex="0" role="button" aria-label="'+esc(top.title)+'">' +
        '<div class="dc-top '+(window.DECK_COLOR[top.color]||'dc-dark')+'">' +
          '<span class="dc-num">'+ top.num +'</span><span class="dc-big">'+ top.big +'</span>' +
          '<h3>'+ esc(top.title) +'</h3></div>' +
        '<div class="dc-body"><p>'+ esc(body) +'</p>' +
          '<div class="dc-meta"><span class="dc-type">'+ top.tag +'</span><span>▶ Abrir</span></div></div></article>';
    }

    var g = card('mods-all', { color:'dark', big:'▶', title:'Assistir do início ao fim',
                 num: total+' slides', tag:'Apresentação completa' },
      'Todos os módulos em sequência: introdução, os 6 módulos do conteúdo e encerramento.', ' data-mod="all"');

    Object.keys(MOD_START).forEach(function(mk){
      var d = MOD_START[mk], m = window.MODULES[mk];
      var n = window.SLIDES.filter(function(sl){ return sl.mod===mk; }).length;
      g += card('', { color:d.color, big:d.icon, title:m.name,
                      num:n+' slides', tag:m.label }, d.desc, ' data-mod="'+mk+'"');
    });

    g += '<p class="mods-note">💡 Dica: ao abrir os slides, dá para filtrar por módulo também com a caixa "Todos os módulos" acima.</p>';
    els.grid.innerHTML = g;
    toggleToolbar('mods');
  }

  function chooseModule(mod){
    state.view='deck';
    state.modOverride = (mod==='all') ? null : mod;
    if(els.modSelect) els.modSelect.value = state.modOverride || 'all';
    applyFilters();
    toggleToolbar('slides');
  }

  /* FILTROS E GRADE DE SLIDES dentro do tema aberto */
  function applyFilters(){
    var q = (els.search? els.search.value : '').trim().toLowerCase();
    var m = state.modOverride || (els.modSelect ? els.modSelect.value : 'all');
    var list = currentSlides().filter(function(s){
      if(m!=='all' && String(modOf(s))!==m) return false;
      if(!q) return true;
      var hay = s.title + ' ' + (Array.isArray(s.body)? s.body.join(' ')
            : (s.body && Array.isArray(s.body.rows) ? '' : (s.body||'')));
      return hay.toLowerCase().indexOf(q) !== -1;
    });
    state.filter = list;
    renderGrid(list);
  }

  function activeInfo(){
    if(state.view!=='deck') return { icon:'🎓', title:'Apresentação do curso' };
    var d = state.deckKey ? findDeck(state.deckKey) : null;
    return { icon:(d? d.icon : '🎓'), title:(d? d.title : 'Apresentação do curso') };
  }

  function renderGrid(list){
    var info = activeInfo();
    var total = list.length;
    if(els.presCount) els.presCount.textContent = total + ' slides';
    var backLbl = state.deckKey ? '← Biblioteca' : '← Módulos';
    els.head.innerHTML =
      '<button class="btn btn-ghost" id="backInline" style="margin-bottom:.8rem;padding:.5rem 1rem;font-size:.88rem">'+backLbl+'</button>' +
      '<h2 style="color:var(--indigo-900);margin-bottom:1.3rem">'+ info.icon +' '+ esc(info.title) +' <span style="color:var(--text-muted);font-size:.9rem;font-weight:400">(<span>'+ total +'</span> slides — clique num card para apresentar)</span></h2>';
    var back = document.getElementById('backInline');
    if(back) back.addEventListener('click', function(){
      if(state.deckKey) openLibrary(); else renderModuleStart();
    });

    var g = '';
    list.forEach(function(s, i){
      var col = window.DECK_COLOR[s.color] || 'dc-dark';
      var preview = Array.isArray(s.body) ? s.body[0] : s.body;
      if(typeof preview !== 'string') preview = '';
      g += '<article class="deck-card" data-i="'+i+'" tabindex="0" role="button" aria-label="'+esc(s.title)+'">' +
        '<div class="dc-top '+col+'">' +
          '<span class="dc-num">' + labelFor(s) + '</span>' +
          '<h3>' + esc(s.title) + '</h3>' +
          '<span class="dc-big">' + esc(s.title.charAt(0)||'✦') + '</span>' +
        '</div>' +
        '<div class="dc-body">' +
          '<p>' + esc(preview.substring(0,120)) + '</p>' +
          '<div class="dc-meta"><span class="dc-type">' + typeLabel(s.type) + '</span><span>' + esc(nameFor(s)) + '</span></div>' +
        '</div>' +
      '</article>';
    });
    if(!list.length){
      g = '<p style="grid-column:1/-1;color:var(--text-muted);padding:2rem 0;text-align:center">Nenhum slide encontrado 🔍</p>';
    }
    els.grid.innerHTML = g;
  }

  /* VIEWER (player) */
  function openViewer(i){
    if(!state.filter.length) return;
    state.idx = Math.max(0, Math.min(i, state.filter.length-1));
    state.viewerOpen = true;
    if(!els.viewer) return;
    els.viewer.classList.add('open');
    document.body.style.overflow='hidden';
    if(els.stage) els.stage.classList.add('player-active');
    renderSlide();
    animateIn();
  }
  function closeViewer(){
    state.viewerOpen = false;
    if(!els.viewer) return;
    els.viewer.classList.remove('open');
    document.body.style.overflow='';
    if(els.stage) els.stage.classList.remove('player-active');
    if(els.board) els.board.classList.remove('show');
  }
  function go(n){
    if(!state.viewerOpen || !state.filter.length) return;
    if(n < 0 || n >= state.filter.length) return;
    state.idx = n;
    renderSlide();
    animateIn();
  }
  function animateIn(){
    if(!els.board) return;
    els.board.classList.remove('show');
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ els.board.classList.add('show'); }); });
  }
  function renderSlide(){
    var s = state.filter[state.idx];
    var pos = state.filter;
    var total = pos.length;
    if(els.vtProgress) els.vtProgress.textContent = (state.idx+1) + ' / ' + total;
    if(els.vtTitle) els.vtTitle.textContent = nameFor(s);
    if(els.fill) els.fill.style.width = (((state.idx+1)/total)*100) + '%';

    var mName = window.MODULES[modOf(s)];
    var pillCls = mName ? mName.pill : 'pill-blue';
    var strip = '<div class="strip" style="background:' + (window.STRIP[s.color]||window.STRIP.blue) + '"></div>';
    var body = buildBody(s);
    els.board.innerHTML = strip +
      '<div class="board-content">' +
        '<span class="big-num">' + labelFor(s) + '</span>' +
        '<div class="board-meta">' +
          '<span class="pill ' + pillCls + '">' + nameFor(s) + '</span>' +
          (s.type==='prompt' ? '<span class="pill pill-blue">💬 Prompt para copiar</span>' : '') +
          (s.type==='checklist' ? '<span class="pill pill-green">✓ Checklist</span>' : '') +
          (s.type==='leitura' ? '<span class="pill pill-amber">📖 Para ler e estudar</span>' : '') +
        '</div>' +
        '<h2>' + esc(s.title) + '</h2>' +
        '<div class="board-body tv">' + body + '</div>' +
      '</div>';
  }
  function buildBody(s){
    if(s.type==='section'){
      return '<div style="font-size:clamp(1.3rem,3vw,2rem);color:var(--indigo-700);font-weight:600;">' + esc(s.body) + '</div>';
    }
    if(s.type==='prompt'){
      return '<div class="prompt-hl">' + esc(s.body) + '</div>';
    }
    if(s.type==='table'){
      var t = s.body, html = '<table><thead><tr>';
      t.head.forEach(function(h){ html += '<th>'+esc(h)+'</th>'; });
      html += '</tr></thead><tbody>';
      t.rows.forEach(function(r){
        html += '<tr>'; r.forEach(function(c){ html += '<td>'+esc(c)+'</td>'; }); html += '</tr>';
      });
      html += '</tbody></table>';
      return html;
    }
    if(s.type==='checklist'){
      return '<ul>' + s.body.map(function(it){ return '<li><b>☐</b>&nbsp;&nbsp;'+esc(it)+'</li>'; }).join('') + '</ul>';
    }
if(s.type==='leitura'){
      var L = s.body, h = '';
      if(L.intro) h += '<p class="leitura-intro">'+esc(L.intro)+'</p>';
      if(L.pontos && L.pontos.length){
        h += '<div class="leitura-lead">Para ler e estudar:</div><ul>';
        L.pontos.forEach(function(p){ h += '<li>'+esc(p)+'</li>'; });
        h += '</ul>';
      }
      if(L.dica) h += '<div class="leitura-dica">💡 <b>Para aplicar na sala:</b> '+esc(L.dica)+'</div>';
      return h;
    }
    return '<ul>' + s.body.map(function(it){ return '<li>'+esc(it)+'</li>'; }).join('') + '</ul>';
  }
  function toggleFull(){
    if(!document.fullscreenElement){ document.documentElement.requestFullscreen().catch(function(){}); }
    else { document.exitFullscreen(); }
  }

  // API pública — usada por slides-ia.js (apresentações geradas por IA)
  window.Present = {
    openLibrary: openLibrary,
    openTheme: openTheme,
    refreshLibrary: function(){ if(state.view==='library') renderLibrary(); },
    addDeck: function(deck){
      if(!deck || !deck.id) return;
      window.DECKS = window.DECKS || [];
      var i = -1;
      window.DECKS.forEach(function(d, k){ if(d.id === deck.id) i = k; });
      if(i >= 0){ window.DECKS[i] = deck; } else { window.DECKS.push(deck); }
      window.MODULES[deck.id] = { label: deck.label || 'IA', name: deck.title, pill: deck.pill || 'pill-green' };
      if(state.view === 'library') renderLibrary();
    },
    removeDeck: function(id){
      window.DECKS = (window.DECKS || []).filter(function(d){ return d.id !== id; });
      if(state.deckKey === id) openLibrary();
      else if(state.view === 'library') renderLibrary();
    },
    currentSlide: function(){ return state.viewerOpen ? state.filter[state.idx] : null; },
    isViewerOpen: function(){ return state.viewerOpen; }
  };

  document.addEventListener('DOMContentLoaded', init);
})();
