/* ============================================================
   PROFESSOR DO FUTURO — Corretor de Redação ENEM
   Chave de correção OFICIAL do Enem: escala 0–1000,
   5 competências (C1–C5) × 6 níveis (0, 40, 80, 120, 160, 200 pontos).
   Referência: Matriz de Referência da Redação do Enem e
   "A Redação do Enem — Cartilha do Participante" (Inep, edição 2026).

   A escala escolar 0–20 é uma ADAPTAÇÃO pedagógica de uso interno
   (nota oficial ÷ 50) e é sempre rotulada como não oficial.

   Usado ao final de ferramentas.html. Requer: #enemRub, #enemOut,
   #enemTema, #enemTexto, #enemCalc e, opcionalmente, #enemAluno
   e #enemEscala20.
   ============================================================ */
(function(){
  'use strict';
  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  var OFICIAL_MAX = 1000;   /* 5 competências × 200 pontos */
  var ESCOLA_DIV  = 50;     /* conversão adaptada: 1000 ÷ 50 = 20 */

  /* Níveis oficiais por competência: 200 · 160 · 120 · 80 · 40 (e 0) */
  var COMP = [
    { n:1, ic:'✍️', nome:'Domínio da modalidade escrita formal',
      desc:'Ortografia, acentuação, pontuação, concordância, regência, sintaxe e adequação ao registro formal.',
      nivel:[
        [200,'Nível 5','Domínio excelente: raríssimos desvios, que não comprometem a leitura; vocabulário preciso e registro formal.'],
        [160,'Nível 4','Bom domínio: poucos desvios pontuais; estrutura sintática adequada ao texto argumentativo.'],
        [120,'Nível 3','Domínio mediano: alguns desvios (acentuação, pontuação, concordância) que não impedem a compreensão.'],
        [80,'Nível 2','Domínio insuficiente: desvios frequentes que comprometem parte da leitura; marcas de registro informal.'],
        [40,'Nível 1','Domínio precário: desvios sistemáticos e graves que dificultam seriamente a compreensão.']
      ],
      fb:{
        200:'Domínio pleno da escrita formal: mantenha a revisão final para não perder pontos em detalhes.',
        160:'Bom domínio: revise acentuação e pontuação para alcançar o nível máximo.',
        120:'Domínio mediano: revise concordância, pontuação e registro — os desvios ainda aparecem com frequência.',
        80:'Os desvios atrapalham a leitura: reveja ortografia, sintaxe e registro formal, relendo o texto em voz alta.',
        40:'Retome as regras básicas da escrita formal (ortografia, concordância e sintaxe) antes de escrever a próxima versão.'
      } },
    { n:2, ic:'🗂️', nome:'Compreensão da proposta e repertório sociocultural',
      desc:'Compreensão do tema e da situação-problema, com repertório sociocultural pertinente e produtivo — e não o "repertório de bolso" — dentro do limite estrutural do texto dissertativo-argumentativo.',
      nivel:[
        [200,'Nível 5','Compreende plenamente a proposta: aborda o tema de forma completa e articula repertório pertinente e produtivo à discussão.'],
        [160,'Nível 4','Aborda o tema integralmente, com repertório pertinente e desenvolvimento consistente.'],
        [120,'Nível 3','Aborda o tema, mas com repertório previsível ou pouco produtivo; desenvolvimento mediano.'],
        [80,'Nível 2','Aborda o tema de forma parcial ou usa repertório desconectado da argumentação.'],
        [40,'Nível 1','Tangencia o tema: abordagem parcial, genérica ou com uso meramente decorativo de repertório.']
      ],
      fb:{
        200:'Tema compreendido e repertório produtivo: continue articulando a referência à tese, e não apenas citando.',
        160:'Boa compreensão do tema: aprofunde o repertório para que ele explique e sustente o argumento.',
        120:'Cuidado com o "repertório de bolso": use referências conectadas ao tema, desenvolvidas e não só citadas.',
        80:'Reforce a leitura do tema e dos textos motivadores: a abordagem ainda está parcial ou genérica.',
        40:'Há tangenciamento ao tema — situação que limita esta competência a 40 pontos. Releia a proposta e responda ponto a ponto.'
      } }
    ,
    { n:3, ic:'💡', nome:'Seleção e organização de argumentos (projeto de texto)',
      desc:'Selecionar, relacionar, organizar e interpretar informações, fatos e opiniões em defesa de um ponto de vista, com autoria e progressão.',
      nivel:[
        [200,'Nível 5','Projeto de texto claro: argumentos bem elaborados, organizados e articulados ao ponto de vista, com progressão e marcas de autoria.'],
        [160,'Nível 4','Argumentos consistentes e bem organizados, com autoria identificável e boa progressão.'],
        [120,'Nível 3','Argumentos previsíveis, organizados de forma mediana e com pouco desenvolvimento.'],
        [80,'Nível 2','Informações e opiniões justapostas, sem articulação clara com o ponto de vista defendido.'],
        [40,'Nível 1','Apresenta informações desconectadas do tema ou contraditórias; não há projeto de texto.']
      ],
      fb:{
        200:'Projeto de texto consistente: aprofunde cada argumento com um dado ou exemplo específico.',
        160:'Bons argumentos: desenvolva melhor a ideia que ficou mais genérica.',
        120:'Os argumentos estão previsíveis: escolha 2 ou 3 razões fortes e desenvolva cada uma com exemplo concreto.',
        80:'Falta articulação: cada parágrafo deve defender uma razão ligada à tese, e não apenas listar informações.',
        40:'Antes de escrever, faça um esquema: tese, dois argumentos com exemplos e conclusão. O texto precisa defender um ponto de vista.'
      } },
    { n:4, ic:'🔗', nome:'Coesão e coerência',
      desc:'Uso dos mecanismos linguísticos de articulação entre as partes do texto e entre as ideias: conectivos variados, referenciação e progressão sem contradições.',
      nivel:[
        [200,'Nível 5','Articula as partes e as ideias com repertório variado de recursos coesivos, garantindo fluidez e progressão sem inadequações.'],
        [160,'Nível 4','Boa articulação, com poucas inadequações e uso adequado dos conectores.'],
        [120,'Nível 3','Articulação mediana: conectores básicos, com repetições ou algumas inadequações.'],
        [80,'Nível 2','Articulação insuficiente: repetições, ausência de conectores ou inadequações frequentes.'],
        [40,'Nível 1','Articulação precária: ideias justapostas, sem recursos coesivos reconhecíveis.']
      ],
      fb:{
        200:'Coesão variada e fluida: revise para não repetir os mesmos conectores.',
        160:'Boa articulação: varie os conectores de causa, contraste e conclusão.',
        120:'Varie os conectores: substitua repetições por relações de causa, oposição e consequência.',
        80:'Fortaleça a ligação entre os parágrafos: cada um deve retomar o anterior e avançar na discussão.',
        40:'Use conectores básicos (por isso, porém, portanto, além disso) para amarrar as ideias do texto.'
      } },
    { n:5, ic:'🎯', nome:'Proposta de intervenção (respeito aos direitos humanos)',
      desc:'Elaboração de proposta para enfrentar o problema discutido, com os cinco elementos — agente, ação, meio/modo, finalidade e detalhamento — e respeito aos direitos humanos.',
      nivel:[
        [200,'Nível 5','Proposta bem elaborada e articulada à discussão, com os cinco elementos (agente, ação, meio/modo, finalidade e detalhamento) e respeito aos direitos humanos.'],
        [160,'Nível 4','Proposta bem elaborada e articulada ao tema, com quatro elementos ou detalhamento parcial.'],
        [120,'Nível 3','Proposta identificável e relacionada ao tema, com cerca de três elementos (ex.: agente, ação e meio).'],
        [80,'Nível 2','Proposta identificável, mas com apenas dois elementos e/ou pouco articulada à discussão.'],
        [40,'Nível 1','Proposta precária, com um único elemento ou simples repetição de ideia já apresentada no texto.']
      ],
      fb:{
        200:'Proposta completa e articulada: excelente fechamento para o texto.',
        160:'Proposta bem elaborada: acrescente o detalhamento de como a ação seria executada.',
        120:'Complete a proposta: além do agente e da ação, indique o meio/modo e a finalidade.',
        80:'Detalhe a proposta: quem faz, o que faz, como faz, para quê e com que desdobramento.',
        40:'Uma proposta de intervenção precisa de pelo menos agente, ação e meio. Elabore uma ação concreta, viável e ligada ao tema.'
      } }

  ];

  var ZERO_LBL = 'Nível 0 · 0 pts';
  var ZERO_DESC = 'Texto em branco, ilegível, em língua estrangeira, cópia dos textos motivadores ou fuga total ao tema.';
  var ZERO_FB = 'Não avaliável nesta competência (texto em branco, ilegível, cópia ou fora do tipo/tema solicitado).';

  function buildRubric(){
    var box = $('enemRub'); if(!box) return;
    var h = '<h3 class="enem-rub-title">🧭 Rúbrica oficial — 5 competências (0 a 200 pontos cada)</h3>' +
      '<p class="enem-rub-sub">Síntese pedagógica dos descritores oficiais do Inep. Marque <b>1 nível por competência</b>: N5 = 200 · N4 = 160 · N3 = 120 · N2 = 80 · N1 = 40 · N0 = 0. A soma das 5 competências é a nota final (0–1000).</p>';
    COMP.forEach(function(c){
      h += '<fieldset class="enem-comp"><legend><span class="enem-ic">'+c.ic+'</span> C'+c.n+'. '+esc(c.nome)+'</legend><p class="enem-desc">'+esc(c.desc)+'</p><div class="enem-levels">';
      c.nivel.forEach(function(L){
        h += '<label class="enem-opt"><input type="radio" name="enem_c'+c.n+'" value="'+L[0]+'" data-c="'+c.n+'" data-lbl="'+L[1]+'"><span class="enem-btn"><b>'+L[1]+' · '+L[0]+' pts</b><small>'+esc(L[2])+'</small></span></label>';
      });
      h += '<label class="enem-opt zero"><input type="radio" name="enem_c'+c.n+'" value="0" data-c="'+c.n+'" data-lbl="Nível 0"><span class="enem-btn zero"><b>'+ZERO_LBL+'</b><small>'+esc(ZERO_DESC)+'</small></span></label>';
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
    if(t>=900) return ['🏆 900–1000 · Excelente','Desempenho excepcional: o texto atende com folga às cinco competências. Mantenha o nível e refine os detalhes.'];
    if(t>=700) return ['🌟 700–899 · Muito bom','Desempenho sólido: as competências estão atendidas; faltam ajustes finos em argumentação, repertório e proposta de intervenção.'];
    if(t>=500) return ['👍 500–699 · Bom','Atende ao essencial. Invista em repertório produtivo (C2), desenvolvimento dos argumentos (C3) e nos cinco elementos da proposta (C5).'];
    if(t>=300) return ['💪 300–499 · Regular','Desempenho parcial: a base existe, mas há lacunas importantes a consolidar com revisão orientada.'];
    return ['⚠️ 0–299 · Insuficiente','Desempenho insuficiente: retome a estrutura do texto dissertativo-argumentativo, a norma culta e a argumentação com acompanhamento próximo.'];
  }

  function linhasEscritas(txt){
    return String(txt||'').split(/\r?\n/).filter(function(l){ return l.trim().length > 0; }).length;
  }

  function buildPrompt(d){
    var rubric = '';
    COMP.forEach(function(c){
      rubric += '\nC'+c.n+' — '+c.nome+': '+c.desc;
      c.nivel.forEach(function(L){ rubric += '\n   • '+L[1]+' ('+L[0]+' pontos): '+L[2]; });
      rubric += '\n   • Nível 0 (0 pontos): '+ZERO_DESC;
    });
    return 'Atue como corretor da Redação do Enem, seguindo a Matriz de Referência e a Cartilha do Participante do Inep.\n'+
      'Tipo de texto: dissertativo-argumentativo em prosa, de até 30 linhas.\n'+
      'Escala oficial: 0 a 1000 pontos — soma de 5 competências (C1–C5), cada uma valendo 0, 40, 80, 120, 160 ou 200 pontos.\n'+
      'Como a banca corrige: dois avaliadores independentes atribuem as notas e a nota final é a média; há terceira correção quando a diferença passa de 100 pontos no total ou de 80 pontos em uma competência.\n'+
      'Rigor e nota zero: fuga total ao tema, texto que não atende ao tipo dissertativo-argumentativo, até 7 linhas, cópia dos textos motivadores, impropérios/desenhos, ilegibilidade ou identificação fora do local. O tangenciamento limita a C2 a 40 pontos; sem proposta de intervenção ou com desrespeito aos direitos humanos, a C5 é zero.\n'+
      (d.escola20 ? 'Além da nota oficial (0–1000), informe também a nota convertida para a escala escolar 0–20 (nota oficial ÷ 50), deixando claro que essa conversão é uma adaptação pedagógica de uso interno, e não a escala oficial do Enem.\n' : '')+
      '\nDescritores dos níveis (síntese oficial):\n'+rubric+'\n\n'+
      'Dados da correção:\n- Tema: '+d.tema+
      (d.aluno ? '\n- Aluno(a): '+d.aluno : '')+
      (d.linhas ? '\n- Linhas escritas (contagem aproximada): '+d.linhas : '')+'\n\n'+
      'Tarefa: corrija a redação abaixo, competência por competência. Para cada C1–C5 apresente:\n'+
      '  1) a evidência do texto que sustenta o julgamento (citação curta, entre aspas);\n'+
      '  2) o nível e a pontuação (0, 40, 80, 120, 160 ou 200);\n'+
      '  3) de 1 a 2 frases de devolutiva construtiva, apontando o que fortalece e o que melhorar.\n'+
      'Ao final, apresente: nota final (X/1000); aproveitamento em %; uma avaliação geral em 2–3 frases; e 3 recomendações priorizadas, da que mais impacta a nota para a que menos impacta.\n'+
      'Corrija o texto, não o autor: seja rigoroso, imparcial e formativo.\n\n'+
      'Redação do aluno:\n"""\n'+d.texto+'\n"""';
  }

  function calc(){
    var tema  = ($('enemTema').value||'').trim();
    var texto = ($('enemTexto').value||'').trim();
    if(!tema || !texto){
      $('enemOut').innerHTML = '<p class="enem-warn">⚠️ Informe o <b>tema</b> e a <b>redação do aluno</b> para calcular.</p>';
      return;
    }
    var aluno = $('enemAluno') ? ($('enemAluno').value||'').trim() : '';
    var escola20 = !!($('enemEscala20') && $('enemEscala20').checked);

    var total = 0, falta = false, linhas = '';
    COMP.forEach(function(c){
      var r = document.querySelector('input[name="enem_c'+c.n+'"]:checked');
      if(!r){ falta = true; return; }
      var v = parseInt(r.value,10), lbl = r.getAttribute('data-lbl');
      total += v;
      linhas += '<tr><td><b>C'+c.n+'.</b> '+esc(c.nome)+'</td><td class="enem-pts">'+esc(lbl)+'</td><td class="enem-val">'+v+'/200</td></tr>';
    });
    if(falta){
      $('enemOut').innerHTML = '<p class="enem-warn">⚠️ Marque as <b>5 competências</b> na rúbrica (acima) para calcular a nota.</p>';
      return;
    }

    var nLinhas = linhasEscritas(texto);
    var avisos = [];
    if(nLinhas < 8)  avisos.push('<b>'+nLinhas+' linha(s):</b> no Enem, redação com até 7 linhas é considerada insuficiente e recebe <b>nota zero</b> — o mínimo é 8 linhas.');
    if(nLinhas > 30) avisos.push('<b>'+nLinhas+' linhas:</b> o exame permite até 30 linhas; o excedente é desconsiderado na correção oficial.');

    var b = bandName(total);
    var partes = [];
    COMP.forEach(function(c){
      var r = document.querySelector('input[name="enem_c'+c.n+'"]:checked');
      var v = parseInt(r.value,10);
      partes.push('<li><b>C'+c.n+' — '+esc(c.nome)+':</b> '+(v===0 ? ZERO_FB : esc(c.fb[v]))+'</li>');
    });
    var nom = (aluno ? '<b>'+esc(aluno)+'</b>' : 'Sua redação');
    var pct = Math.round(total/OFICIAL_MAX*1000)/10;
    var escolaNota = (total/ESCOLA_DIV).toFixed(1);
    var escolaTxt = escola20 ? ' (equivalente escolar: <b>'+escolaNota+'/20</b> — escala adaptada, não oficial)' : '';
    var encab = nom+', no <b>texto dissertativo-argumentativo</b> sobre <b>'+esc(tema)+'</b>, obteve <b>'+total+'/1000</b>'+escolaTxt+'. Estas são as notas por competência e as recomendações para continuar melhorando:';
    var prompt = buildPrompt({ tema:tema, aluno:aluno, texto:texto, linhas:nLinhas, escola20:escola20 });

    var h = '<div class="enem-out-card">' +
      '<div class="enem-top"><div class="enem-score"><div class="enem-num">'+total+'<small>/1000</small></div><div class="enem-pct">Aproveitamento: '+pct+'%</div>' +
      (escola20 ? '<div class="enem-pct">Adaptada (escolar): <b>'+escolaNota+'/20</b><br><small>conversão pedagógica — não é a escala oficial</small></div>' : '') +
      '</div>' +
      '<div class="enem-band"><span class="enem-b-chip">'+b[0]+'</span><p>'+b[1]+'</p></div></div>' +
      (avisos.length ? '<p class="enem-warn" style="margin-top:.8rem">⚠️ <b>Atenção ao formato exigido pelo exame:</b><br>'+avisos.join('<br>')+'</p>' : '') +
      '<table class="enem-table"><thead><tr><th>Competência</th><th>Nível</th><th>Pontos</th></tr></thead><tbody>'+linhas+'</tbody></table>' +
      '<div class="enem-com"><h4>💬 Comentário para devolver ao aluno</h4><p>'+encab+'</p><ul>'+partes.join('')+'</ul></div>' +
      '<div class="enem-prompt-wrap no-print"><h4>🤖 Prompt de IA (corrige no estilo da banca)</h4>' +
      '<p style="color:var(--text-muted);font-size:.9rem">Copie este prompt e cole-o em ChatGPT, Claude ou Gemini junto com a redação para receber uma análise competência por competência respeitando a escala oficial (0–1000).</p>' +
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
  if($('enemCalc')) $('enemCalc').addEventListener('click', calc);
})();



