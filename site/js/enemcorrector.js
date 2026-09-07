/* ============================================================
   PROFESSOR DO FUTURO — Corretor de Redação ENEM
   Chave de correção oficial INEP: escala 0–20,
   5 competências (C1–C5) × 4 níveis (0 a 4).
   Usado ao final de ferramentas.html (requer <div id="enemRub">,
   <div id="enemOut">, os campos #enemTipo/#enemTema/#enemDest/#enemTexto
   e o botão #enemCalc).
   ============================================================ */
(function(){
  'use strict';
  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  var COMP = [
    { n:1, ic:'✍️', nome:'Uso da norma',
      desc:'Domínio da modalidade escrita formal: ortografia, acentuação, pontuação, sintaxe (frases completas), concordância, regência e riqueza de vocabulário.',
      level:[
        [4,'NV4','Pleno domínio da norma culta: pouquíssimos erros, que não dificultam a leitura; vocabulário e registro formais adequados.'],
        [3,'NV3','Domínio suficiente: alguns erros (de acentuação, pontuação ou sintaxe) que não comprometem a compreensão.'],
        [2,'NV2','Domínio insuficiente: erros frequentes que afetam parcialmente a fluidez e a compreensão.'],
        [1,'NV1','Domínio muito baixo: erros graves e constantes que dificultam seriamente a leitura.']
      ],
      fb:{
        4:'Pleno domínio da norma culta: ortografia, acentuação e sintaxe corretas, com registro formal adequado.',
        3:'Domina o essencial da norma, mas ainda apresenta alguns erros de acentuação ou pontuação a corrigir.',
        2:'Repasse as regras de acentuação, pontuação e sintaxe e revise o texto antes de entregar; os erros repetidos afetam a fluidez.',
        1:'Repasse as regras básicas de ortografia e sintaxe e leia em voz alta ao revisar; os erros constantes dificultam seriamente a compreensão.'
      } },
    { n:2, ic:'🗂️', nome:'Organização do texto',
      desc:'Compreensão da proposta de redação e do motivador, com tese clara, estrutura em parágrafos (introdução, desenvolvimento e conclusão) e progressão temática sem digressões.',
      level:[
        [4,'NV4','Compreende o tema, apresenta uma tese clara e organiza o texto em parágrafos coerentes (introdução, desenvolvimento, conclusão), sem digressões.'],
        [3,'NV3','Compreende o tema e organiza o texto com coerência, ainda que apresente alguma digressão menor.'],
        [2,'NV2','Compreensão parcial ou genérica do tema; organização básica, com alguns saltos temáticos.'],
        [1,'NV1','Não compreende o tema ou se desvia dele; texto desorganizado, sem tese clara.']
      ],
      fb:{
        4:'Organiza o texto com uma tese clara e progressão lógica (introdução, desenvolvimento, conclusão) em parágrafos coerentes.',
        3:'O texto está bem organizado; procure manter o foco no tema para evitar digressões.',
        2:'Reforce a estrutura: introdução com tese, um parágrafo por argumento e conclusão; evite tratar o tema de forma genérica.',
        1:'Trabalhe a compreensão do tema antes de escrever: faça um esquema com introdução, desenvolvimento e conclusão.'
      } },
    { n:3, ic:'💡', nome:'Argumentação',
      desc:'Ponto de vista sustentado por argumentos pertinentes, com repertório sociocultural legitimado (dados, fatos, exemplos, vivências) desenvolvido e articulado à tese.',
      level:[
        [4,'NV4','Argumentos sólidos e pertinentes: utiliza dados, exemplos e explicações que fundamentam plenamente a tese.'],
        [3,'NV3','Argumenta de forma pertinente, ainda que alguma ideia fique pouco desenvolvida ou genérica.'],
        [2,'NV2','Argumentos escassos, repetitivos ou pouco pertinentes; apoio frágil à tese.'],
        [1,'NV1','Ausência de argumentação ou argumentos irrelevantes, sem elaboração.']
      ],
      fb:{
        4:'Desenvolve argumentos sólidos, com exemplos, dados e explicações que fundamentam plenamente a tese.',
        3:'Argumenta de forma pertinente; desenvolve cada ideia com um exemplo concreto para fundamentar melhor.',
        2:'Apresenta argumentos, mas precisa desenvolvê-los mais; sustente cada ideia com dados ou exemplos.',
        1:'Precisa construir argumentação: cada ideia deve ser sustentada com exemplos, dados ou razões que respondam ao tema.'
      } },
    { n:4, ic:'🔗', nome:'Coerência e coesão',
      desc:'Articulação entre as partes do texto e entre as ideias, por meio de conectivos variados, garantindo fluidez, progressão e ausência de contradições e saltos.',
      level:[
        [4,'NV4','Uso variado e adequado de conectores e recursos de coesão; texto fluido, sem repetições nem saltos abruptos.'],
        [3,'NV3','Coesão adequada, ainda que apresente algum conector repetido ou mal utilizado.'],
        [2,'NV2','Coesão parcial: conectores básicos ou repetitivos e alguns saltos entre as ideias.'],
        [1,'NV1','Ausência ou uso incorreto de conectores; ideias soltas, sem relação lógica clara.']
      ],
      fb:{
        4:'Conecta as ideias com naturalidade e variedade de conectores; o texto permanece fluido.',
        3:'Utiliza conectores de forma adequada; procure variá-los e evitar a repetição dos mesmos.',
        2:'Fortaleça a coesão do texto: use conectores de causa, consequência ou contraste e evite ideias soltas.',
        1:'Ligue as ideias com conectores básicos (por isso, portanto, porém) para dar amarração lógica ao texto.'
      } },
    { n:5, ic:'🎯', nome:'Adequação ao tipo de texto',
      desc:'Atendimento à estrutura e às convenções do tipo de texto proposto — no dissertativo-argumentativo, a proposta de intervenção (agente, ação, meio, finalidade e detalhamento); na carta, a adequação ao destinatário (apresentação, desenvolvimento e feição) e o tom adequado.',
      level:[
        [4,'NV4','Respeito pleno das convenções: na carta, cabeçalho, saudação, corpo, despedida e assinatura; no texto argumentativo, registro formal de artigo de opinião. Tom adequado.'],
        [3,'NV3','Adequa o texto ao tipo solicitado, embora detalhes do formato tenham passado despercebidos (início e fim da carta, tom constante ou proposta de intervenção incompleta).'],
        [2,'NV2','Adequação parcial: falta algum elemento do formato esperado ou registro pouco cuidado.'],
        [1,'NV1','Não respeita o tipo textual ou utiliza registro e tom inadequados; a carta não apresenta suas partes.']
      ],
      fb:{
        4:'Respeita plenamente o formato e as convenções do tipo de texto e adequa o tom (e o destinatário, na carta) de forma impecável.',
        3:'Adequa o texto ao tipo solicitado, mas detalhes do formato passaram despercebidos: revise o início e o fim da carta, o tom constante e os elementos da proposta de intervenção.',
        2:'Cumpre parcialmente o formato esperado: revise o início e o fim da carta e mantenha um registro formal constante.',
        1:'Repasse o formato do tipo solicitado (partes da carta ou artigo de opinião) e mantenha um tom formal e respeitoso.'
      } }
  ];

  var ZERO_FB = 'Texto não avaliável nesta competência (em branco, ilegível ou totalmente fora do tema).';
function buildRubric(){
    var box = $('enemRub'); if(!box) return;
    var h = '<h3 class="enem-rub-title">🧭 Rúbrica oficial — 5 competências (0–4 cada)</h3>' +
      '<p class="enem-rub-sub">Leia os descritores e marque <b>1 nível</b> por competência · NV4 = 4 · NV3 = 3 · NV2 = 2 · NV1 = 1 · Zero = 0.</p>';
    COMP.forEach(function(c){
      h += '<fieldset class="enem-comp"><legend><span class="enem-ic">'+c.ic+'</span> C'+c.n+'. '+esc(c.nome)+'</legend><p class="enem-desc">'+esc(c.desc)+'</p><div class="enem-levels">';
      c.level.forEach(function(L){
        h += '<label class="enem-opt"><input type="radio" name="enem_c'+c.n+'" value="'+L[0]+'" data-c="'+c.n+'" data-lbl="'+L[1]+'"><span class="enem-btn"><b>'+L[1]+' · '+L[0]+' pts</b><small>'+esc(L[2])+'</small></span></label>';
      });
      h += '<label class="enem-opt zero"><input type="radio" name="enem_c'+c.n+'" value="0" data-c="'+c.n+'" data-lbl="0"><span class="enem-btn zero"><b>Zero · 0 pts</b><small>Texto em branco, ilegível ou totalmente fora do tema.</small></span></label>';
      h += '</div></fieldset>';
    });
    box.innerHTML = h;
    box.querySelectorAll('input[type="radio"]').forEach(function(r){
      r.addEventListener('change', function(){
        var fs = r.closest('fieldset');
        if(fs){ fs.querySelectorAll('.enem-opt').forEach(function(l){ l.classList.remove('sel'); }); }
        var lab = r.closest('.enem-opt');
        if(lab) lab.classList.add('sel');
      });
    });
  }

  function bandName(t){
    if(t>=18) return ['🏆 18–20 · Excelente','Desempenho excepcional: a redação atinge o patamar das melhores notas da banca. Parabéns!'];
    if(t>=14) return ['🌟 14–17 · Muito bom','Desempenho sólido: atende bem às 5 competências; restam apenas ajustes finos rumo à excelência.'];
    if(t>=10) return ['👍 10–13 · Bom','Desempenho adequado: atende ao essencial. Invista em argumentação, coesão e norma para avançar.'];
    if(t>=6)  return ['💪 6–9 · Regular','Desempenho parcial: a base existe, mas há muito a consolidar com revisão orientada.'];
    return ['⚠️ 0–5 · Insuficiente','Desempenho insuficiente: retome estrutura, norma culta e argumentação com acompanhamento próximo.'];
  }
function buildPrompt(aluno, tipo, tema, dest, texto){
    var rubric='';
    COMP.forEach(function(c){
      rubric += '\nC'+c.n+' — '+c.nome+': '+c.desc;
      c.level.forEach(function(L){ rubric += '\n   • '+L[1]+' ('+L[0]+'): '+L[2]; });
    });
    return 'Atue como um corretor experiente da Redação do ENEM, fiel às "chaves de correção" oficiais do INEP.\n'+
      'Escala oficial: 0–20 pontos, resultado da soma de 5 competências (C1–C5), cada uma avaliada de 0 a 4 pontos (NV4=4, NV3=3, NV2=2, NV1=1, Zero=0).\n'+
      'Regras da banca: atribua Zero apenas em casos de texto em branco, ilegível, com desvio total do tema ou desrespeito aos direitos humanos; avalie com rigor, mas sem punir duas vezes o mesmo erro em competências distintas.\n\n'+
      'Dados:\n- Tipo de texto: '+tipo+'\n- Tema da redação: '+tema+(dest?'\n- Destinatário da carta: '+dest:'')+(aluno?'\n- Aluno(a): '+aluno:'')+'\n\n'+
      'Rúbrica oficial:\n'+rubric+'\n\n'+
      'Tarefa: corrija a redação do aluno(a) (abaixo) seguindo exatamente esta rúbrica. Para cada competência C1–C5, apresente:\n'+
      '  1) a evidência do texto que sustenta o julgamento (citação curta, entre aspas);\n'+
      '  2) o nível atribuído (NV4/NV3/NV2/NV1/Zero) e a pontuação (4/3/2/1/0);\n'+
      '  3) de 1 a 2 frases de devolutiva construtiva, apontando o que fortalece e o que melhorar.\n\n'+
      'Depois, conclua com:\n'+
      '  - Nota total: X/20;\n'+
      '  - Uma avaliação geral em 2–3 frases;\n'+
      '  - 3 recomendações priorizadas (do que mais impacta a nota para o que menos) para subir a pontuação na próxima versão.\n\n'+
      'Valores do exame: respeite a defesa dos direitos humanos, a sustentabilidade ambiental, a cidadania e a justiça social ao julgar as ideias e a proposta de intervenção (quando houver, verifique os 5 elementos: agente, ação, meio/modo, finalidade e detalhamento).\n'+
      'Seja objetivo, rigoroso, imparcial e formativo — como a banca, corrija o texto, não o autor.\n\n'+
      'Redação do aluno:\n\"\"\"\n'+texto+'\n\"\"\"';
  }

  function calc(){
    var tema = ($('enemTema').value||'').trim();
    var texto = ($('enemTexto').value||'').trim();
    if(!tema || !texto){
      $('enemOut').innerHTML = '<p class="enem-warn">⚠️ Informe o <b>tema</b> e a <b>redação do aluno</b> para calcular.</p>';
      return;
    }
    var total=0, falta=false, linhas='';
    COMP.forEach(function(c){
      var r = document.querySelector('input[name="enem_c'+c.n+'"]:checked');
      if(!r){ falta = true; return; }
      var v = parseInt(r.value,10), lbl = r.getAttribute('data-lbl');
      total += v;
      linhas += '<tr><td><b>C'+c.n+'.</b> '+esc(c.nome)+'</td><td class="enem-pts">'+lbl+'</td><td class="enem-val">'+v+'/4</td></tr>';
    });
    if(falta){
      $('enemOut').innerHTML = '<p class="enem-warn">⚠️ Marque as <b>5 competências</b> na rúbrica (acima) para calcular a nota.</p>';
      return;
    }
    var b = bandName(total);
    var tipo = ($('enemTipo').value==='carta') ? 'carta' : 'texto dissertativo-argumentativo';
    var art  = ($('enemTipo').value==='carta') ? 'na' : 'no';
    var aluno = ($('enemAluno').value||'').trim();
    var dest = ($('enemDest').value||'').trim();
var partes = [];
    COMP.forEach(function(c){
      var r = document.querySelector('input[name="enem_c'+c.n+']:checked');
      var v = parseInt(r.value,10);
      partes.push('<li><b>C'+c.n+' — '+esc(c.nome)+':</b> '+(v===0 ? ZERO_FB : esc(c.fb[v]))+'</li>');
    });
    var nom = (aluno ? '<b>'+esc(aluno)+'</b>' : 'Sua redação');
    var encab = nom+', '+art+' <b>'+tipo+'</b> sobre <b>'+esc(tema)+'</b>, obteve <b>'+total+'/20</b>. Estas são as notas por competência e as recomendações para continuar melhorando:';

    var prompt = buildPrompt(aluno, tipo, tema, dest, texto);

    var h = '<div class="enem-out-card">' +
      '<div class="enem-top"><div class="enem-score"><div class="enem-num">'+total+'<small>/20</small></div><div class="enem-pct">Aproveitamento: '+(total*5)+'%</div></div>' +
      '<div class="enem-band"><span class="enem-b-chip">'+b[0]+'</span><p>'+b[1]+'</p></div></div>' +
      '<table class="enem-table"><thead><tr><th>Competência</th><th>Nível</th><th>Pontos</th></tr></thead><tbody>'+linhas+'</tbody></table>' +
      '<div class="enem-com"><h4>💬 Comentário para devolver ao aluno</h4><p>'+encab+'</p><ul>'+partes.join('')+'</ul></div>' +
      '<div class="enem-prompt-wrap no-print"><h4>🤖 Prompt de IA (corrige no estilo ENEM)</h4>' +
      '<p style="color:var(--text-muted);font-size:.9rem">Copie este prompt e cole-o em ChatGPT, Claude ou Gemini junto com a redação para receber uma análise competência por competência respeitando a rúbrica oficial.</p>' +
      '<pre id="enemPrompt" class="enem-pre"></pre>' +
      '<div class="enem-actions" style="margin-top:.5rem"><button class="btn btn-outline" id="enemCopyPrompt" style="padding:.4rem .9rem;font-size:.85rem">📋 Copiar prompt de IA</button></div></div>' +
      '<div class="enem-actions"><button class="btn btn-outline" id="enemPrint" style="padding:.5rem 1rem">🖨️ Imprimir resultado</button>' +
      '<button class="btn btn-outline" id="enemCopyCom" style="padding:.5rem 1rem">📋 Copiar comentário</button></div></div>';

    $('enemOut').innerHTML = h;
    var pre = $('enemPrompt'); if(pre) pre.textContent = prompt;

    if($('enemCopyPrompt')) $('enemCopyPrompt').addEventListener('click', function(){ window.copyText(prompt, this); });
    if($('enemPrint')) $('enemPrint').addEventListener('click', function(){ window.print(); });
    var comTxt = encab.replace(/<[^>]+>/g,' ') + '\n' + partes.join('\n').replace(/<[^>]+>/g,' ');
    if($('enemCopyCom')) $('enemCopyCom').addEventListener('click', function(){ window.copyText(comTxt.replace(/\s+/g,' '), this); });
  }

  buildRubric();
  if($('enemTipo')) $('enemTipo').addEventListener('change', function(){
    var esCarta = ($('enemTipo').value==='carta');
    var w = $('enemDestWrap'); if(w) w.style.display = esCarta ? '' : 'none';
    var d = $('enemDest'); if(d) d.required = esCarta;
  });
  if($('enemCalc')) $('enemCalc').addEventListener('click', calc);
})();
