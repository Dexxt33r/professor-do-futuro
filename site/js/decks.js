/* ============================================================
   PROFESSOR DO FUTURO — decks.js
   Biblioteca de coleções de slides (decks) para o professor
   assistir e usar em sala. Cada deck é uma apresentação com
   slides reutilizados pelo motor presente.js
   ============================================================ */
window.DECKS = [

  /* ================== DECK 1 · DIFERENTES SÉRIES ================== */
  { id:'d1', label:'SÉRIES', icon:'🎓', color:'blue', pill:'pill-blue',
    title:'Alunos de Diferentes Séries na Mesma Sala', slides:[

      { type:'section', color:'blue', title:'Alunos de diferentes séries', body:'Como acolher e ensinar bem quando a sala mistura 6º, 7º, 8º e 9º (ou intactas níveis) — 15 slides práticos' },

      { type:'list', color:'blue', title:'Por que isso acontece', body:['Escola multesserie do campo, turmas que se misturam e turma com níveis muito diferentes no mesmo conteúdo','Não é defeito do professor: é o seu ponto de partida','O segredo não é igualar absolutamente — é planejar um NÚCLEO COMUM e dividir em níveis'] },

      { type:'list', color:'blue', title:'O maior erro', body:['Dar a MESMA atividade para todos, no MESMO nível, no MESMO tempo','O aluno mais adiantado entedia; o que precisa de base se frustra','Resultado: ruído, soneca e exaustão do professor'] },

      { type:'table', color:'blue', title:'Maturidade por faixa', body:{ head:['Faixa','Característica','Estratégia'],
        rows:[['6º','Depende de instrução curta e rotina','Instruções curtas, passo a passo, metro']
             ,['7º–8º','Intermediário, gosta de interagir','Grupos, desafios, regras claras']
             ,['9º e Médio','Crítico, adora um desafio','Problema real, escolhas, protagonismo']] } },

      { type:'list', color:'blue', title:'Princípio 1 · O mapa da turma', body:['Comece por um diagnóstico rápido (3 perguntas ou cartões de resposta)','Separe 3 grupos: A) já adianta / B) no núcleo / C) precisa de base','Guarde o mapa sem reforço de rótulos — o objetivo é você PLANEJAR'] },

      { type:'table', color:'blue', title:'Princípio 2 · Núcleo comum em 3 níveis', body:{ head:['Nível','Foco','Como trabalhar'],
        rows:[['A (avançado)','criar e problematizar','problema, pesquisa, criação'],
             ['B (núcleo)','aplicar e entender','questões intermediárias + exemplo'],
             ['C (base)','consolidar','cartões, exemplos, passo a passo']] } },

      { type:'list', color:'blue', title:'Princípio 3 · Pares de tutoria', body:['Forme duplas/ternas: aluno adiantado + colega que precisa de base','Ensinar é a melhor forma de aprender — quem explica fixa','Os "monitores" abanhão para quem ficou grande — e sentem orgulho'] },

      { type:'prompt', color:'blue', title:'Prompt — o mesmo tema em 3 níveis', body:'Escreva o mesmo assunto [TEMA] para uma turma que mistura 6º a 9º ano, em 3 níveis de dificuldade: Nível 1 (línguagem simples, poucos passos), Nível 2 (núcleo, com exemplos) e Nível 3 (desafio e criação). No fim, sugira qual dupla de "aprender ensinando" pode surgir. Entregue para cada nível: 1 explicação, 2 exercícios e 1 desafio.' },

      { type:'list', color:'blue', title:'Princípio 4 · Rotina flexível', body:['Tenha um roteiro VISUAL por onde a turma sabe onde está (ex.: "hoje você pode terminar no nível 3")','Todos começam no núcleo e avançam por escolha','Termine com um "bilhete de saída": 1 frase de como foi'] },

      { type:'table', color:'blue', title:'Um exemplo: frações', body:{ head:['Nível','Atividade'],
        rows:[['1','Recorte de pizza: reconhecer 1/2, 1/4 e 1/3'],
             ['2','Somando frações com barras e partes iguais'],
             ['3','Comparar frações sem cálculo e criar 1 receita']] } },

      { type:'list', color:'blue', title:'O que evitar', body:['Decidir tudo no mesmo minuto para turmas juntos','Expor quem está com dificuldade na frente de todos','Exagerar na correção: manter o erro vira aprendizado'] },

      { type:'checklist', color:'blue', title:'Checklist da multissérie', body:['Fiz o mapa da turma (3 grupos)','Planejei um núcleo comum + 2 saídas','Usei pelo menos 1 dupla de "aprende ensinando"','Adaptei a atividade visual ou lúdica para o nível base','Deixei um desafio para quem vai mais rápido'] },

      { type:'checklist', color:'blue', title:'Antes de terminar o plano', body:['Defini o que todos devem SABER ao sair (mínimo comum)','Deixei claro o critério para ir ao nível seguinte','Separei materiais acessíveis (pictogramas, fonte grande)','Previ o "quem termina ajuda"','Anotei quem precisa de revisão na próxima aula'] },

      { type:'list', color:'blue', title:'Resumo em 8 frases', body:['1. Diagnostique na chegada — o mapa dirige tudo','2. Núcleo comum para todos, saída em níveis','3. Quem antecipou ajuda quem precisa','4. Rotina visual reduz ansiedade','5. A base exige imagem grande e passo a passo','6. Não confunda "cobrar" com acolher','7. Feedback é por esforço e progresso, não por comparação','8. Você não ensina o mesmo para 30 — ensina 30 rotas'] },

      { type:'prompt', color:'blue', title:'Prompt — planejar a próxima aula multissérie', body:'Dê-me o roteiro de 1 aula sobre [TEMA] para uma turma que mistura [6º, 7º e 8º]. Inclua: 1 diagnóstico de entrada de 5 min, o núcleo comum, 2 atividades em níveis (A/B/C), 1 dupla de "aprender ensinando" e 1 "bilhete de saída". Para cada parte: tempo, material e como eu divido a atenção. Simples e direto para aplicar amanhã.' },

      { type:'leitura', color:'blue', title:'📖 Leitura — como organizar a multissérie na prática', body:{ intro:'Organizar uma turma com níveis diferentes não é dividir a aula em "três aulas". É ter um mesmo objetivo, com rotas diferentes.', pontos:['Comece sempre do NÚCLEO comum, depois libere os avanços por escolha.','Use estações/tempos separados: quem termina vai para o próximo nível ou vira tutor.','O "bilhete de saída" (1 frase) diz o que cada um aprendeu e o que precisa revisar.','Crie um quadro-visual "onde eu estou" para a turma se localizar sem te perguntar.','Distribua materiais acessíveis (fonte grande, pictogramas) para todos usarem se precisarem.'], dica:'Comece pequeno: escolha 1 só conteúdo da semana para trabalhar em 3 níveis; o resto da rotina continua igual.' } },

    ] },

  /* ================== DECK 2 · ALUNO REBELDE INTELIGENTE ================== */
  { id:'d2', label:'REBELDE', icon:'🔥', color:'amber', pill:'pill-amber',
    title:'Como lidar com o aluno rebelde (e inteligente)', slides:[

      { type:'section', color:'amber', title:'Aluno rebelde inteligente', body:'O aluno que recusa, provoca e desestabiliza a aula — e como virar isso a seu favor' },

      { type:'list', color:'amber', title:'Primeiro: entender, não julgar', body:['Desprende raramente é despeito: é tédio, medo de errar ou busca por atenção','Quem é inteligente detecta quando a aula não o alcança','Sua resposta prova que ele é visto — para o bem ou para o mal'] },

      { type:'list', color:'amber', title:'Regra de ouro: desconectar da provocação', body:['Não leve a afronta para o pessoal','Responda à provocação com voz calma e um tempo','Nunca batalhe "quem manda" diante da turma — você já ganha ao manter o controle'] },

      { type:'list', color:'amber', title:'Dê um papel, não um castigo', body:['Transforme a energia em liderança produtiva: monitor, tutor, organizador','Atribua responsabilidade real (organizar, apresentar, revisar)','Inteligente quer ser útil e reconhecido — dê um posto'] },

      { type:'list', color:'amber', title:'Desafie o intelecto (não humilhe)', body:['Ofereça problemas que exigem engenho (nível 3)','Convide a explicar ao lado, a julgar uma resposta, a inventar a questão da prova','Quando der boa resposta, valorize em público — sem mola'] },

      { type:'table', color:'amber', title:'Reconhecer o estilo', body:{ head:['Sinal','O que pede','Como ajudar'],
        rows:[['Quem domina a aula','autonomia e protagonismo','dar um papel específico e combinado'],
             ['Quem provoca a plateia','visibilidade positiva','direcionar a atenção para o conteúdo'],
             ['Quem se recusa a fazer','medo de falho','começar por algo que já sabe, passo pequeno'],
             ['Quem desafia as regras','limites consistentes','aplicar o combinado com empatia']] } },

      { type:'list', color:'amber', title:'Os 3 minutos de ouro', body:['Chame para conversa individual após a aula (sem plateia)','Pergunte: o que te incomodou hoje? Como posso ajudar?','Combinem um acerto claro: limite + responsabilidade'] },

      { type:'list', color:'amber', title:'Em vez de "não", use "quando e depois"', body:['Ao invés de "não fale", diga "no momento certo você fala, e eu te escuto"','Antecipe a regra antes do problema','Corrija o comportamento, nunca a pessoa'] },

      { type:'prompt', color:'amber', title:'Prompt — trilha de desafio e diálogo', body:'Crie 2 problemas de [TEMA] em nível avançado (criar, investigar) e 1 papel de liderança ("especialista da turma") para um aluno inteligente e rebelde. Depois escreva a conversa de 3 minutos que terei com ele: o que perguntar, o que elogiar e o limite combinado. Saída: problema, papel e roteiro da conversa.' },

      { type:'list', color:'amber', title:'O que NÃO fazer', body:['Ridicularizar ou confrontar no meio da turma','Comparar com colegas','Ameaçar com punições que não vai cumprir','Criar clima de batalha pessoal constante'] },

      { type:'checklist', color:'amber', title:'Checklist do encontro', body:['Entendi a rebeldia como pedido, não como ofensa','Não confrontei em público','Dei um papel/desafio que usa a inteligência','Tive uma conversa individual breve e serena','Combinei um limite claro e o próximo passo'] },

      { type:'list', color:'amber', title:'Resumo em 8 frases', body:['1. Rebel tem raiz: tédio, medo ou vontade de ser notado','2. Não é uma batalha: é um aluno','3. Respire antes de responder a provocação','4. Dê um papel que use o melhor desse aluno','5. Desafie com problema de nível alto, com respeito','6. Limite coerente sustenta a sua autoridade','7. Conversa de 3 minutos vale mais que palestra','8. Sua paz depende menos do que ele faz e mais do que você espera'] },

      { type:'leitura', color:'amber', title:'📖 Leitura — da rebeldia à liderança', body:{ intro:'O aluno "rebelde e inteligente" muitas vezes só precisa de um papel que valha a pena. Transformar energia desafiadora em liderança muda a aula inteira.', pontos:['Escute antes de julgar: o que ele quer provar, evitar ou alcançar?','Dê um papel produtivo: monitor de um tema, quem apresenta, quem organiza o grupo.','Desafie com problema de nível alto em vez de punir com tarefa fácil.','Combine limite claro com respeito: autoridade não precisa vir de gritaria.','Reconheça o progresso publicamente: pertencimento acalma rebeldia.'], dica:'Em vez de "prestou atenção?", pergunte: "o que você quer que a turma saiba sobre isso?" — e o devolva ao centro.' } }
    ] },

  /* ================== DECK 3 · ESTRESSE EM SALA ================== */
  { id:'d3', label:'ESTRESSE', icon:'🧘', color:'green', pill:'pill-green',
    title:'Lidar com o estresse em sala de aula', slides:[

      { type:'section', color:'green', title:'Estresse na sala de aula', body:'Viver em estado de alerta que rouba a sua saúde — e técnicas para retomar o controle' },

      { type:'list', color:'green', title:'Reconheça os sinais', body:['Ombros tensos, batimento acelerado, voz trémula','Impaciência com quem ainda não entende','Cansaço antes mesmo de começar a aula','Vontade de "passar rápido" só para terminar'] },

      { type:'list', color:'green', title:'Respiração de emergência (2 min)', body:['Inale pelo nariz contando até 4','Segure por 4','Solte pela boca contando até 6 (mais longo)','3 a 5 ciclos relaxam o sistema nervoso'] },

      { type:'list', color:'green', title:'O que está no seu controle', body:['Você não controla a plataforma, a internet ou o comportamento de todos','Você controla: planejamento, tom de voz, o que responde e quando pausa','Liste 3 coisas que dependem de você HOJE — faça só essas'] },

      { type:'list', color:'green', title:'Reduza o gatilho no preparo', body:['Aula com um plano-B curto reduz o medo de "sobrar tempo"','Materiais separados de véspera evitam a correria da manhã','Combinados visíveis antecipam 80% dos conflitos'] },

      { type:'list', color:'green', title:'A pausa do professor é legítima', body:['Ensinar respira quando o professor está esgotado','Um silêncio de 20s não é fracasso: é recuperar o foco','Se precisar, diga: "vou aguardar o grupo acalmar e retomamos"'] },

      { type:'list', color:'green', title:'Encerre o dia longe da escola', body:['Separe um ritual: listar 3 coisas que deram certo hoje','Defina um horário para a correção e não a leve para o sofá','Ao sair, repita: "o que falhou hoje pode ter outra chance amanhã"'] },

      { type:'prompt', color:'green', title:'Prompt — semana mais leve', body:'Monte uma lista de 7 autocuidados práticos para um professor exausto (um por dia, que caibam no cotidiano: 5 min de respiração antes da 1ª aula, caminhada de 10 min, não levar trabalho no fim de semana). Depois liste 3 "pausas curtas" que eu possa fazer DENTRO da aula sem perder a turma. Saída clara e acolhedora.' },

      { type:'checklist', color:'green', title:'Checklist do dia tenso', body:['Identifiquei o gatilho (o que exatamente me tocou)','Respirei no 4-4-6','Usei o plano-B ou uma pausa','Lembrei: "não sou a soma das reações da turma"','Saí da escola no horário combinado'] },

      { type:'list', color:'green', title:'Resumo em 6 frases', body:['1. Estresse é sinal, não fracasso','2. Respiração longa na saída acalma','3. Controla o que é seu; o resto, deixe o lixo','4. Plano-B reduz o medo','5. Pausa é profissionalismo','6. Você também vive além da sala de aula'] },

      { type:'leitura', color:'green', title:'📖 Leitura — sinais precoces e cuidado contínuo', body:{ intro:'Quanto antes você reconhece o desgaste, mais fácil é reverter. O autocuidado não é luxo — é o alicerce da sua aula.', pontos:['O que começa "só cansaço" vira esgotamento se não for olhado.','Observe: perda de prazer, irritação frequente e sono ruim são sinais.','Fale com a rede de apoio: colegas, família e, se precisar, profissional de saúde.','Rotina ajuda: hora de parar, pausa real e algo que não seja a escola.','Seu bem-estar também ensina: você é o modelo de autocuidado para a turma.'], dica:'Marque 1 recado por semana no seu celular: "hoje eu paro no horário e faço 1 coisa para mim".' } }
    ] },

  /* ================== DECK 4 · CONVERSAR COM ALUNOS ================== */
  { id:'d4', label:'DIÁLOGO', icon:'💬', color:'pink', pill:'pill-pink',
    title:'Como conversar com os alunos (comunicação que acolhe)', slides:[

      { type:'section', color:'pink', title:'Conversar com os alunos', body:'Fala que escuta, pergunta que desarma e muita escuta que muda o dia — o diálogo como ferramenta' },

      { type:'list', color:'pink', title:'Por que a conversa importa', body:['Aluno que se sente ouvido participa mais','O tom da conversa define o tom da aula inteira','Muitos adultos dizem que "ninguém me escuta" — o professor pode ser essa pessoa'] },

      { type:'list', color:'pink', title:'Comece pelo acolhimento', body:['Cumprimente por nome. Parece pouco, muda tudo','"Como você tá?" abre porta que "senta e copia" não abre','Interesse genuíno se percebe no tom e no tempo que você dá'] },

      { type:'list', color:'pink', title:'Escuta ativa em 4 gestos', body:['Olhar e virar o corpo para a pessoa','Não interromper para dar a "resposta certa"','Repetir o que entendeu: "entendi que..."','Fazer 1 pergunta de aprofundamento'] },

      { type:'list', color:'pink', title:'Perguntas que abrem (e que fecham)', body:['Abertas: "o que você achou?", "como você chegou a isso?"','Fechadas: "entendeu?" "sim ou não?" — encurtam a conversa','Substitua julgamento por curiosidade: "me conta mais"'] },

      { type:'list', color:'pink', title:'Diálogo na hora do conflito', body:['Nomear a emoção: "percebi que você está bravo"','Separar pessoa e comportamento','Seguir a tríade: descrever o fato + explicar a consequência + combinar o caminho'] },

      { type:'list', color:'pink', title:'Conversa com o aluno quieto', body:['Não force resposta na frente de todos','Ofereça alternativa: papel, desenho, depois em particular','Reconheça a presença mesmo sem fala'] },

      { type:'prompt', color:'pink', title:'Prompt — roteiro de conversa', body:'Crie um roteiro de 6 perguntas abertas para uma conversa individual de 5 minutos com um aluno [descrever situação: tristre, rebelde, quieto]. Inclua a abertura acolhedora, 1 pergunta "como você se sente", 1 que o coloque como parte da solução e 1 fechamento que deixe claro que será ouvida. Tom sem julgamento.' },

      { type:'checklist', color:'pink', title:'Checklist do diálogo', body:['Cumprimentei pelo nome','Usei a escuta ativa (olhar + repetir + perguntar)','Fiz pelo menos 1 pergunta aberta','Nomeei a emoção do aluno sem julgar','Fechei com um próximo passo combinado'] },

      { type:'list', color:'pink', title:'Resumo em 6 frases', body:['1. Chame pelo nome e escute de verdade','2. Pergunta aberta abre a cabeça','3. Repetir o que o aluno disse mostra que entendeu','4. No conflito: descreva o fato, não rotule a pessoa','5. O aluno quieto também precisa de porta','6. Uma boa conversa pode mudar o dia inteiro'] },

      { type:'leitura', color:'pink', title:'📖 Leitura — escuta ativa na prática', body:{ intro:'Escutar de verdade é uma técnica, não só um talento. Com três gestos simples você muda a qualidade do diálogo com o aluno.', pontos:['Pare de preparar a resposta enquanto o outro fala: apenas escute.','Repita o essencial ("entendi que você ficou chateado porque...") para confirmar.','Faça perguntas abertas: "como foi?", "o que você sentiu?", "o que precisa?".','Reconheça a emoção antes de dar conselho: "deve ter sido difícil".','Combine com você mesmo: em 1 conversa por semana, só pergunte e escute.'], dica:'Pergunta que desarma: "o que você gostaria que eu soubesse sobre isso?" — abre portas que o "por que fez isso?" fecha.' } }
    ] },

  /* ================== DECK 5 · SILÊNCIO NA SALA ================== */
  { id:'d5', label:'SILÊNCIO', icon:'🤫', color:'blue', pill:'pill-blue',
    title:'Como ter (e manter) o silêncio produtivo na aula', slides:[

      { type:'section', color:'blue', title:'Silêncio na sala de aula', body:'Silêncio não nasce de gritos — nasce de combinados, rotina e um sinal. Veja como construir' },

      { type:'list', color:'blue', title:'Por que fala vira balbúrdia', body:['Sem rotina visível, cada um fala quando quer','O professor que fala por cima ensina que o barulho vence','O grupo espera o SINAL, não o grito'] },

      { type:'list', color:'blue', title:'O Sinal de silêncio', body:['Acorde com a turma: mão levantada, palma, ou a palavra "atenção"','Combine a regra: quando o sinal aparecer, para até então nível dele','Treine com o semáforo da sala (verde/amarelo/vermelho)'] },

      { type:'list', color:'blue', title:'Rotina previsível = menos ruído', body:['Mostre a sequência para a aula (cartões ou no quadro)','Quem sabe o que vem depois se concentra','Comece com atividade de entrada curta para já começar em silêncio'] },

      { type:'list', color:'blue', title:'Use a voz baixa de propósito', body:['Falar baixo faz o grupo baixar o tom para escutar','O silêncio do professor segura mais que o grito','Combine o tom da turma com o semáforo (verde/amarelo)'] },

      { type:'table', color:'blue', title:'Momentos diferentes, tons diferentes', body:{ head:['Momento','Tom ideal'],
        rows:[['Explicação','vermelho/amarelo — fala um de cada vez'],
             ['Debate em grupo','verde — todos podem falar'],
             ['Atividade individual','amarelo/vermelho — concentração'],
             ['Final /tarefa','combine "voz de biblioteca"']] } },

      { type:'list', color:'blue', title:'Quando o barulho persiste', body:['Não gritar: esperar em silêncio e retomar o sinal','Trabalhar com barulho aceitável (voz de grupo) antes do total','Retomar a regra do combinado, sem hierarquizar'] },

      { type:'prompt', color:'blue', title:'Prompt — plano do silêncio', body:'Crie um plano em 5 passos para construir o silêncio de uma turma barulhenta: 1) definir e ensinar o sinal de silêncio; 2) 3 "ações calmas" de abertura (focar 1 min, respirar); 3) como usar o semáforo; 4) 2 dinâmicas de "voz de biblioteca"; 5) como combinar o bônus quando a turma mantém o ponto. Entregue como roteiro prato eu aplicar amanhã.' },

      { type:'list', color:'blue', title:'Resumo em 6 frases', body:['1. Sinal combinado, não grito','2. Rotina visível reduz ansiedade e barulho','3. Tom baixo puxa a turma para baixo','4. Sempre níveis (biblioteca vs. debate)','5. Reforce o esforço, não o erro','6. Silêncio é construção, não castigo'] },

      { type:'leitura', color:'blue', title:'📖 Leitura — rotina e previsibilidade', body:{ intro:'Grande parte do barulho nasce de não saber o que vem depois. Rotina visível e combinados claros previnem antes de precisar silenciar.', pontos:['Mostre a sequência da aula no quadro desde o início (cartões ou intacta).','Combine o sinal e o tom esperado para cada momento (biblioteca x debate).','Repita o combinado toda semana nos primeiros minutos.','Dê aviso prévio antes de transições: "em 2 min voltamos a atenção".','Reforce o esforço: "gostei como vocês esperaram o sinal".'], dica:'Menos grito, mais rotina: o que é previsível não precisa ser repetido em voz alta.' } }
    ] },

  /* ================== DECK 6 · INTERESSE PELA SUA AULA (PRINCIPAL) ================== */
  { id:'d6', label:'DESTAQUE', icon:'✨', color:'amber', pill:'pill-amber',
    title:'Como despertar o interesse pela SUA AULA', slides:[

      { type:'section', color:'amber', title:'O interesse começa no professor', body:'A aula que engaja não nasce de mais conteúdo — nasce de contato com a realidade, escolha e emoção. O deck principal' },

      { type:'list', color:'amber', title:'O que rouba o interesse', body:['Aula sem "porquê" (serve pra quê?)','Monotonia: mesma fórmula todo dia','Conteúdo descolado da vida do aluno','Aluno sem vez: só ouve e copia'] },

      { type:'list', color:'amber', title:'Fórmula do interesse (C.E.E.)', body:['CONTEXTO: comece pelo real e projete o tema ao aluno','EMOÇÃO: espanto, humor, suspense ou um caso que prende','ESCOLHA: deixe o aluno decidir algum caminho'] },

      { type:'list', color:'amber', title:'O gancho dos 3 primeiros minutos', body:['Abrir com problema ou pergunta intrigante, não com "hoje vamos ver"','Use uma imagem, um vídeo curto ou uma pergunta provocativa','A primeira frase define se a turma liga o interesse'] },

      { type:'prompt', color:'amber', title:'Prompt — gancho que prende', body:'Crie 3 ganchos de abertura (1 pergunta provocadora, 1 situação real, 1 mini-desafio) para começar uma aula sobre [TEMA] para [segmento 6º a 9º ou EM]. Para cada gancho, dê: o texto exato que digo, o que esperar da turma e 1 pergunta de retomada para o meio da aula.' },

      { type:'list', color:'amber', title:'Conte com a vida deles', body:['"Onde você já viu isso na sua vida?"','Use o repertório do aluno: redes, jogos, música, tecnologia','Transformar o conteúdo em decisão (ex.: orçamento, cuidado, ética)'] },

      { type:'list', color:'amber', title:'Dê o controle: percurso e escolha', body:['Escolha de tema, formato ou nível (como as "escolha sua aventura")','Deixe o aluno chefe de si mesmo: "você decide como apresentar"','Combinado de resultado (rubrica) e meta pessoal'] },

      { type:'table', color:'amber', title:'Como apresentar o mesmo conteúdo', body:{ head:['Aula morna','Aula que prende'],
        rows:[['Mostro a definição','Começa com o problema que ela resolve'],
             ['Eu explico tudo','Metade do tempo é do aluno agindo'],
             ['Copie do quadro','Construa uma linha do tempo em grupo'],
             ['Sou velho conteúdo','Dose de gamificação + narração']] } },

      { type:'list', color:'amber', title:'Acompanhe: micro-feedback rápido', body:['Fazer 2 ou 3 perguntas de entendimento ao longo da aula','Uso pela mão (✅/🙋📱📷) para saber quem está dentro','Ajustar o rumo ao ver a sala "desligar"'] },

      { type:'list', color:'amber', title:'Interesse é que falta? Ajuste 3 coisas', body:['Gancho inicial (3 min)','Alternar atividade (5 a 15 min por trecho)','Deixar o aluno escolher e mostrar o próprio resultado'] },

      { type:'prompt', color:'amber', title:'Prompt — sequência engajadora completa', body:'Monte uma sequência didática engajadora de [2] aulas sobre [TEMA] para [série] usando: gancho (problema real), atividade em dupla, 1 dinâmica de gamificação (pontos/desafio) e 1 fechamento com escolha. Para cada bloco dê o tempo e o material necessário. Linguagem simples, encaixando no dia a dia de uma turma com pouco tempo.' },

      { type:'checklist', color:'amber', title:'Checklist da aula que prende', body:['Abri com problema/gancho (não com a definição seca)','Dei escolha ou percurso ao aluno pelo menos 1 vez','Tempo por bloco (evite 40min de falar)','Usei recurso visual/negócio real','Pedi micro-resposta ao longo da aula','Fechei com "olha o que você aprendeu"'] },

      { type:'list', color:'amber', title:'Resumo em 8 frases', body:['1. Sem propósito, não há interesse','2. Gancho nos primeiros 3 minutos','3. Conte com a vida do aluno','4. Escolha engaja','5. Pequenas escolhas e responsabilidade','6. Micro-feedback mostra se está dentro','7. Alternar atividade respira a atenção','8. Você é a porta-energia da aula'] },

      { type:'leitura', color:'amber', title:'📖 Leitura — o professor como porta-energia', body:{ intro:'O interesse começa na postura do professor: a energia de quem conduz rouba (ou sustenta) a atenção da turma. E energia é algo que se cuida.', pontos:['Abertura calma e confiante: os primeiros minutos definem o clima.','Movimento e tom de voz variados seguram o foco melhor que falar parado.','Um professor descansado engaja mais: proteja seu sono e suas pausas.','Erro não é fim: admitir e retomar mostra humanidade e coragem.','Deixe prazerosas as pequenas vitórias: comemore o progresso da turma.'], dica:'Nos dias difíceis, comece com a pergunta: "o que eu posso controlar nesta aula?" — foco no que está ao seu alcance.' } }
    ] },

  /* ================== DECK 7 · FEEDBACK QUE CONSTRÓI ================== */
  { id:'d7', label:'FEEDBACK', icon:'🧭', color:'green', pill:'pill-green',
    title:'Feedback que constrói (avaliar para avançar)', slides:[

      { type:'section', color:'green', title:'Feedback que constrói', body:'Avaliar não é apontar erro — é mostrar o caminho de melhoria que valoriza o esforço do aluno' },

      { type:'list', color:'green', title:'Qualidade do feedback', body:['Específico e descritivo, não genérico ("meh")','Foca no trabalho, não na pessoa','Chega na hora certa: logo depois da tarefa'] },

      { type:'list', color:'green', title:'Técnica do "sanduíche" 2.0', body:['Valorize: "gostei do passo 2, ficou claro"','O ajuste: "aqui a comparação precisa explicar porquê"','Pergunta motora: "como você faria para mostrar isso?"'] },

      { type:'table', color:'green', title:'No lugar de...', body:{ head:['Em vez de','Diga'],
        rows:[['"Errado"','"Este passo não se aplica aqui — releitura a regra"'],
             ['"Muito bom"','"Esse exemplo ficou bem explicado"'],
             ['"Você não se esforçou"','"Comece pela parte que você domina"']] } },

      { type:'list', color:'green', title:'Feedback entre o erro', body:['Erro é informação: mostra o próximo passo','Aponte 1 ou 2 prioridades, não sobrecarregue','Pergunte: "o que você entendeu que precisa melhorar?"'] },

      { type:'checklist', color:'green', title:'Checklist do feedback', body:['Parti da entrega, não da pessoa','Destaquei 1 ponto forte específico','Apontei 1 prioridade de melhoria','Fechei com a pergunta: "qual o seu próximo passo?"','Combinei a revisão/refazer'] },

      { type:'prompt', color:'green', title:'Prompt — comentário construtivo', body:'Escreva um comentário de feedback para um aluno [série] sobre a tarefa [TEMA], tom acolhedor: 1 elogio específico, 1 ponto de melhoria claro e 1 pergunta que o faça pensar no próximo passo. Máx 4 linhas. Não use negativas genéricas.' },

      { type:'list', color:'green', title:'Resumo em 6 frases', body:['1. Feedback é mapa, não veredicto','2. Seja específico e acolhedor','3. Erro é informação','4. Priorize: 1 ponto forte, 1 ajuste','5. Termine perguntando ao aluno','6. Relembre: o que você aprendeu?'] },

      { type:'leitura', color:'green', title:'📖 Leitura — feedback que edifica', body:{ intro:'O feedback bem dado forma, e o mal dado afasta. Alguns cuidados fazem toda a diferença para o aluno crescer e não desistir.', pontos:['Foque no processo e no esforço, não só no resultado ("você tentou 3 vezes e chegou lá").','Separe o momento de elogiar do momento de corrigir.','Deixe 1 passo claro para o aluno agir, sempre.','Combine a conversa com a autoavaliação: "como você avaliaria seu esforço?".','Retome a cada semana: feedback é um ciclo, não um evento.'], dica:'Frases que abrem caminho: "o que você tentou até aqui?", "qual parte você mais gostou do que fez?" — antes de apontar o ajuste.' } }
    ] },

  /* ================== DECK 8 · AUTOCUIDADO / PROSSIONAL ================== */
  { id:'d8', label:'BEM-ESTAR', icon:'🌱', color:'pink', pill:'pill-pink',
    title:'Autocuidado do professor (evite o burnout)', slides:[

      { type:'section', color:'pink', title:'Autocuidado do professor', body:'Cuidar de quem cuida: o professor que sustenta a sala também precisa de apoio, limites e descanso' },

      { type:'list', color:'pink', title:'Sinais de alerta', body:['Cansaço que não passa com o fim de semana','Sensação de nunca dar conta','Explosões ou apatia que antes não existiam','Fala como número, funcionando por "planejar e corrigir"'] },

      { type:'list', color:'pink', title:'Hierarquia do bem-estar', body:['O básico é o alicerce: sono, água, alimentação, pausa','Limites de horas de trabalho por dia','Momento real de desligamento (sem tela da escola)'] },

      { type:'list', color:'pink', title:'Rotina de proteção', body:['Delimite "início" e "fim" do trabalho','Não responda mensagens de escola fora do horário combinado','Deixe o trabalho no trabalho: feche a pasta ao final'] },

      { type:'list', color:'pink', title:'Apoio faz parte', body:['Falar com colegas/coordenador reduz o peso','Divirta-se com quem entende (sai de rede de professores)','Pedir ajuda não é fraqueza: destacamça a saúde'] },

      { type:'prompt', color:'pink', title:'Prompt — meu plano de proteção', body:'Crie um plano de 7 dias de autocuidado para mim, professor, com 1 ação por dia que respeite minha rotina (ex.: dormir 30 min a mais, 10 min sem tela após o trabalho, café com colega). Inclua alerta de sinais de sobrecarga e 1 frase de autocompaixão para os dias difíceis.' },

      { type:'list', color:'pink', title:'Resumo em 6 frases', body:['1. Burnout é sinal de excesso, não de fraqueza','2. Durma: é a medicina preventiva da mente','3. Estabeleça limites na jornada','4. A pausa não é perda de aula, é investimento','5. Rede de apoio segura o peso','6. Você também é alguém que precisa de cuidado'] },

      { type:'leitura', color:'pink', title:'📖 Leitura — burnout para reconhecer e agir', body:{ intro:'O burnout não é cansaço passageiro, é um esgotamento profundo. Reconhecer os sinais cedo permite pedir ajuda a tempo.', pontos:['Sinais: exaustão persistente, cinismo, sensação de ineficiência.','Física: dores, insônia, queda de imunidade.','Não ignore: converse com a coordenação, use a rede de apoio e a saúde.','Priorize o básico: sono, alimentação, movimento e pausas reais.','Reduza a carga quando der: delegue, divida tarefa, adie o que não é urgente.'], dica:'Se você se reconheceu em 3+ sinais com frequência, não espere piorar: procure ajuda profissional. Cuidar de você é cuidar dos seus alunos.' } }
    ] },

  /* ================== DECK 9 · EDUCAÇÃO FINANCEIRA ================== */
  { id:'d9', label:'FINANÇAS', icon:'💰', color:'green', pill:'pill-green',
    title:'Educação Financeira no Ensino Médio (Bloco 1)', slides:[

      { type:'section', color:'green', title:'Educação Financeira no Ensino Médio', body:'Do orçamento da casa à escolha do tênis: como formar jovens que decidem bem com o dinheiro — Bloco 1 do material oficial (Vida familiar, Vida social e Bens pessoais)' },

      { type:'list', color:'green', title:'Por que ensinar Educação Financeira', body:['Você já nasce consumindo, mas ninguém ensina a decidir: o jovem lida com dinheiro sem método','Educação Financeira é tema transversal da BNCC: compromisso de TODAS as áreas, não só de Matemática','Quem aprende a decidir cedo sofre menos endividamento e faz consumo consciente','Objetivo real: formar cidadãos críticos em relação ao consumo e às finanças — do particular ao país'] },

      { type:'list', color:'green', title:'Os 3 blocos do Ensino Médio', body:['Bloco 1 · Vida familiar, Vida social e Bens pessoais (o dia a dia: casa, festas, tênis, celular)','Bloco 2 · Trabalho, empreendedorismo e grandes projetos (renda, carreira, projeto de vida)','Bloco 3 · Bens públicos, economia do país e do mundo (impostos, inflação, mercado)','Este deck foca no Bloco 1, o ponto de partida mais próximo da vida do aluno'] },

      { type:'list', color:'green', title:'Bloco 1 · Vida familiar cotidiana', body:['Orçamento doméstico: de onde vem a renda e para onde vão os gastos','Gastos fixos (aluguel, contas) x variáveis (lazer, compras) e os imprevistos','Agenda e calendário para não esquecer prazos e contas','"Para gastar, é preciso ter": a lógica antes do desejo','Planejamento começa por anotar: quem não registra, não planeja'] },

      { type:'list', color:'green', title:'Bloco 1 · Vida social', body:['Pressão dos amigos e influenciadores: gastar para pertencer','Festas, presentes, passeios e viagens: quantas escolhas cabem no mês?','Ceder ou não à pressão do grupo — decisão consciente','O custo invisível das comemorações (todo mundo paga um pedaço)'] },

      { type:'list', color:'green', title:'Bloco 1 · Bens pessoais', body:['Tênis, computador, celular, câmera: desejo de compra x necessidade real','Caro nem sempre é melhor para a sua vida: timing e publicidade','Consumo x investimento: o que dura mais na SUA realidade','"Comprei e quebrou": manutenção, garantia e conserto também custam'] },

      { type:'table', color:'green', title:'Conceitos que o aluno deve dominar', body:{ head:['Conceito','O que é','Frase de ouro'],
        rows:[['Orçamento','Plano de onde entra e onde sai o dinheiro','Gastar menos do que ganha'],
              ['Renda','Todo o dinheiro que entra','Para gastar, é preciso primeiro ter'],
              ['Gastos fixos','Contas que se repetem todo mês','Aluguel, energia, água, escola'],
              ['Gastos variáveis','Decisões que tomamos todo dia','Mercado, lazer, transporte'],
              ['Poupança','Parcela guardada antes de gastar','Pagar-se primeiro'],
              ['Reserva','Poupança para os imprevistos','Imprevisto vira "custo" dobrado']] } },

      { type:'list', color:'green', title:'Os 5 hábitos do dinheiro saudável', body:['1. Anotar: registrar entradas e saídas (mesmo no papel)','2. Planejar: definir o que importa antes de gastar','3. Priorizar: necessidades primeiro, desejos depois','4. Reservar: separar um pouco antes do "sobrar"','5. Revisar: olhar o mês e aprender com os erros'] },

      { type:'prompt', color:'green', title:'Prompt — roteiro de aula', body:'Monte uma aula de 50 min de educação financeira para o Ensino Médio com o tema [TEMA DO BLOCO 1, ex: o orçamento da família]. Inclua: (1) um cabo com 1 situação do cotidiano, (2) 3 conceitos-chave com exemplo, (3) 2 atividades práticas e um "Experimente" para casa, (4) 1 pergunta de discussão ética sobre consumo. Linguagem acessível e acolhedora.' },

      { type:'prompt', color:'green', title:'Prompt — simulação de orçamento', body:'Crie um jogo de simulação de orçamento para o EM: cada aluno recebe uma renda mensal de [R$], paga gastos fixos, variáveis e poupança, escolhendo 1 de 3 opções por item. Inclua cartas de "imprevisto" e, ao final, faça o aluno escrever o que aprendeu. Formato: tabela que posso imprimir.' },

      { type:'list', color:'green', title:'Metodologia: Situações + "Experimente"', body:['O modelo oficial (CONEF) usa Situações de Apoio para contextualizar e o "Experimente!" para o aluno pôr em prática','Comece pela história e pelo problema da vida dele — nunca pela teoria do dinheiro','Feche com uma ação pequena e concreta para a semana (registrar gastos, comparar preços)','A avaliação é formativa: o que mudou na vida do aluno?'] },

      { type:'list', color:'green', title:'Inclusão e acessibilidade', body:['Dinheiro é abstrato: use cédulas/recortes e valores pequenos para concretizar (CAA)','Adapte planilhas em linguagem fácil (Easy Read) para quem precisa de apoio','Letras grandes, gráficos visuais e poucas opções por tela','Respeite realidades: fale de renda sem expor ou constranger família alguma'] },

      { type:'prompt', color:'green', title:'Prompt — custo da vida', body:'Crie uma comparação visual do "custo da vida" em [cidade] para o EM: quanto custam por mês moradia, transporte, alimentação e lazer. Gere um infográfico com dados aproximados, 3 perguntas de raciocínio e 1 desafio: "com R$ [X] de renda, como montar o orçamento?".' },

      { type:'checklist', color:'green', title:'Checklist · Educação Financeira', body:['Abordei vida familiar, vida social e bens pessoais (os 3 eixos do Bloco 1)','Trouxe o conceito de orçamento (renda x gastos x poupança)','Ensinei a anotar, planejar, priorizar e revisar','Usei 1 situação de relação e 1 "Experimente" para casa','Adaptei o material para quem precisa de apoio','Discuti o lado ético e social (pressão, publicidade, inadimplência)'] }

    ] },

  /* ================== DECK 10 · NANOTECNOLOGIA ================== */
  { id:'d10', label:'NANO', icon:'🔬', color:'blue', pill:'pill-blue',
    title:'Nanotecnologia — abordagem para o Ensino Médio', slides:[

      { type:'section', color:'blue', title:'Nanotecnologia no Ensino Médio', body:'Um mergulho no mundo NANO: escala, propriedades, aplicações e questionamentos éticos — a partir da história de Rita e das dúvidas reais dos alunos' },

      { type:'list', color:'blue', title:'O que significa NANO', body:['Nano vem do grego e significa ANÃO: é um prefixo de escala (10⁻⁹ = um bilionésimo)','1 nanômetro = 1 bilionésimo de metro — impossível de ver a olho nu','Um fio de cabelo tem cerca de 80.000 a 90.000 nanômetros de espessura','Quanto menor a partícula, mais a superfície passa a dominar o comportamento'] },

      { type:'table', color:'blue', title:'Escala e ordem de grandeza', body:{ head:['Objeto','Tamanho','Escala'],
        rows:[['Estádio / prédio','100 m','metrô'],
             ['Altura humana','1–2 m','metrô'],
             ['Ponta de agulha','1 mm','milímetro'],
             ['Célula humana','10 µm','micrômetro'],
             ['Vírus','100 nm','nanômetro'],
             ['Molécula de DNA','1–10 nm','nanômetro'],
             ['Átomo','0,1 nm','nanômetro']] } },

      { type:'list', color:'blue', title:'Tudo começa na Química de base', body:['Tudo é feito de átomos: prótons (positivos), elétrons (negativos), nêutrons','Moléculas: união de átomos por ligações químicas (ex.: H2O)','Muitas moléculas formam as substâncias: forças intermoleculares','A novidade é manipular átomos e moléculas individualmente para criar materiais'] },

      { type:'list', color:'blue', title:'Nanopartículas: por que mudam de comportamento', body:['Na escala nano a área de superfície por volume cresce MUITO','Mais superfície = mais reatividade química','Pode mudar cor, resistência, transparência e ponto de fusão','O mesmo material se comporta de forma diferente quando fica nanométrico'] },

      { type:'list', color:'blue', title:'Nanociência x Nanotecnologia', body:['Nanociência: o ESTUDO das propriedades de materiais nanoparticulados','Nanotecnologia: a ENGENHARIA de manipular e criar com essas propriedades','Ciência explica, tecnologia constrói — uma alimenta a outra','É um campo interdisciplinar: química + física + matemática + biologia + ética'] },

      { type:'list', color:'blue', title:'Nanopartículas sempre existiram', body:['A fuligem do queimado já é nanoparticulada: partículas invisíveis no ar','Alguns materiais nano sempre existiram na natureza','O que é novo não é a matéria — é conseguir VER e MEDIR','Microscópios (eletrônico de varredura, força atômica, tunelamento) permitiram tudo isso'] },

      { type:'list', color:'blue', title:'Exemplos no dia a dia', body:['Proteção solar em nanotecnologia: protegem mais com menos sensação','Tecidos que não mancham ou repelem água','Remédios de liberação controlada que agem no alvo certo','Eletrônicos, sensores, catalisadores e tintas inteligentes'] },

      { type:'list', color:'blue', title:'Riscos, ética e segurança', body:['Partículas muito pequenas podem atravessar barreiras dentro do corpo','Impactos na saúde e no ambiente ainda estão em discussão científica','Faltam regulamentações claras para o uso em massa','O aluno precisa de posicionamento consciente, não só de entusiasmo'] },

      { type:'list', color:'blue', title:'Interdisciplinaridade de verdade', body:['Química: a matéria e as ligações','Física: como ver, medir e o que muda na energia','Matemática: escala, potências e ordem de grande','Biologia: o corpo humano e a saúde','Filosofia/Geografia: ética, economia e quem lucra com a nova tecnologia'] },

      { type:'prompt', color:'blue', title:'Prompt — aula de nanotecnologia', body:'Crie uma introdução à nanotecnologia para o Ensino Médio em estilo narrativo (como a história de uma aluna curiosa). Inclua: (1) o que é "nano" e a escala, (2) o que é nanopartícula e por que mudam de propriedades, (3) 3 aplicações cotidianas, (4) 2 questionamentos éticos. Termine com uma situação desafio para os alunos investigarem.' },

      { type:'prompt', color:'blue', title:'Prompt — atividade de observação', body:'Monte uma atividade prática para o EM: comparar materiais do dia a dia (achocolatado, talco, açúcar, fuligem, amido de milho), estimar o menor e o maior grupo de partículas e concluir quais são nanoparticulados. Dê roteiro de observação, tabela para preencher e pergunta final de conclusão.' },

      { type:'checklist', color:'blue', title:'Checklist · Nanotecnologia', body:['Trabalhei o significado de NANO e a escala / ordem de grandeza','Mostrei por que nanopartículas mudam de propriedade','Diferenciei nanociência (estudar) de nanotecnologia (fazer)','Dei exemplos do cotidiano, não só de laboratório','Discuti riscos à saúde e regulamentação','Trabalhei a interdisciplinaridade (química, física, ética)'] }
    ] },

/*INSERT*/
];

