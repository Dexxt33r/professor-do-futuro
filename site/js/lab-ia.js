/* ETAPA 3 · Opção B — liga cada ferramenta à sua Edge Function.
   Requer js/ia.js (window.LabIA) carregado antes. */
(function(){
  'use strict';
  function $(id){ return document.getElementById(id); }

  function IA(){ return (typeof window !== 'undefined') ? window.LabIA : null; }
  function esc(s){
    var a = IA();
    if(a && a.esc) return a.esc(s);
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function st(id, msg, tipo){ var a = IA(); if(a) a.status(id, msg, tipo); }
  function busy(btn, txt){
    if(!btn) return function(){};
    var old = btn.textContent;
    btn.disabled = true;
    if(txt) btn.textContent = txt;
    return function(){ btn.disabled = false; btn.textContent = old; };
  }

  /* ---------- PLANO COM IA (gerar-plano; offline = original) ---------- */
  function ligarPlano(){
    var form = $('planoForm');
    if(!form || form.__iaLigado) return;
    form.__iaLigado = true;
    form.addEventListener('submit', function(e){
      var usaIA = $('p-ia') ? $('p-ia').checked : true;
      if(!usaIA) return; // handler offline original gera
      if(typeof navigator !== 'undefined' && navigator.onLine === false){
        st('pStatus', 'Sem internet: gerando no modo offline…', 'aviso');
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      var tema = ($('p-tema').value || '').trim();
      if(!tema){ st('pStatus', 'Escreva o tema da aula.', 'erro'); $('p-tema').focus(); return; }
      var corpo = {
        tema: tema,
        segmento: $('p-segmento').value,
        duracao: $('p-duracao').selectedOptions
          ? $('p-duracao').selectedOptions[0].textContent : $('p-duracao').value,
        nSlides: parseInt($('p-slides').value, 10) || 10,
        foco: $('p-foco').value,
        observacoes: ($('p-obs').value || '').trim()
      };
      var done = busy($('pGerar'), '⏳ Escrevendo com IA…');
      st('pStatus', 'A IA está escrevendo o plano… 10 a 40 segundos.', 'info');
      IA().chamar('gerar-plano', corpo).then(function(d){
        done();
        var p = d.plano || {};
        var h = '<h3>📋 ' + esc(p.titulo || ('Plano — ' + tema)) + '</h3>';
        h += '<p style="color:var(--text-muted);font-size:.85rem">✨ Escrito pela IA (' + esc(d.provedor || 'grátis') + ') — revise antes de aplicar.</p>';
        if(p.objetivo) h += '<div class="bloco"><b>Objetivo:</b> ' + esc(p.objetivo) + '</div>';
        if((p.blocos || []).length) h += '<h3>⏱️ Atividades</h3><ul>' + p.blocos.map(function(b){ return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>';
        if((p.slides || []).length) h += '<h3>🎨 Slides</h3><ul>' + p.slides.map(function(s){ return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
        if((p.quiz || []).length) h += '<h3>🧠 Quiz</h3><ul>' + p.quiz.map(function(s){ return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
        if(p.inclusao) h += '<h3>♿ Inclusão</h3><div class="bloco">' + esc(p.inclusao) + '</div>';
        $('planoOut').innerHTML = h;
        $('planoOut').classList.add('show');
        var cp = $('pCopy'); if(cp) cp.disabled = false;
        var pr = $('pPrint'); if(pr) pr.disabled = false;
        st('pStatus', 'Plano pronto com IA. Confira e clique em Copiar/Imprimir.', 'ok');
      }).catch(function(err){
        done();
        st('pStatus', 'IA indisponível (' + err.message + '). Gerando offline…', 'aviso');
        var cb = $('p-ia'); if(cb) cb.checked = false;
        if(form.requestSubmit) form.requestSubmit(); else form.submit();
        if(cb) cb.checked = true;
      });
    }, true);
  }

  /* ---------- QUIZ COM IA (gerar-quiz) ---------- */
  function ligarQuiz(){
    var btn = $('qGerarIA');
    if(!btn || btn.__iaLigado) return;
    btn.__iaLigado = true;
    btn.addEventListener('click', function(){
      var tema = ($('p-tema') && $('p-tema').value.trim()) || '';
      if(tema.length < 3){ st('qStatus', 'Informe o tema no campo "Tema da aula" (plano) primeiro.', 'erro'); return; }
      var done = busy(btn, '⏳ Gerando…');
      st('qStatus', 'A IA está criando 5 perguntas sobre "' + tema + '"…', 'info');
      IA().chamar('gerar-quiz', { tema: tema, quantidade: 5 }).then(function(d){
        done();
        document.dispatchEvent(new CustomEvent('lab-quiz-ia', { detail: d.quiz || [] }));
        st('qStatus', 'Quiz pronto com IA (' + (d.provedor || 'grátis') + '). Revise e clique em Iniciar.', 'ok');
      }).catch(function(err){
        done();
        st('qStatus', 'IA indisponível: ' + err.message, 'erro');
      });
    });
  }
  /* ---------- RUBRICA COM IA (gerar-rubrica) ---------- */
  function ligarRubrica(){
    var btn = $('rubGerar');
    if(!btn || btn.__iaLigado) return;
    btn.__iaLigado = true;
    btn.addEventListener('click', function(){
      var tipo = $('rubTipo') ? $('rubTipo').selectedOptions[0].textContent : 'atividade';
      var etapa = $('rubEtapa') ? $('rubEtapa').selectedOptions[0].textContent : '';
      var tarefa = ($('rubTarefa') && $('rubTarefa').value.trim()) || '';
      var done = busy(btn, '⏳ Escrevendo…');
      st('rubStatus', 'A IA está montando a rubrica…', 'info');
      IA().chamar('gerar-rubrica', { tipo: tipo, etapa: etapa, tarefa: tarefa }).then(function(d){
        done();
        var r = d.rubrica || {};
        var h = '<h3>📝 ' + esc(r.titulo || 'Rubrica') + '</h3>';
        h += '<p style="color:var(--text-muted);font-size:.85rem">✨ Gerada pela IA — ajuste à sua turma.</p>';
        (r.criterios || []).forEach(function(c){
          h += '<div class="bloco" style="text-align:left"><b>' + esc(c.nome) + '</b><ol>';
          (c.niveis || []).forEach(function(nv){ h += '<li>' + esc(nv) + '</li>'; });
          h += '</ol></div>';
        });
        $('rubOut').innerHTML = h;
        st('rubStatus', 'Rubrica pronta com IA.', 'ok');
      }).catch(function(err){
        done();
        st('rubStatus', 'IA indisponível: ' + err.message, 'erro');
      });
    });
  }
  /* ---------- SIMPLIFICADOR COM IA ---------- */
  function ligarSimp(){
    var btn = $('simpBtn');
    if(!btn || btn.__iaLigado) return;
    btn.__iaLigado = true;
    btn.addEventListener('click', function(e){
      var txt = (($('simpIn') && $('simpIn').value) || '').trim();
      if(!txt) return;
      if(typeof navigator !== 'undefined' && navigator.onLine === false) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      var done = busy(btn, '⏳ Simplificando…');
      st('simpStatus', 'A IA está reescrevendo em língua fácil…', 'info');
      IA().chamar('simplificar-texto', { texto: txt }).then(function(d){
        done();
        var h = '<h3>✅ Versão em língua fácil (IA)</h3><ol style="line-height:1.9">';
        (d.frases || []).forEach(function(f){ h += '<li>' + esc(f) + '</li>'; });
        h += '</ol>';
        if((d.trocas || []).length){
          h += '<p style="color:var(--text-muted);font-size:.85rem"><b>Trocas:</b> ' + esc(d.trocas.join(' · ')) + '</p>';
        }
        $('simpOut').innerHTML = h;
        var cp = $('simpCopy'); if(cp) cp.disabled = false;
        st('simpStatus', 'Texto simplificado com IA. Revise antes de entregar.', 'ok');
      }).catch(function(err){
        done();
        st('simpStatus', 'IA indisponível (' + err.message + ').', 'aviso');
      });
    }, true);
  }

  /* ---------- REDAÇÃO COM IA (apoio; oficial = banca) ---------- */
  function ligarEnem(){
    var btn = $('enemIA');
    if(!btn || btn.__iaLigado) return;
    btn.__iaLigado = true;
    btn.addEventListener('click', function(){
      var tema = ($('enemTema') && $('enemTema').value.trim()) || '';
      var texto = ($('enemTexto') && $('enemTexto').value.trim()) || '';
      if(tema.length < 3){ st('enemStatus', 'Informe o tema da redação.', 'erro'); return; }
      if(texto.length < 100){ st('enemStatus', 'Cole a redação (mínimo 100 letras).', 'erro'); return; }
      var done = busy(btn, '⏳ Corrigindo…');
      st('enemStatus', 'A IA está corrigindo pelas 5 competências…', 'info');
      IA().chamar('corrigir-redacao', { tema: tema, texto: texto }).then(function(d){
        done();
        var c = d.correcao || {};
        var n = c.notas || {};
        var h = '<div class="enem-out-card"><div class="enem-top"><div class="enem-score">';
        h += '<div class="enem-num">' + (c.total || 0) + '<small>/1000</small></div>';
        h += '<div class="enem-pct">Apoio por IA (' + esc(d.provedor || 'grátis') + ') — oficial é a banca.</div>';
        h += '</div></div><table class="enem-table"><tbody>';
        ['c1','c2','c3','c4','c5'].forEach(function(k, i){
          h += '<tr><td>C' + (i+1) + '</td><td>' + (n[k] || 0) + '</td></tr>';
        });
        h += '</tbody></table>';
        if((c.comentarios || []).length) h += '<ul>' + c.comentarios.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
        h += '</div>';
        $('enemOut').innerHTML = h;
        st('enemStatus', 'Correção de apoio pronta.', 'ok');
      }).catch(function(err){
        done();
        st('enemStatus', 'IA indisponível: ' + err.message, 'erro');
      });
    });
  }

  document.addEventListener('lab-quiz-ia', function(e){
    try{
      var quiz = (e.detail || []).map(function(q){
        return { texto: q.pergunta, alts: q.alternativas, certa: q.correta, bonus: false };
      });
      localStorage.setItem('pdf.lab.quiz', JSON.stringify(quiz));
      location.hash = '#quiz';
      location.reload();
    }catch(err){}
  });

  function iniciar(){
    if(!IA()){ setTimeout(iniciar, 300); return; }
    ligarPlano();
    ligarQuiz();
    ligarRubrica();
    ligarSimp();
    ligarEnem();
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();


