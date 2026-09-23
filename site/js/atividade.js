/* ============================================================
   PROFESSOR DO FUTURO — js/atividade.js
   ------------------------------------------------------------
   "Gerar Atividade Pronta": formulário → IA (grátis, via Edge
   Function) → FOLHA A4 pronta para imprimir/salvar em PDF.

   Dois modos, sempre com a MESMA folha de saída:
   • COM IA  → chama a Edge Function gerar-atividade (Supabase,
               que guarda a chave gratuita no servidor).
   • OFFLINE → sem internet ou sem chave configurada, a folha é
               montada aqui no navegador com o roteiro de estudo
               e o caça-palavras (funciona 100% offline).

   Usado no fim de ferramentas.html. Requer:
   #gerarForm, #gerarSaida, #folhaOverlay, #folhaPainel.
   ============================================================ */
(function(){
  'use strict';

  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  /* Endpoint da IA (mesmo projeto Supabase do login do curso).
     Função (e não constante) de propósito: atividade.js carrega ANTES de
     supabase.js no ferramentas.html, então ler window.SUPABASE_CONFIG só
     na hora de chamar garante usar a URL configurada. */
  function urlIA(){
    var c = (typeof window !== 'undefined') ? window.SUPABASE_CONFIG : null;
    var base = (c && c.url) ? c.url : 'https://ngkkhpvganrfctvyyvle.supabase.co';
    return String(base).replace(/\/+$/, '') + '/functions/v1/gerar-atividade';
  }

  var LINHA_ESCRITA = '____________________________________________________________';

  /* ---------- opções dos selects (mesmas do back-end) ---------- */
  var ANOS = [
    'Educação Infantil (4 e 5 anos)',
    '1º ano do Ensino Fundamental', '2º ano do Ensino Fundamental',
    '3º ano do Ensino Fundamental', '4º ano do Ensino Fundamental',
    '5º ano do Ensino Fundamental', '6º ano do Ensino Fundamental',
    '7º ano do Ensino Fundamental', '8º ano do Ensino Fundamental',
    '9º ano do Ensino Fundamental',
    '1º ano do Ensino Médio', '2º ano do Ensino Médio', '3º ano do Ensino Médio',
    'Educação de Jovens e Adultos (EJA)'
  ];

  var DISCIPLINAS = [
    'Língua Portuguesa', 'Matemática', 'Ciências', 'História', 'Geografia',
    'Biologia', 'Física', 'Química', 'Arte', 'Educação Física', 'Inglês',
    'Ensino Religioso', 'Filosofia', 'Sociologia', 'Educação Financeira',
    'Projeto de Vida', 'Interdisciplinar'
  ];

  var TIPOS = [
    { v:'multipla',        n:'Múltipla escolha' },
    { v:'dissertativa',    n:'Questões dissertativas' },
    { v:'caca_palavras',   n:'Caça-palavras' },
    { v:'texto_perguntas', n:'Texto explicativo com perguntas' },
    { v:'mista',           n:'Mista (múltipla escolha + dissertativa + desafio)' }
  ];

  /* ---------- pictogramas (imagens em emoji: imprimem sem internet) ---------- */
  var PICTOS = {
    ler:['📖','👀','📚','🔎'],
    escrever:['✍️','📝','🖊️'],
    conversar:['🗣️','💬','🤝'],
    pensar:['🧠','💡','🤔'],
    calcular:['🔢','➗','📐'],
    natureza:['🌱','🌎','💧','☀️'],
    historia:['🏛️','📜','⏳'],
    arte:['🎨','🎵','🎭'],
    fim:['🏁','⭐','🎯']
  };

  function pictoDe(tema){
    var t = String(tema||'').toLowerCase();
    if(/fotoss|planta|água|ciclo|clima|animais|ecossistema|natureza|meio ambiente|celula/.test(t)) return PICTOS.natureza;
    if(/revolu|histór|guerra|império|colônia|escrav|independ|idade média|egito|roma/.test(t)) return PICTOS.historia;
    if(/arte|música|teatro|dança|desenho|pintura/.test(t)) return PICTOS.arte;
    if(/fraç|número|equação|geometr|conta|porcentagem|gráfico|álgebra|probabilidade/.test(t)) return PICTOS.calcular;
    return PICTOS.pensar;
  }

  /* ---------- utilidades de texto ---------- */
  function limpar(v, max){
    return String(v==null?'':v).replace(/\s+/g,' ').trim().slice(0, max || 400);
  }
  function semAcento(s){
    var t = String(s==null?'':s);
    if(t.normalize){ t = t.normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
    return t;
  }
  function maiuscula(s){ return semAcento(s).toUpperCase(); }
  function clamp(n, min, max){ n = Math.round(Number(n)); if(!isFinite(n)) n = min; return Math.min(max, Math.max(min, n)); }

  function listaStrings(v, max){
    if(!v) return [];
    var arr = Array.isArray(v) ? v : String(v).split(/[\n,;]+/);
    var out = [];
    for(var i=0;i<arr.length;i++){
      var s = limpar(arr[i], 200);
      if(s) out.push(s);
      if(out.length >= max) break;
    }
    return out;
  }

  /* ============================================================
     CAÇA-PALAVRAS — gerado localmente (determinístico pelo tema)
     ============================================================ */
  function hashTexto(s){
    var h = 2166136261;
    for(var i=0;i<s.length;i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function sorteador(seed){
    var a = seed >>> 0;
    return function(){
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var DIRECOES = [
    { dl:0,  dc:1,  sim:'→' }, { dl:1,  dc:0,  sim:'↓' },
    { dl:1,  dc:1,  sim:'↘' }, { dl:1,  dc:-1, sim:'↙' }
  ];

  // palavras: array de strings · retorna { grade, largura, colocadas, naoColocadas }
  function gerarCacaPalavras(palavras, tamanhoMini){
    var limpas = [], vistos = {};
    listaStrings(palavras, 14).forEach(function(p){
      var w = maiuscula(p).replace(/[^A-Z]/g,'');
      if(w.length < 3 || w.length > 12) return;
      if(vistos[w]) return;
      vistos[w] = 1;
      limpas.push(w);
    });
    var rnd = sorteador(hashTexto(limpas.join('|') || 'tema'));
    var maior = 0;
    limpas.forEach(function(w){ if(w.length > maior) maior = w.length; });
    var n = clamp(Math.max(tamanhoMini || 12, maior + 2), 8, 18);

    var grade = [];
    for(var i=0;i<n;i++){
      grade.push([]);
      for(var j=0;j<n;j++) grade[i].push('');
    }

    var colocadas = [], naoColocadas = [];
    limpas.forEach(function(w){
      var ok = false;
      for(var tent=0; tent<300 && !ok; tent++){
        var dir = DIRECOES[Math.floor(rnd() * DIRECOES.length)];
        var l = Math.floor(rnd() * n), c = Math.floor(rnd() * n);
        var fimL = l + dir.dl * (w.length - 1), fimC = c + dir.dc * (w.length - 1);
        if(fimL < 0 || fimL >= n || fimC < 0 || fimC >= n) continue;
        var cabe = true;
        for(var k=0;k<w.length;k++){
          var cel = grade[l + dir.dl*k][c + dir.dc*k];
          if(cel && cel !== w.charAt(k)){ cabe = false; break; }
        }
        if(!cabe) continue;
        for(var k2=0;k2<w.length;k2++) grade[l + dir.dl*k2][c + dir.dc*k2] = w.charAt(k2);
        colocadas.push({ palavra:w, linha:l + 1, coluna:c + 1, direcao:dir.sim });
        ok = true;
      }
      if(!ok) naoColocadas.push(w);
    });

    var alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for(var a=0;a<n;a++){
      for(var b=0;b<n;b++){
        if(!grade[a][b]) grade[a][b] = alfabeto.charAt(Math.floor(rnd() * alfabeto.length));
      }
    }
    return { grade:grade, largura:n, colocadas:colocadas, naoColocadas:naoColocadas };
  }

  // Lista de palavras para o caça-palavras a partir do tema (modo offline)
  var PALAVRAS_GENERICAS = ['ESTUDO','PESQUISA','EXEMPLO','REVISAO','DUVIDA','HIPOTESE','CONCLUSAO','REGISTRO'];
  function palavrasDoTema(tema, extras){
    var out = [], vistos = {};
    (extras || []).concat(String(tema||'').split(/[^A-Za-zÀ-ÿ0-9]+/)).forEach(function(p){
      var w = maiuscula(p).replace(/[^A-Z]/g,'');
      if(w.length < 4 || w.length > 12 || vistos[w]) return;
      vistos[w] = 1;
      out.push(w);
    });
    PALAVRAS_GENERICAS.forEach(function(w){
      if(out.length < 8 && !vistos[w]){ vistos[w] = 1; out.push(w); }
    });
    return out.slice(0, 10);
  }

  /* ============================================================
     MODO OFFLINE — folha estruturada, sem IA (funciona sempre)
     ============================================================ */
  var ROTEIRO = [
    { e:'Explique com suas palavras o que é {T}. Depois, dê um exemplo que você já viu na sua vida.', l:4, p:'💡' },
    { e:'Cite dois pontos importantes de {T} e diga por que cada um deles importa.', l:4, p:'⭐' },
    { e:'Descreva uma situação do seu dia em que {T} aparece (pode ser um desenho com legenda).', l:5, p:'🎨' },
    { e:'Se você fosse ensinar {T} para um colega mais novo, o que diria primeiro? Escreva em 2 frases.', l:3, p:'🗣️' },
    { e:'Complete: "Antes de estudar {T}, eu pensava que ______. Agora eu entendo que ______."', l:3, p:'✍️' },
    { e:'Liste três palavras-chave de {T} e explique o significado de uma delas.', l:4, p:'🔑' },
    { e:'Resuma {T} em uma frase de até 15 palavras.', l:2, p:'📌' },
    { e:'Compare {T} com algo que você já conhece bem. O que é parecido e o que é diferente?', l:4, p:'⚖️' },
    { e:'Qual parte de {T} você achou mais difícil? O que você faria para entender melhor?', l:4, p:'🤔' },
    { e:'Escreva uma pergunta sobre {T} que você gostaria de fazer ao professor.', l:3, p:'❓' }
  ];

  function fallbackLocal(pedido){
    var tema = limpar(pedido.tema, 160);
    var quant = clamp(pedido.quantidade, 3, 20, 8);
    var palavras = palavrasDoTema(tema);

    var questoes = [];
    for(var i=0;i<quant;i++){
      var t = ROTEIRO[i % ROTEIRO.length];
      questoes.push({
        numero: i + 1,
        enunciado: t.e.replace(/\{T\}/g, tema),
        tipo: 'dissertativa',
        alternativas: [],
        correta: null,
        resposta_esperada: 'Resposta pessoal. Valide se o aluno usou o vocabulário do tema e deu um exemplo próprio.',
        linhas_resposta: pedido.adaptaVisual ? t.l + 1 : t.l,
        dica: '',
        pictograma: t.p
      });
    }

    var caca = null;
    if(pedido.tipo === 'caca_palavras'){
      caca = {
        palavras: palavras,
        instrucao: 'Encontre as palavras da lista no diagrama e circule cada uma. Depois, escolha duas delas e escreva com suas palavras o que significam.'
      };
    }

    var gabarito = questoes.map(function(q){
      return { numero:q.numero, resposta:q.resposta_esperada, comentario:'Corrija pela coerência e pelo uso do vocabulário do tema, não pela resposta "certa".' };
    });

    return {
      titulo: 'Atividade de ' + (pedido.disciplina || 'Interdisciplinar') + ': ' + tema,
      objetivo: 'Compreender e aplicar "' + tema + '" em situações do cotidiano, registrando o que já sabe e o que precisa revisar.',
      habilidade: '',
      tempo_min: 50,
      texto_apoio: null,
      instrucoes: [
        'Leia o roteiro abaixo e faça uma questão por vez.',
        'Responda com suas próprias palavras, nas linhas indicadas.',
        'Use o vocabulário do tema: ' + palavras.slice(0, 5).join(', ') + '.',
        'Confira suas respostas antes de entregar.'
      ],
      palavras_chave: palavras,
      questoes: questoes,
      caca_palavras: caca,
      adaptacoes: pedido.adaptaTdahTea
        ? ['Uma instrução por vez, com pictograma em cada questão.', 'Espaço de escrita ampliado e comandos curtos (uma frase).', 'Sequência fixa: ler → responder → revisar.']
        : ['Comandos curtos e previsíveis.'],
      acessibilidade: [
        'Imprimir em folha A4, fonte grande (14 ou mais) e alto contraste.',
        'Ler o enunciado em voz alta antes de responder.',
        'Permitir resposta oral ou desenho no lugar da escrita, se necessário.',
        'Conceder tempo extra, se o aluno precisar.'
      ],
      gabarito: gabarito,
      observacoes: [
        'Esta folha foi montada no MODO OFFLINE (sem IA): o roteiro e o caça-palavras são gerados pelo próprio Laboratório.',
        'Para o texto explicativo e as questões escritas pela IA, configure uma chave gratuita (Gemini, Groq ou OpenRouter) — veja site/backend/README.md.'
      ],
      revisao: 'Folha estruturada gerada no navegador, sem IA. Ajuste o conteúdo ao planejamento da sua aula.'
    };
  }

  /* ============================================================
     FOLHA A4 — o "sistema de formatação/PDF"
     ============================================================ */

  // Negrito do tipo **palavra** (a IA é instruída a usá-lo nos comandos)
  function rico(s){ return esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'); }

  function linhasResposta(n, adapt){
    n = clamp(n, 0, 10, 0);
    if(!n) return '';
    var h = '';
    for(var i=0;i<n;i++) h += '<span class="fl"></span>';
    return '<div class="q-linhas' + (adapt ? ' amplo' : '') + '">' + h + '</div>';
  }

  function dataHoje(){
    var d = new Date();
    function dd(v){ return (v < 10 ? '0' : '') + v; }
    return dd(d.getDate()) + '/' + dd(d.getMonth() + 1) + '/' + d.getFullYear();
  }

  function cabecalhoFolha(atividade, pedido, meta){
    var h = '<header class="folha-head">';
    h += '<div class="fh-top"><span class="fh-marca">🎓 Professor do Futuro · Laboratório</span>';
    h += '<span class="fh-fonte">' + esc(meta.rotuloFonte) + '</span></div>';
    h += '<h1>' + rico(atividade.titulo) + '</h1>';
    h += '<p class="fh-meta"><b>' + esc(pedido.disciplina) + '</b> · ' + esc(pedido.ano) +
         ' · <b>Tema:</b> ' + esc(pedido.tema) + ' · ⏱️ ' + esc(atividade.tempo_min) + ' min</p>';
    if(atividade.habilidade){
      h += '<p class="fh-hab"><b>Habilidade trabalhada:</b> ' + rico(atividade.habilidade) + '</p>';
    }
    h += '<ul class="fh-campos">' +
      '<li>Escola: <span class="fl"></span></li>' +
      '<li>Professor(a): <span class="fl"></span></li>' +
      '<li>Aluno(a): <span class="fl"></span></li>' +
      '<li class="curto">Data: <span class="fl"></span></li>' +
      '<li class="curto">Nota: <span class="fl"></span></li>' +
      '</ul>';
    h += '</header>';
    return h;
  }

  function blocoObjetivo(atividade){
    var h = '<section class="folha-sec">';
    h += '<h2>🎯 O que você vai aprender</h2>';
    h += '<p>' + rico(atividade.objetivo) + '</p>';
    return h + '</section>';
  }

  function blocoInstrucoes(atividade, pedido){
    var inst = listaStrings(atividade.instrucoes, 6);
    if(!inst.length) return '';
    var h = '<section class="folha-sec folha-instr">';
    h += '<h2>' + (pedido.adaptaTdahTea ? '👉 Faça passo a passo' : '📋 Como fazer') + '</h2><ol>';
    inst.forEach(function(p){ h += '<li>' + rico(p) + '</li>'; });
    return h + '</ol></section>';
  }

  function blocoTextoApoio(atividade, pedido){
    var ta = atividade.texto_apoio;
    if(!ta || !ta.paragrafos || !ta.paragrafos.length) return '';
    var h = '<section class="folha-sec folha-texto' + (pedido.adaptaVisual ? ' amplo' : '') + '">';
    h += '<h2>' + esc(pictoDe(pedido.tema)[0]) + ' ' + esc(ta.titulo) + '</h2>';
    ta.paragrafos.forEach(function(p){ h += '<p>' + rico(p) + '</p>'; });
    return h + '</section>';
  }

  function blocoQuestoes(atividade, pedido){
    var qs = atividade.questoes || [];
    if(!qs.length) return '';
    var h = '<section class="folha-sec">';
    h += '<h2>✏️ Agora é com você</h2><div class="folha-questoes">';
    qs.forEach(function(q){
      var pic = pedido.adaptaVisual ? (q.pictograma || '✍️') : (q.pictograma || '');
      h += '<article class="q-bloco">';
      h += '<div class="q-cab"><span class="q-num">' + esc(q.numero) + '</span>' +
           (pic ? '<span class="q-pic" aria-hidden="true">' + esc(pic) + '</span>' : '') +
           '<span class="q-tipo">' + (q.tipo === 'multipla_escolha' ? 'Marque uma alternativa' :
             q.tipo === 'completar' ? 'Complete' : q.tipo === 'ligar' ? 'Ligue' : 'Escreva') + '</span></div>';
      h += '<p class="q-enun">' + rico(q.enunciado) + '</p>';
      if(q.alternativas && q.alternativas.length){
        h += '<ul class="q-alts">';
        q.alternativas.forEach(function(a, i){
          h += '<li><span class="q-letra">' + String.fromCharCode(65 + i) + '</span><span class="q-txt">' + rico(a) + '</span></li>';
        });
        h += '</ul>';
      }
      if(q.dica) h += '<p class="q-dica">💡 <b>Dica:</b> ' + rico(q.dica) + '</p>';
      h += linhasResposta(q.linhas_resposta, pedido.adaptaVisual);
      h += '</article>';
    });
    return h + '</div></section>';
  }

  function blocoCaca(atividade, pedido){
    var cp = atividade.caca_palavras;
    if(!cp || !cp.palavras || !cp.palavras.length) return '';
    var jogo = gerarCacaPalavras(cp.palavras, 12);
    var h = '<section class="folha-sec folha-caca">';
    h += '<h2>🔍 Caça-palavras</h2>';
    h += '<p>' + rico(cp.instrucao || 'Encontre as palavras no diagrama.') + '</p>';
    h += '<div class="caca-wrap">';
    h += '<table class="caca-grade" role="img" aria-label="Diagrama de caça-palavras">';
    for(var i=0;i<jogo.grade.length;i++){
      h += '<tr>';
      for(var j=0;j<jogo.grade[i].length;j++) h += '<td>' + esc(jogo.grade[i][j]) + '</td>';
      h += '</tr>';
    }
    h += '</table>';
    h += '<div class="caca-lado"><p class="caca-titulo">Palavras:</p><ul class="caca-lista">';
    cp.palavras.forEach(function(p){ h += '<li>' + esc(maiuscula(p)) + '</li>'; });
    h += '</ul>';
    if(jogo.naoColocadas.length){
      h += '<p class="caca-obs">Não coube no diagrama: ' + esc(jogo.naoColocadas.join(', ')) + ' (use na conversa com a turma).</p>';
    }
    h += '</div></div>';
    h += '<p class="caca-gab"><b>Gabarito do diagrama (professor):</b> ';
    h += jogo.colocadas.map(function(c){ return esc(c.palavra) + ' (' + c.direcao + ' L' + c.linha + ' C' + c.coluna + ')'; }).join(' · ');
    h += '</p>';
    return h + '</section>';
  }

  function rodapeFolha(atividade, meta){
    return '<footer class="folha-foot"><span>' + esc(atividade.revisao) + '</span>' +
      '<span>' + esc(meta.rotuloFonte) + ' · gerado em ' + esc(dataHoje()) + '</span></footer>';
  }

  function folhaProfessor(atividade, pedido, meta){
    var h = '<section class="folha folha-prof">';
    h += '<header class="folha-head prof">';
    h += '<div class="fh-top"><span class="fh-marca">🔑 Professor(a) — não entregar ao aluno</span>' +
         '<span class="fh-fonte">' + esc(meta.rotuloFonte) + '</span></div>';
    h += '<h1>Gabarito e orientações</h1>';
    h += '<p class="fh-meta">' + esc(pedido.disciplina) + ' · ' + esc(pedido.ano) +
         ' · <b>Tema:</b> ' + esc(pedido.tema) + ' · ⏱️ ' + esc(atividade.tempo_min) + ' min</p>';
    h += '</header>';

    h += '<section class="folha-sec"><h2>✅ Gabarito</h2><table class="gab-tabela"><tbody>';
    (atividade.gabarito || []).forEach(function(g){
      h += '<tr><td class="g-num">' + esc(g.numero) + '</td><td><b>' + rico(g.resposta) + '</b>' +
           (g.comentario ? '<br><span class="g-obs">' + rico(g.comentario) + '</span>' : '') + '</td></tr>';
    });
    h += '</tbody></table></section>';

    if((atividade.adaptacoes || []).length){
      h += '<section class="folha-sec"><h2>♿ Adaptações aplicadas nesta folha</h2><ul class="lista-sec">';
      atividade.adaptacoes.forEach(function(a){ h += '<li>' + rico(a) + '</li>'; });
      h += '</ul></section>';
    }
    if((atividade.acessibilidade || []).length){
      h += '<section class="folha-sec"><h2>🖨️ Acessibilidade na impressão e no uso</h2><ul class="lista-sec">';
      atividade.acessibilidade.forEach(function(a){ h += '<li>' + rico(a) + '</li>'; });
      h += '</ul></section>';
    }
    if((atividade.observacoes || []).length){
      h += '<section class="folha-sec"><h2>📝 Observações</h2><ul class="lista-sec">';
      atividade.observacoes.forEach(function(a){ h += '<li>' + rico(a) + '</li>'; });
      h += '</ul></section>';
    }
    h += '<section class="folha-sec"><h2>🎯 Critérios de correção sugeridos</h2><ul class="lista-sec">' +
      '<li>Respondeu ao comando da questão (não fugiu do tema).</li>' +
      '<li>Usou o vocabulário do tema' + (atividade.palavras_chave && atividade.palavras_chave.length ? ' (' + esc(atividade.palavras_chave.slice(0,6).join(', ')) + ')' : '') + '.</li>' +
      '<li>Deu exemplo próprio ou aplicou em situação do cotidiano.</li>' +
      '<li>Revisou ortografia e organização antes de entregar.</li>' +
      '</ul></section>';
    h += rodapeFolha(atividade, meta);
    return h + '</section>';
  }

  function montarFolhas(atividade, pedido, meta){
    meta = meta || {};
    if(!meta.rotuloFonte){
      meta.rotuloFonte = (meta.fonte === 'ia')
        ? ('✨ Gerado com IA gratuita' + (meta.provedor ? ' · ' + meta.provedor : ''))
        : '🧩 Modo offline (sem IA)';
    }
    var adapt = (pedido.adaptaVisual || pedido.adaptaTdahTea);
    var h = '<section class="folha folha-aluno' + (adapt ? ' folha-adapt' : '') + '">';
    h += cabecalhoFolha(atividade, pedido, meta);
    h += blocoObjetivo(atividade, pedido);
    h += blocoInstrucoes(atividade, pedido);
    h += blocoTextoApoio(atividade, pedido);
    h += blocoQuestoes(atividade, pedido);
    h += blocoCaca(atividade, pedido);
    h += rodapeFolha(atividade, meta);
    h += '</section>';
    if(pedido.incluirGabarito) h += folhaProfessor(atividade, pedido, meta);
    return h;
  }

  /* ---------- versão em texto (copiar/colar em Word ou Drive) ---------- */
  function montarTexto(atividade, pedido){
    var L = [];
    L.push(atividade.titulo);
    L.push(pedido.disciplina + ' · ' + pedido.ano + ' · Tema: ' + pedido.tema + ' · ' + atividade.tempo_min + ' min');
    L.push('Aluno(a): ____________________________________  Data: ____/____/______');
    L.push('');
    L.push('OBJETIVO: ' + atividade.objetivo);
    if(atividade.habilidade) L.push('HABILIDADE: ' + atividade.habilidade);
    L.push('');
    L.push('COMO FAZER:');
    (atividade.instrucoes || []).forEach(function(p, i){ L.push((i+1) + '. ' + p); });
    if(atividade.texto_apoio){
      L.push('');
      L.push('LEIA: ' + atividade.texto_apoio.titulo);
      atividade.texto_apoio.paragrafos.forEach(function(p){ L.push(p); });
    }
    L.push('');
    L.push('QUESTÕES:');
    (atividade.questoes || []).forEach(function(q){
      L.push(q.numero + ') ' + q.enunciado);
      (q.alternativas || []).forEach(function(a, i){ L.push('   ' + String.fromCharCode(65 + i) + ') ' + a); });
      if(q.linhas_resposta){
        for(var i=0;i<q.linhas_resposta;i++) L.push('   ' + LINHA_ESCRITA);
      }
      L.push('');
    });
    if(atividade.caca_palavras && atividade.caca_palavras.palavras.length){
      L.push('CAÇA-PALAVRAS — palavras: ' + atividade.caca_palavras.palavras.join(', '));
      L.push('(imprima esta folha para o diagrama sair formatado)');
      L.push('');
    }
    if(pedido.incluirGabarito){
      L.push('--- GABARITO (professor) ---');
      (atividade.gabarito || []).forEach(function(g){ L.push(g.numero + ') ' + g.resposta + (g.comentario ? ' | ' + g.comentario : '')); });
      L.push('');
      if((atividade.adaptacoes || []).length) L.push('ADAPTAÇÕES: ' + atividade.adaptacoes.join(' · '));
    }
    L.push('');
    L.push(atividade.revisao);
    return L.join('\n');
  }

  /* ============================================================
     CHAMADA DA IA (Edge Function do Supabase, chave no servidor)
     ============================================================ */
  function chamarIA(pedido){
    return new Promise(function(resolve, reject){
      if(typeof navigator !== 'undefined' && navigator.onLine === false){
        reject(new Error('Sem conexão com a internet.'));
        return;
      }
      var cabecalho = { 'Content-Type': 'application/json' };
      var cfg = (typeof window !== 'undefined') ? window.SUPABASE_CONFIG : null;
      if(cfg && cfg.anonKey) cabecalho.apikey = cfg.anonKey;

      function enviar(token){
        if(token) cabecalho.Authorization = 'Bearer ' + token;
        var controle = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        var relogio = null;
        if(controle){
          relogio = setTimeout(function(){ controle.abort(); }, 120000); // 2 min: IA pode demorar
        }
        fetch(urlIA(), {
          method: 'POST',
          headers: cabecalho,
          body: JSON.stringify(pedido),
          signal: controle ? controle.signal : undefined
        }).then(function(r){
          return r.json().catch(function(){ return null; }).then(function(d){
            if(r.ok && d && d.ok && d.atividade){
              resolve({ atividade: d.atividade, meta: { fonte:'ia', provedor:d.provedor || '', modelo:d.modelo || '' } });
              return;
            }
            var msg = (d && (d.erro || d.detalhes)) || ('A IA não respondeu (' + r.status + ').');
            reject(new Error(String(msg)));
          });
        }).catch(function(err){
          reject(new Error(err && err.name === 'AbortError' ? 'A IA demorou demais para responder.' : ((err && err.message) || 'Falha ao falar com a IA.')));
        }).then(function(){ if(relogio) clearTimeout(relogio); });
      }

      // Token da sessão do aluno (a Edge Function só atende quem está logado)
      var temAuth = (typeof window !== 'undefined') && window.Auth && window.Auth.getSession;
      if(temAuth){
        window.Auth.getSession().then(function(s){
          enviar(s && s.access_token ? s.access_token : null);
        }).catch(function(){ enviar(null); });
      } else {
        enviar(null);
      }
    });
  }

  /* ============================================================
     FORMULÁRIO E TELA
     ============================================================ */
  function lerFormulario(){
    function val(id, padrao){ var el = $(id); return el ? String(el.value || '').trim() : (padrao || ''); }
    function marcado(id){ var el = $(id); return !!(el && el.checked); }
    return {
      disciplina: limpar(val('gDisciplina', 'Interdisciplinar'), 60) || 'Interdisciplinar',
      ano: limpar(val('gAno', ANOS[5]), 60),
      tema: limpar(val('gTema'), 160),
      tipo: val('gTipo', 'mista') || 'mista',
      quantidade: clamp(val('gQtd', 8), 3, 20, 8),
      adaptaTdahTea: marcado('gTdah'),
      adaptaVisual: marcado('gVisual'),
      incluirGabarito: marcado('gGabarito'),
      observacoes: limpar(val('gObs'), 500),
      usarIA: marcado('gUsarIA')
    };
  }

  var ultimo = null;   // { atividade, pedido, meta }

  function definirStatus(msg, tipo){
    var el = $('gStatus');
    if(!el) return;
    el.textContent = msg || '';
    el.className = 'lab-status' + (tipo ? ' ' + tipo : '');
  }

  function carregarForm(){
    var el = $('gAno');
    if(el && !el.options.length){
      ANOS.forEach(function(a){
        var o = document.createElement('option');
        o.value = a; o.textContent = a;
        el.appendChild(o);
      });
      el.value = ANOS[5];
    }
    var dl = $('gDisciplinas');
    if(dl && !dl.children.length){
      DISCIPLINAS.forEach(function(d){
        var o = document.createElement('option');
        o.value = d;
        dl.appendChild(o);
      });
    }
    var tp = $('gTipo');
    if(tp && !tp.options.length){
      TIPOS.forEach(function(t){
        var o = document.createElement('option');
        o.value = t.v; o.textContent = t.n;
        tp.appendChild(o);
      });
      tp.value = 'mista';
    }
    // restaura o último pedido salvo no navegador
    var salvo = null;
    try{ salvo = JSON.parse(localStorage.getItem('pdf.lab.gerar') || 'null'); }catch(e){ salvo = null; }
    if(salvo && typeof salvo === 'object'){
      if($('gDisciplina') && salvo.disciplina) $('gDisciplina').value = salvo.disciplina;
      if($('gAno') && salvo.ano) $('gAno').value = salvo.ano;
      if($('gTema') && salvo.tema) $('gTema').value = salvo.tema;
      if($('gTipo') && salvo.tipo) $('gTipo').value = salvo.tipo;
      if($('gQtd') && salvo.quantidade) $('gQtd').value = salvo.quantidade;
      if($('gTdah')) $('gTdah').checked = !!salvo.adaptaTdahTea;
      if($('gVisual')) $('gVisual').checked = !!salvo.adaptaVisual;
      if($('gObs') && salvo.observacoes) $('gObs').value = salvo.observacoes;
    }
  }

  function salvarForm(pedido){
    try{ localStorage.setItem('pdf.lab.gerar', JSON.stringify(pedido)); }catch(e){}
  }

  /* ---------- pré-visualização + impressão/PDF ---------- */
  function abrirFolha(atividade, pedido, meta){
    ultimo = { atividade:atividade, pedido:pedido, meta:meta };
    var painel = $('folhaPainel');
    if(!painel) return;
    painel.innerHTML = montarFolhas(atividade, pedido, meta);
    painel.setAttribute('aria-label', 'Folha A4 de ' + atividade.titulo);

    var sub = $('folhaSub');
    if(sub){
      sub.textContent = (meta.fonte === 'ia')
        ? 'Folha escrita pela IA (grátis) e formatada em A4 — revise antes de imprimir.'
        : 'Folha montada no modo offline (sem IA) e formatada em A4 — revise antes de imprimir.';
    }
    var overlay = $('folhaOverlay');
    if(overlay){
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
    }
    document.documentElement.classList.add('folha-travada');

    ['folhaImprimir','folhaCopiar','folhaFechar'].forEach(function(id){
      var b = $(id); if(b) b.disabled = false;
    });
    try{ painel.scrollTop = 0; }catch(e){}
    var area = $('folhaArea'); if(area) area.scrollTop = 0;
  }

  function fecharFolha(){
    var overlay = $('folhaOverlay');
    if(overlay){
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
    }
    document.documentElement.classList.remove('folha-travada');
  }

  function imprimirFolha(){
    if(!ultimo) return;
    document.documentElement.classList.add('printing-folha');
    var limpar = function(){
      document.documentElement.classList.remove('printing-folha');
      window.removeEventListener('afterprint', limpar);
    };
    window.addEventListener('afterprint', limpar);
    // fallback para navegadores sem evento afterprint
    setTimeout(limpar, 3000);
    setTimeout(function(){ window.print(); }, 60);
  }

  /* ---------- gerar (IA ou offline) ---------- */
  function gerar(ev){
    if(ev && ev.preventDefault) ev.preventDefault();
    var pedido = lerFormulario();
    if(pedido.tema.length < 3){
      definirStatus('Escreva o tema principal da aula (pelo menos 3 letras).', 'erro');
      var t = $('gTema'); if(t) t.focus();
      return;
    }
    salvarForm(pedido);
    var btn = $('gBtn');
    if(btn){ btn.disabled = true; btn.textContent = '⏳ Escrevendo a atividade…'; }
    definirStatus(pedido.usarIA
      ? 'A IA está escrevendo o texto e as questões… isso leva de 10 a 40 segundos.'
      : 'Montando a folha no modo offline…', 'info');

    var terminar = function(atividade, meta, aviso){
      abrirFolha(atividade, pedido, meta);
      if(meta.fonte === 'ia'){
        definirStatus('Folha pronta com IA (' + (meta.provedor || 'gratuita') + '). Confira o conteúdo e clique em Imprimir/Salvar em PDF.', 'ok');
      } else {
        definirStatus('Folha pronta no modo offline. ' + (aviso ? 'Motivo: ' + aviso + ' ' : '') +
          'Para textos e questões escritas pela IA, configure uma chave gratuita (veja site/backend/README.md).', 'aviso');
      }
    };

    var offline = function(motivo){
      terminar(fallbackLocal(pedido), { fonte:'offline' }, motivo);
    };
    var soltar = function(){
      if(btn){ btn.disabled = false; btn.textContent = '✨ Gerar Atividade Pronta'; }
    };

    if(!pedido.usarIA){ offline('você desmarcou "usar IA".'); soltar(); return; }

    chamarIA(pedido).then(function(r){
      terminar(r.atividade, r.meta);
    }).catch(function(err){
      offline((err && err.message) || 'IA indisponível.');
    }).then(soltar, soltar);
  }

  /* ---------- inicialização ---------- */
  function iniciar(){
    var form = $('gerarForm');
    if(!form) return;              // página sem a ferramenta (ou teste no Node)
    carregarForm();
    form.addEventListener('submit', gerar);

    if($('folhaImprimir')) $('folhaImprimir').addEventListener('click', imprimirFolha);
    if($('folhaFechar')) $('folhaFechar').addEventListener('click', fecharFolha);
    if($('folhaCopiar')) $('folhaCopiar').addEventListener('click', function(){
      if(!ultimo) return;
      var txt = montarTexto(ultimo.atividade, ultimo.pedido);
      if(window.copyText){ window.copyText(txt, $('folhaCopiar')); }
      else if(navigator.clipboard){ navigator.clipboard.writeText(txt); }
    });
    var overlay = $('folhaOverlay');
    if(overlay) overlay.addEventListener('click', function(e){
      if(e.target === overlay) fecharFolha();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') fecharFolha();
    });
    var limparBtn = $('folhaLimpar');
    if(limparBtn) limparBtn.addEventListener('click', function(){
      try{ localStorage.removeItem('pdf.lab.gerar'); }catch(e){}
      definirStatus('Preferências de geração apagadas deste navegador.', 'info');
    });
  }

  /* ---------- API pública + exportação para teste no Node ---------- */
  var API = {
    urlIA: urlIA,
    gerarCacaPalavras: gerarCacaPalavras,
    palavrasDoTema: palavrasDoTema,
    fallbackLocal: fallbackLocal,
    montarFolhas: montarFolhas,
    montarTexto: montarTexto,
    gerarComIA: chamarIA,
    lerFormulario: lerFormulario,
    iniciar: iniciar,
    opcoes: { ANOS: ANOS, DISCIPLINAS: DISCIPLINAS, TIPOS: TIPOS }
  };
  if(typeof window !== 'undefined') window.AtividadeIA = API;
  if(typeof module !== 'undefined' && module.exports) module.exports = API;

  if(typeof document !== 'undefined' && document.getElementById){
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', iniciar);
    } else {
      iniciar();
    }
  }
})();