/* Registro dos decks como "módulos" para o motor de visualização */
(function(){
  window.MODULES = window.MODULES || {};
  var DESC = {
    'd1':'15 slides práticos: mapa da turma, núcleo comum em 3 níveis, tutoria entre colegas e rotina flexível.',
    'd2':'Entender sem julgar, dar um papel em vez de castigo e transformar a rebeldia em liderança e desafio.',
    'd3':'Sinais de alerta, respiração de emergência, limites, pausas legítimas e rotina de autocuidado.',
    'd4':'Escuta ativa, perguntas que abrem portas e roteiros de diálogo que acolhem sem julgar.',
    'd5':'Sinal combinado, rotina visível, voz baixa e semáforo para construir um silêncio produtivo.',
    'd6':'A fórmula do interesse (contexto, emoção, escolha), ganchos de 3 minutos e sequência engajadora.',
    'd7':'Feedback específico e acolhedor que mostra o caminho de melhoria e valoriza o esforço.',
    'd8':'Sinais de burnout, rotina de proteção e rede de apoio para o professor cuidar de quem cuida.',
    'd9':'Bloco 1 da educação financeira no EM: orçamento da família, vida social e bens pessoais, com situações reais, prompts e checklist.',
    'd10':'Nanotecnologia no EM: escala nano, propriedades de nanopartículas, aplicações do cotidiano, riscos e ética — baseado na história de Rita.'
  };
  var TAG = { d1:'Gestão', d2:'Gestão', d3:'Bem-estar', d4:'Comunicação', d5:'Gestão', d6:'Engajamento', d7:'Avaliação', d8:'Bem-estar', d9:'Tema BNCC', d10:'Tema BNCC' };
  (window.DECKS||[]).forEach(function(d){
    d.tag = d.tag || TAG[d.id] || 'Tema';
    d.desc = d.desc || DESC[d.id] || 'Coleção de slides sobre ' + d.title;
    window.MODULES[d.id] = { label:(d.label||'TEMA'), name:d.title, pill:(d.pill||'pill-blue') };
  });
})();