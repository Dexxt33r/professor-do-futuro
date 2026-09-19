/* ============================================================
   PROFESSOR DO FUTURO — data.js
   Deck completo da apresentação + metadados dos módulos
   ============================================================ */

/* Metadados usados pelo present.js */
window.MODULES = {
  intro: { label: 'INTRO',   name: 'Professor do Futuro',            pill: 'pill-mission' },
  '1':   { label: 'MÓDULO 1', name: 'Módulo 1 · Slides com IA',       pill: 'pill-blue' },
  '2':   { label: 'MÓDULO 2', name: 'Módulo 2 · Inclusão e AEE',      pill: 'pill-pink' },
  '3':   { label: 'MÓDULO 3', name: 'Módulo 3 · IA na Prática',       pill: 'pill-green' },
  '4':   { label: 'MÓDULO 4', name: 'Módulo 4 · Gestão de Sala',      pill: 'pill-amber' },
  fim:   { label: 'FIM',      name: 'Encerramento',                   pill: 'pill-mission' }
};

window.DECK_COLOR = { dark: 'dc-dark', blue: 'dc-blue', pink: 'dc-pink', green: 'dc-green', amber: 'dc-amber' };

window.STRIP = {
  dark: '#062b1b', blue: '#d9a621', pink: '#ec4899', green: '#10b981', amber: '#f59e0b'
};

window.SLIDES = [

  /* ---------------- INTRODUÇÃO ---------------- */
  { id: 0, mod: 'intro', color: 'dark', title: 'Professor do Futuro', type: 'list',
    body: ['Criação de Slides com IA, Inclusão e Gestão da Sala de Aula Digital',
           'Da Educação Infantil ao Ensino Médio, com foco em AEE',
           'Você vai aprender a produzir materiais didáticos em minutos, adaptá-los para a inclusão e usar a IA como aliada no engajamento.',
           'A IA não substitui o professor: ela devolve o seu tempo para o que mais importa — olhar nos olhos dos alunos.',
           'Use as SETAS ← → para navegar'] },

  { id: 1, mod: 'intro', color: 'dark', title: 'Objetivo Geral', type: 'list',
    body: ['Produzir materiais didáticos com IA em minutos',
           'Adaptar para a inclusão (AEE, TEA, TDAH)',
           'Usar a IA na gestão do comportamento e do engajamento'] },

  { id: 2, mod: 'intro', color: 'blue', title: 'Público-Alvo', type: 'list',
    body: ['Professores da Educação Infantil ao Ensino Médio',
           'Professores do AEE (Atendimento Educacional Especializado)',
           'Coordenadores e gestores escolares',
           'Professores de apoio/inclusão'] },

  { id: 3, mod: 'intro', color: 'amber', title: 'Carga Horária', type: 'table',
    body: { head: ['Formato', 'Duração', 'Encontros'],
            rows: [['Extensivo', '24h', '6 encontros de 4h'],
                   ['Intensivo', '12h', '4 encontros de 3h'],
                   ['Autoestudo', '+4h', 'Banco de prompts e práticas']] } },

  /* ---------------- MÓDULO 1 ---------------- */
  { id: 4, mod: '1', color: 'blue', title: 'Módulo 1 · Slides com IA', type: 'section',
    body: 'Fundamentos e Criação de Slides Rápidos com IA' },

  { id: 5, mod: '1', color: 'blue', title: 'Ferramentas práticas', type: 'list',
    body: ['Gamma App — texto vira apresentação em 1–2 min',
           'Canva Design Mágico — descrição vira slides prontos',
           'Google Slides + Gemini — roteiro da IA direto na apresentação',
           'ChatGPT/Claude — roteiro, texto e revisão'] },

  { id: 6, mod: '1', color: 'blue', title: 'Prompt base para Gamma', type: 'prompt',
    body: 'Crie uma apresentação sobre [TEMA] com [N] slides para alunos do [SEGMENTO].\nEstilo leve, com muitos ícones e pouco texto. Inclua: definição, 3 pontos importantes, 1 exemplo cotidiano e um desafio para reflexão ao final. Use cores [CORES].' },

  { id: 7, mod: '1', color: 'blue', title: 'Prompt para Canva (Design Mágico)', type: 'prompt',
    body: 'Slides sobre "Reciclagem" para o 5º ano, divertido e ilustrado, com etapas de coleta, cores vivas e imagens de crianças reciclando.' },

  { id: 8, mod: '1', color: 'blue', title: 'Prompt de narrativa (Gamma ou Slides)', type: 'prompt',
    body: 'Transforme este texto [cole aqui] em uma apresentação de 8 slides com narrativa: gancho, contexto, dados, exemplo real, atividade e conclusão.' },

  { id: 9, mod: '1', color: 'blue', title: 'Roteiro com ChatGPT/Claude', type: 'prompt',
    body: 'Atue como design instrucional. Crie o roteiro de uma apresentação de [10] slides sobre [TEMA], para alunos de [segmento]. Para cada slide: TÍTULO, TEXTO (máx 3 linhas), SUGESTÃO DE IMAGEM e, se houver, ATIVIDADE. Linguagem simples e acolhedora.' },

  { id: 10, mod: '1', color: 'blue', title: 'Qual ferramenta usar?', type: 'table',
    body: { head: ['Situação', 'Ferramenta ideal', 'Por quê'],
            rows: [['Slides AGORA, sem tempo', 'Gamma', 'Texto → slides em 1–2 min'],
                   ['Visual bonito e edição manual', 'Canva + Design Mágico', 'Controle total do layout'],
                   ['Contar uma história / narrativa', 'Gamma ou ChatGPT + Slides', 'Narrativa em cartões — o Tome saiu do mercado'],
                   ['Roteiro + conteúdo correto', 'ChatGPT/Claude', 'Roteiro, revisão, simplificação'],
                   ['Sem internet na sala', 'PowerPoint offline', 'Monta com base no roteiro']] } },

  { id: 11, mod: '1', color: 'blue', title: 'Infantil e Anos Iniciais', type: 'list',
    body: ['Alta carga visual — a imagem vale mais que a palavra',
           'Poucas palavras — frases de 3 a 5 palavras',
           'Cores estratégicas para organizar, sem poluição',
           'Fonte grande e arredondada (Comic Sans, Arcon, Fredoka)',
           'Uma ideia por slide',
           'Regra de ouro: uma imagem, três palavras, uma pergunta'] },

  { id: 12, mod: '1', color: 'blue', title: 'Prompt — Educação Infantil', type: 'prompt',
    body: 'Crie slides para crianças de [5 anos / 2º ano] sobre [TEMA], com UMA GRANDE ilustração de cada vez, cores vivas mas harmoniosas, texto máximo de 4 palavras, e uma pergunta lúdica para as crianças responderem. Divertido e acolhedor.' },

  { id: 13, mod: '1', color: 'blue', title: 'Anos Finais e Ensino Médio', type: 'list',
    body: ['Design dinâmico e moderno (gradientes, espaçamento limpo)',
           'Resumos visuais: infográficos, mapas mentais, linhas do tempo',
           'Dados concretos: gráficos, números, casos reais',
           'Gamificação: quizzes, desafios, resposta rápida',
           'Linguagem moderna para engajar — o professor mantém o protagonismo'] },

  { id: 14, mod: '1', color: 'blue', title: 'Prompt — Anos Finais/EM', type: 'prompt',
    body: 'Crie slides para o [9º ano/Ensino Médio] sobre [TEMA]. Inclua: 1 infográfico, 1 gráfico com dados reais, 1 pergunta-problema no início, 1 mini-quiz de 3 perguntas com resposta certa, e 1 desafio de aplicação real. Estilo moderno, cores [X], sem poluição visual, fontes legíveis.' },

  { id: 15, mod: '1', color: 'blue', title: 'Checklist · Módulo 1', type: 'checklist',
    body: ['Testei pelo menos 2 ferramentas (Gamma + Canva, ou ChatGPT + Google Slides)',
           'Criei 1 apresentação com IA em menos de 15 min',
           'Adaptei um tema para a educação infantil (visual + poucas palavras)',
           'Adaptei um tema para anos finais/EM (dados + quiz)',
           'Revisei o conteúdo produzido pela IA antes de usar em sala'] },
{ id: 80, mod: '1', color: 'blue', title: 'Roteiro completo: do conteúdo ao slide pronto', type: 'list',
    body: ['1) Defina o essencial: tema, segmento, objetivo da aula e tempo de fala.',
           '2) Escreva um prompt claro com esses dados (use os prontos deste curso).',
           '3) Gere um rascunho e peça ao menos 2 versões de visual.',
           '4) Revise SEMPRE: a IA pode inventar fato, número, autor ou método.',
           '5) Adapte para acessibilidade: fonte grande, alto contraste e legendas.',
           '6) Ensaie antes: tempo, transições e um plano B caso falte internet.'] },

  { id: 81, mod: '2', color: 'pink', title: 'Adaptar NÃO é simplificar', type: 'list',
    body: ['Adaptar é remover barreiras de acesso, e não diminuir o que o aluno pode aprender.',
           'O mesmo objetivo é alcançado por caminhos diferentes para cada perfil.',
           'Ajuste o formato: uma imagem no lugar do texto, um passo a passo no lugar do parágrafo.',
           'Poucos, mas bons recursos: rotina visual, quadro de antecipação e CAA.',
           'A IA acelera o rascunho, mas é o seu olhar pedagógico que decide o que serve.'] },

  { id: 60, mod: '1', color: 'blue', title: '📖 Leitura — como escolher a ferramenta pelo tempo que você tem', type: 'leitura',
    body: { intro: 'Nem toda aula exige a ferramenta mais completa. O segredo é casar o tempo disponível com o objetivo, para não perder horas montando o material.',
            pontos: ['3 minutos → ChatGPT/Claude: peça só o roteiro e o texto, sem slides.',
                     '10 minutos → Gamma ou Canva Design Mágico: gere a apresentação e ajuste poucas coisas.',
                     '20+ minutos → Gamma (ou ChatGPT + Google Slides): quando o foco é narrativa e impacto visual.',
                     'Ferramenta alguma substitui sua revisão: sempre confira fatos e datas antes de projetar.'],
            dica: 'Monte um "cardápio de ferramentas": tempo curto = texto; tempo médio = slides prontos; tempo sobrando = narrativa.' } },

  { id: 61, mod: '1', color: 'blue', title: '📖 Leitura — erros comuns ao gerar slides com IA', type: 'leitura',
    body: { intro: 'A IA acelera, mas sem direção ela entrega slides genéricos. Conhecer os erros típicos ajuda a evitar retrabalho.',
            pontos: ['Prompt vago → resultado genérico. Seja específico: tema, série, quantidade de slides e objetivo.',
                     'Copiar sem revisar → erros de fato e conteúdo inventado passam na frente da turma.',
                     'Texto em excesso → slide vira documento. Menos palavras, mais visual.',
                     'Ignorar acessibilidade → cores ruins e fonte pequena excluem alunos.'],
            dica: 'Use o "teste do 6": se houver mais de 6 palavras por linha ou 6 pontos por slide, corte.' } },

  { id: 62, mod: '1', color: 'blue', title: '📖 Leitura — glossário de design didático', type: 'leitura',
    body: { intro: 'Você não precisa ser designer para criar bons slides. Este mini-glossário resolve o essencial.',
            pontos: ['Hierarquia visual: o título é a maior fonte; o resto organiza o olhar.',
                     'Espaço negativo: o "vazio" que faz o design respirar — slide cheio cansa.',
                     'Contraste: diferença clara entre texto e fundo (leitura fácil).',
                     'Diagrama de fluxo: passo a passo visual para explicar processos.'],
            dica: 'Regra prática: uma ideia nova por slide; títulos afirmativos ("Reciclar na prática"), não perguntas vagas.' } },

  { id: 63, mod: '1', color: 'blue', title: '📖 Leitura — checklist de revisão antes de projetar', type: 'leitura',
    body: { intro: 'Cinco minutos de revisão evitam constrangimento e garantem qualidade. Faça isso em todo material gerado por IA.',
            pontos: ['Fatos e datas conferidos com fonte confiável.',
                     'Fonte grande o suficiente para a última fileira ler.',
                     'Cores com contraste e sem combinações que o daltonismo embaralha (ex.: verde/vermelho).',
                     'Nenhuma informação sensível ou identificável de alunos.',
                     'Uma pergunta de engajamento no fim para a turma.'],
            dica: 'Antes de projetar, leia em voz alta: se você tropeçar, a turma também vai tropeçar.' } },

  /* ---------------- MÓDULO 2 ---------------- */
  { id: 16, mod: '2', color: 'pink', title: 'Módulo 2 · Inclusão e AEE', type: 'section',
    body: 'Educação Especial, Inclusão e AEE' },

  { id: 17, mod: '2', color: 'pink', title: 'O que é CAA?', type: 'list',
    body: ['Comunicação Alternativa e Aumentativa: dar voz a quem tem dificuldade na fala ou escrita',
           'Pictogramas: desenhos-símbolos ao lado do texto',
           'Pranchas de comunicação, gestos e voz digitalizada',
           '1 símbolo por linha · frases curtas (3–6 palavras)',
           'Cores fixas por categoria (verbo sempre verde, lugar sempre azul)'] },

  { id: 18, mod: '2', color: 'pink', title: 'Prompt — Easy Read (língua fácil)', type: 'prompt',
    body: 'Reescreva o texto abaixo em língua fácil (Easy Read), para aluno com deficiência intelectual: frases de no máx 6 palavras, palavras simples, 1 ideia por linha.\n[TEXTO]' },

  { id: 19, mod: '2', color: 'pink', title: 'Prompt — pictogramas por frase', type: 'prompt',
    body: 'Para cada frase, sugira um pictograma (desenho simples) que ilustre a ideia.\nSaída: FRASE → pictograma.\n[1] Beba água. [2] Vá ao refeitório. [3] Vamos ler um livro.' },

  { id: 20, mod: '2', color: 'pink', title: 'Conceito complexo em passos visuais', type: 'prompt',
    body: 'Transforme o conceito [CONCEITO] em 5 passos simples, cada um com 1 frase curta + 1 imagem, para aluno com deficiência intelectual. Inclua um guia de progresso ("passo 1 de 5").\nExemplo — Ciclo da água: 1) O sol esquenta a água ☀️  2) A água vira névoa e sobe ☁️  3) A névoa vira nuvem  4) A nuvem chove 🌧️  5) A chuva volta para o rio 🌊' },

  { id: 21, mod: '2', color: 'pink', title: 'Design anti-sobrecarga (TEA/TDAH)', type: 'list',
    body: ['Cores neutras — fundo claro, sem neons',
           'Redução de poluentes visuais: sem animações piscantes',
           'Um item de cada vez — no máx 3 itens por lista',
           'Bordas e caixas claras para organizar por regiões',
           'Elementos previsíveis: mesma posição do título, mesmo estilo',
           'Fonte sem serifa e grande (Arial, Verdana)',
           'Para TDAH: âncoras visuais (✔ façamos, ✅ consegui) e pausas (alongar 30s)'] },

  { id: 22, mod: '2', color: 'pink', title: 'Prompt — rotina visual', type: 'prompt',
    body: 'Crie 6 slides de ROTINA (café da manhã → fim da aula) para aluno autista/TDAH: 1 imagem + 1 frase curta + ícone ✓ em cada um. Cores suaves, fundo claro, sem animações.' },

  { id: 23, mod: '2', color: 'pink', title: 'Prompt — quadro de antecipação', type: 'prompt',
    body: 'Monte um quadro de antecipação que mostre ANTES da aula a sequência de atividades, o número total de passos e um slide final "Falta 1!" quando perto do fim.' },

  { id: 24, mod: '2', color: 'pink', title: 'Prompt — slides de acalmo', type: 'prompt',
    body: 'Crie 3 slides de ACALMO: 1) "Responde com calma", 2) "Respiro devagar: inspire, segure, solte", 3) imagem tranquila com "Você consegue". Visual minimalista, cores azul/verde suaves.' },

  { id: 25, mod: '2', color: 'pink', title: 'Acessibilidade universal', type: 'list',
    body: ['Legendas: YouTube + PowerPoint (legendas em tempo real) e transcrição com IA',
           'Audiodescrição: narração curta que descreve cores, objeto, ação e cenário',
           'Alto contraste: preto/branco ou azul-escuro/amarelo-claro',
           'Evitar verde+vermelho (daltonismo) e azul+violeta juntos',
           'Fonte legível (≥ 20pt) e texto alternativo nas imagens'] },

  { id: 26, mod: '2', color: 'pink', title: 'Prompt — legendas / transcrição', type: 'prompt',
    body: 'Transforme o roteiro abaixo em boas legendas, quebrando a cada 2–3 segundos de leitura.\n[TEXTO]' },

  { id: 27, mod: '2', color: 'pink', title: 'Prompt — audiodescrição', type: 'prompt',
    body: 'Gere uma audiodescrição (máx 2 frases) desta imagem para uma pessoa cega: cores, objeto principal, ação e cenário. [DESCRIÇÃO OU ANEXO]' },

  { id: 28, mod: '2', color: 'pink', title: 'Prompt — alto contraste', type: 'prompt',
    body: 'Sugira uma paleta de ALTO CONTRASTE para slides acessíveis (ex.: azul-escuro + amarelo-claro, ou branco + preto grosso). Evite verde+vermelho (daltonismo) e azul+violeta. Dê códigos hex em pares seguros.' },

  { id: 29, mod: '2', color: 'pink', title: 'Checklist · Módulo 2', type: 'checklist',
    body: ['Adaptei 1 texto em língua fácil (Easy Read) com IA',
           'Criei slides com CAA/pictogramas para uma rotina ou conceito',
           'Produzi um quadro de antecipação/rotina visual para TEA',
           'Ajustei cores/fonte para não sobrecarregar alunos TDAH/TEA',
           'Adicionei legenda ou audiodescrição e alto contraste em um slide',
           'Confirmei com o professor do AEE se o material está adequado'] },

  { id: 64, mod: '2', color: 'pink', title: '📖 Leitura — guia da língua fácil, passo a passo', type: 'leitura',
    body: { intro: 'A "língua fácil" (Easy Read) torna o texto compreensível para quem tem deficiência intelectual, TEA ou está aprendendo. É um superpoder de inclusão.',
            pontos: ['Uma ideia por frase; frases curtas e diretas.',
                     'Palavras do dia a dia; explique termos difíceis na primeira vez.',
                     'Use pictograma ou imagem ao lado de cada ideia importante.',
                     'Divida o texto com títulos e listas curtas.',
                     'Confirme se o aluno entendeu: pergunte, não presuma.'],
            dica: 'Dê um prompt: "reescreva este texto em linguagem fácil, 1 ideia por frase, para aluno com deficiência intelectual".' } },

  { id: 65, mod: '2', color: 'pink', title: '📖 Leitura — como construir uma rotina visual', type: 'leitura',
    body: { intro: 'Alunos com TEA se organizam melhor quando sabem o que vem depois. Uma rotina visual reduz a ansiedade de antecipação.',
            pontos: ['Liste os passos da aula em ordem (o que vem antes e depois).',
                     'Represente cada etapa com ícone, foto ou pictograma.',
                     'Faça o quadro de antecipação: "hoje teremos: abertura, conteúdo, atividade, encerramento".',
                     'Avise mudanças fora da rotina com antecedência.',
                     'Inclua o "depois da aula" (ex.: onde ir, próximo horário).'],
            dica: 'Imprima e plastifique a rotina; assim ela dura o ano inteiro e fica à altura dos olhos.' } },

  { id: 66, mod: '2', color: 'pink', title: '📖 Leitura — sinais de sobrecarga sensorial', type: 'leitura',
    body: { intro: 'Identificar os sinais de sobrecarga em alunos com TEA/TDAH permite agir antes da crise. A sobrecarga depende do excesso de estímulos.',
            pontos: ['Sinais comuns: tapar os ouvidos, agitação, irritabilidade, querer sair, ficar "congelado".',
                     'Causas típicas: barulho alto, luz forte, muita informação na tela, fila e pressa.',
                     'Prevenção: ambiente calmo, avisos prévios, pausas programadas.',
                     '"Área calma": um canto com menos estímulo onde o aluno pode se autorregular.'],
            dica: 'Combine com a turma um "sinal de pausa" para pedir silêncio sem gritar — o semáforo da sala já ajuda.' } },

  { id: 67, mod: '2', color: 'pink', title: '📖 Leitura — mitos do AEE (Atendimento Educacional Especializado)', type: 'leitura',
    body: { intro: 'Conhecer o que o AEE é (e o que não é) evita erros na sala comum e valoriza a parceria com a sala de recursos.',
            pontos: ['Não é substituto da aula comum: é complementar e articulado com o professor.',
                     'Não é só "reforço escolar": atua na acessibilidade curricular, metodologias e recursos.',
                     'O professor do AEE é parceiro: planeje com ele, não contra ele.',
                     'Material adaptado (pictogramas, língua fácil) também beneficia quem não tem laudo.'],
            dica: 'Convide o professor do AEE a revisar 1 material seu — a conversa melhora a prática dos dois.' } },

  { id: 68, mod: '2', color: 'pink', title: '📖 Leitura — lista de verificação do AEE', type: 'leitura',
    body: { intro: 'Uma checagem rápida para saber se seu material e sua aula acolhem a diversidade.',
            pontos: ['Há representação diversa nas imagens e exemplos?',
                     'Instruções são curtas, claras e repetidas?',
                     'Uso de múltiplos canais: fala, imagem, escrita e movimento?',
                     'Existe apoio extra (parceria, monitor, material adaptado) para quem precisa?',
                     'Avisei a turma sobre mudanças e combinados?'],
            dica: 'Universal Design for Learning (UDL): dê opções para aprender, expressar e se motivar — todos ganham.' } },

  /* ---------------- MÓDULO 3 ---------------- */
  { id: 30, mod: '3', color: 'green', title: 'Módulo 3 · IA na Prática', type: 'section',
    body: 'IA na Prática Escolar e Engajamento dos Alunos' },

  { id: 31, mod: '3', color: 'green', title: 'Os 5 usos saudáveis da IA', type: 'list',
    body: ['Mapear conteúdo → pedir um mapa mental do capítulo',
           'Resumir → resumo de um texto em 5 tópicos',
           'Simulados → gerar prova-teste',
           'Tirar dúvidas → "explique como se eu tivesse 12 anos"',
           'Praticar → o aluno resolve PRIMEIRO, a IA CORRIGE depois'] },

  { id: 32, mod: '3', color: 'green', title: 'Regra de ouro para o aluno', type: 'list',
    body: ['Peça explicação, não resposta',
           'Faça antes, use a IA para corrigir depois',
           'Confira a resposta da IA com um livro ou com o professor',
           'Escreva as conclusões com as suas próprias palavras'] },

  { id: 33, mod: '3', color: 'green', title: 'Prompt — tutora de estudos', type: 'prompt',
    body: 'Atue como monitor de estudos do [fundamental/médio]. Pergunte em que assunto preciso de ajuda e faça 3-4 perguntas de múltipla escolha. Quando eu responder, explique o que errei de forma simples, com um exemplo. Nunca dê a resposta antes de eu tentar.' },

  { id: 34, mod: '3', color: 'green', title: 'Atividade — mapa mental com IA', type: 'list',
    body: ['Passo 1: escolher um texto da disciplina',
           'Passo 2: aluno pede um resumo de 5 tópicos',
           'Passo 3: aluno REFAZ o resumo com as próprias palavras (não copia)',
           'Passo 4: compara com o original e marca o que faltou',
           'Passo 5: professor corrige e conversa sobre o que a IA acertou/errou'] },

  { id: 35, mod: '3', color: 'green', title: 'Prompt — autoria assistida (sem plagiar)', type: 'prompt',
    body: 'Preciso criar um trabalho sobre [TEMA]. Não escreva pra mim: 1) faça um roteiro de 5 partes; 2) me dê 3 perguntas para eu pesquisar; 3) quando eu te mandar meu texto, me dê 3 críticas para melhorar. Vou usar tudo com minhas palavras e te citar.' },

  { id: 36, mod: '3', color: 'green', title: 'Sinais de alerta — texto 100% IA', type: 'list',
    body: ['Vocabulário repetitivo e "perfeito demais", sem voz pessoal',
           'Falta de exemplos pessoais, erros ou ironias naturais',
           'Estrutura genérica (Introdução / Desenvolvimento / Conclusão) sem aprofundamento',
           'Citações inventadas — a IA pode alucinar fontes falsas!',
           'Respostas rápidas demais e idênticas às da ferramenta'] },

  { id: 37, mod: '3', color: 'green', title: 'Detectores de IA: como funcionam', type: 'list',
    body: ['Copyleaks e GPTZero medem perplexidade e burstiness (o quão previsível é o texto)',
           'Textos formais ou de não nativos podem gerar FALSOS POSITIVOS',
           'NÃO são prova oficial — não use sozinhos para punir',
           'O detector sinaliza suspeita; a conversa e os rascunhos confirmam'] },

  { id: 38, mod: '3', color: 'green', title: 'Prompt — diagnóstico leve (sem punir)', type: 'prompt',
    body: 'Avalie este texto para dizer o quão provável foi escrito por IA, de forma leve. Me dê 3 marcas a favor de IA e 3 a favor de humano, e um veredito equilibrado. Indique como confirmar com o aluno (perguntas de defesa oral).\n[TEXTO]' },

  { id: 39, mod: '3', color: 'green', title: 'Estratégias à prova de IA', type: 'list',
    body: ['Defesa oral (10 a 15 perguntas) — o aluno explica o próprio trabalho',
           'Análise crítica: refutar e comparar fontes, não só descrever',
           'Aplicação prática: resolver um problema novo do contexto local',
           'Reflexão pessoal: ligar o conteúdo à vivência do aluno',
           'Processo: entregas por etapas (rascunho, mapa, reescrita)',
           'Conferência bibliográfica: citações que O ALUNO confira'] },

  { id: 40, mod: '3', color: 'green', title: 'Rubrica de avaliação', type: 'table',
    body: { head: ['Critério', 'Excelente (3)', 'Bom (2)', 'Precisa melhorar (1)'],
            rows: [['Pensamento próprio', 'Ideia nova e diferenciação', 'Decisões próprias', 'Reproduz a IA'],
                   ['Fontes', 'Cita fontes reais e variadas', 'Algumas fontes', 'Fontes inventadas/nenhuma'],
                   ['Defesa oral', 'Responde com profundidade', 'Responde o básico', 'Não domina'],
                   ['Aplicação', 'Exemplo da realidade local', 'Exemplo geral', 'Sem exemplo']] } },

  { id: 41, mod: '3', color: 'green', title: 'Prompt — rubrica à prova de IA', type: 'prompt',
    body: 'Faça uma rubrica para a avaliação sobre [TEMA], com 4 critérios e 3 níveis (Excelente/Neutro/Precisa melhorar) que exijam: exemplo da comunidade, fonte verificada e defesa pessoal. Saída em tabela, linguagem simples.' },

  { id: 42, mod: '3', color: 'green', title: 'Checklist · Módulo 3', type: 'checklist',
    body: ['Dei aos alunos um guia de "uso saudável" da IA (explicação, não resposta)',
           'Apliquei 1 aula prática de "mapa mental com IA"',
           'Entendo como o detector funciona e suas limitações (falsos positivos)',
           'Criei 1 rubrica de avaliação',
           'Redesenhei 1 avaliação para incluir defesa oral e aplicação prática'] },

  { id: 69, mod: '3', color: 'green', title: '📖 Leitura — IA como tutora em casa: roteiro para o aluno', type: 'leitura',
    body: { intro: 'Ensine o aluno a usar a IA como tutora que EXPLICA, e não que entrega a resposta. Este roteiro vira material para levar para casa.',
            pontos: ['Passo 1 — peça para EXPLICAR o conceito ("explique fotossíntese como se eu tivesse 12 anos").',
                     'Passo 2 — peça 1 exemplo do cotidiano.',
                     'Passo 3 — peça 2 perguntas para você testar o que entendeu (e responda!).',
                     'Passo 4 — só então, confira sua resposta com a IA.',
                     'Regra: quem faz a pergunta e decide se entendeu é o aluno, não a máquina.'],
            dica: 'Dê aos alunos o "contrato da tutora": a IA explica e pergunta; ela nunca faz o trabalho no lugar de vocês.' } },

  { id: 70, mod: '3', color: 'green', title: '📖 Leitura — o que são os detectores de IA (e seus limites)', type: 'leitura',
    body: { intro: 'Ferramentas como Copyleaks e GPTZero tentam identificar texto gerado por IA, mas não são infalíveis. Entender isso evita acusações injustas.',
            pontos: ['Detectores usam padrões e pontuação para estimar, não "certeza".',
                     'Falsos positivos: texto escrito por humano (especialmente não-nativo ou técnico) pode ser marcado como IA.',
                     'Eles erram com textos curtos e com texto editado.',
                     'Nunca acuse um aluno só pelo detector: converse e peça explicação.'],
            dica: 'Combine avaliações "à prova de IA" (defesa oral, aplicação prática) em vez de confiar só no detector.' } },

  { id: 71, mod: '3', color: 'green', title: '📖 Leitura — como dar feedback sobre um trabalho feito com IA', type: 'leitura',
    body: { intro: 'Se o aluno usou IA, o foco não é proibir, é ensinar a usar bem. O feedback valoriza o processo, não só o produto.',
            pontos: ['Pergunte "como você fez?" antes de julgar o resultado.',
                     'Valorize a revisão: onde ele ajustou o texto da IA e por quê.',
                     'Peça que explique 1 parte do próprio trabalho — a defesa mostra o aprendizado real.',
                     'Dê próxima etapa: "melhore este trecho com sua voz".'],
            dica: 'Pergunta-chave: "que parte deste texto é sua e por quê?" — isso separa quem estudou de quem só copiou.' } },

  { id: 72, mod: '3', color: 'green', title: '📖 Leitura — ética na linguagem do aluno', type: 'leitura',
    body: { intro: 'A ética com IA também é sobre linguagem: ensinar o aluno a citar, a ser crítico e a não enganar. Um contrato de uso ajuda.',
            pontos: ['Citar quando usou IA (como se cita uma fonte).',
                     'Saber que IA pode errar: "confira antes de acreditar".',
                     'Não usar IA para enganar o colega ou o professor.',
                     'Trazer a pergunta (o que não sabe) é mais valioso que a resposta pronta.'],
            dica: 'Prompts de "uso justo": peça ao aluno para mudar o texto para a própria voz e explicar as mudanças.' } },

  { id: 73, mod: '3', color: 'green', title: '📖 Leitura — guia da defesa oral à prova de IA', type: 'leitura',
    body: { intro: 'A defesa oral é a forma mais justa de avaliar: cada aluno explica o que fez, e a IA não fala por ninguém.',
            pontos: ['Peça 2–3 minutos de fala sobre o próprio trabalho.',
                     'Faça perguntas de aprofundamento ("por que escolheu isso?", "o que você aprendeu?").',
                     'Use a rubrica: domínio, clareza, exemplos próprios, reflexão.',
                     'Combine a nota: processo + defesa + produto.',
                     'Deixe espaço para quem tem ansiedade de falar (roteiro ou opções escritas).'],
            dica: 'Defesa não é "prova oral": é chance de o aluno mostrar o que sabe sem cola.' } },

  /* ---------------- MÓDULO 4 ---------------- */
  { id: 43, mod: '4', color: 'amber', title: 'Módulo 4 · Gestão de Sala', type: 'section',
    body: 'Gestão de Sala de Aula e Alunos Rebeldes/Desengajados' },

{ id: 82, mod: '4', color: 'amber', title: 'Comece pelo essencial na gestão de turma', type: 'list',
    body: ['Menos regras, mais combinados construídos COM a turma e relidos toda semana.',
           'Rotina previsível reduz a ansiedade e a indisciplina de quase todo mundo.',
           'Use voz e corpo como ferramenta de atenção — sinal combinado e semáforo.',
           'Reconheça o esforço específico, e não apenas a nota final.',
           'Tenha um plano B: uma atividade "coringa" pronta para emergências.',
           'Cuide de você: um professor esgotado não consegue acolher ninguém.'] },
  { id: 44, mod: '4', color: 'amber', title: 'O que gera conflito e apatia?', type: 'list',
    body: ['Aula monótona e sem contexto',
           'Aluno se sente invisível ou punido',
           'Falta de previsibilidade (regras vagas)',
           'Excesso de exposição do professor ("quadro e vô")',
           'A IA ajuda a CRIAR o que engaja — a relação e a constância são suas'] },

  { id: 45, mod: '4', color: 'amber', title: 'Prompt — quebra-gelo de 5 minutos', type: 'prompt',
    body: 'Crie 5 dinâmicas de abertura de 5 minutos para turma de [SEGMENTO] sobre [TEMA], misturadas e divertidas, que façam todos falarem com o colega sem escrever.\nSaída: nome da dinâmica, 1 frase de instrução, material (nenhum).' },

  { id: 46, mod: '4', color: 'amber', title: 'Prompt — quiz educativo', type: 'prompt',
    body: 'Crie um quiz de 8 perguntas sobre [TEMA] para o [SEGMENTO], com 3 alternativas cada, marcando a correta. Adicione 1 pergunta-surpresa que valha bônus.' },

  { id: 47, mod: '4', color: 'amber', title: 'Prompt — storytelling interativo', type: 'prompt',
    body: 'Monte uma história interativa sobre [TEMA] para o [SEGMENTO]. A cada 2 parágrafos, dê 2 opções ao aluno (A/B). Inclua 3 finais possíveis ligados ao conteúdo.' },

  { id: 48, mod: '4', color: 'amber', title: 'Prompt — caça ao tesouro', type: 'prompt',
    body: 'Crie uma "Caça ao Tesouro" para revisar [TEMA]: 5 pistas/enigmas, cada resposta certa dá a próxima. Para o [SEGMENTO]. Tom de desafio.' },

  { id: 49, mod: '4', color: 'amber', title: 'O mesmo tema em 3 níveis', type: 'table',
    body: { head: ['Nível', 'Aluno', 'Foco', 'Estratégia'],
            rows: [['Nível 1', 'Defasado', 'Consolidar base', 'Pouco texto, passos, imagens, vocabulário simples'],
                   ['Nível 2', 'Turma média', 'Aplicar', 'Questões intermediárias, exemplos'],
                   ['Nível 3', 'Avançado', 'Desafiar/criticar', 'Problemas complexos, pesquisa, criação']] } },

  { id: 50, mod: '4', color: 'amber', title: 'Prompt — 3 níveis na mesma turma', type: 'prompt',
    body: 'Escreva o mesmo assunto [TEMA] para o [SEGMENTO] em 3 níveis de dificuldade NA MESMA turma: Nível 1 (fundamento, linguagem fácil, poucos passos), Nível 2 (intermediário, com exemplos), Nível 3 (avançado, com problema investigativo e criação). Para cada nível dê: 1 explicação, 2 exercícios e 1 desafio.' },

  { id: 51, mod: '4', color: 'amber', title: 'Exemplo — frações em 3 níveis', type: 'list',
    body: ['Nível 1: "O que é metade? Divida essa pizza em 2" (atividade de recorte)',
           'Nível 2: "Some 1/2 + 1/4 desenhando barras"',
           'Nível 3: "Prove se 3/4 > 2/3 sem cálculo. Crie 1 receita que use 3/4 e 2/3"',
           'Arquitetura por níveis: quem termina o nível 1 ajuda colegas; nível 3 vira "consulta especialista"'] },

  { id: 52, mod: '4', color: 'amber', title: 'Combinados — contrato em 4 passos', type: 'list',
    body: ['1. Levantar ideias com a turma ("o que precisamos combinar para a aula ser legal?")',
           '2. Traduzir em frases curtas e POSITIVAS ("falar sem gritar", não "não gritar")',
           '3. Ilustrar com IA: ícones, símbolos, gestos',
           '4. Pactuar e revisar: todos assinam — vira "nossa constituição"'] },

  { id: 53, mod: '4', color: 'amber', title: 'Prompt — combinados da turma', type: 'prompt',
    body: 'Crie 6 slides de "Combinados da Turma" para o [SEGMENTO], cada um com 1 regra em frase POSITIVA e 1 ícone grande (ex.: "Levantar o dedo para falar", "Errar ajuda a aprender"). Tom leve, cores alegres, letras grandes.' },

  { id: 54, mod: '4', color: 'amber', title: 'Jogos para pactuar regras', type: 'list',
    body: ['Semáforo da sala: verde = todos falam, amarelo = um por vez, vermelho = silêncio',
           'Bingo dos combinados: a turma ganha bônus ao cumprir 3 regras por semana',
           'Desafio 30s: resolver 1 cálculo no quadro sem celular e marcar o progresso'] },

  { id: 55, mod: '4', color: 'amber', title: 'Prompt — bingo dos combinados', type: 'prompt',
    body: 'Crie o jogo "Bingo dos combinados" com 9 regras (cartela 3x3), 1 ícone por regra. Explique como marcar e qual o prêmio coletivo (ex: +10min de recreio).' },

  { id: 56, mod: '4', color: 'amber', title: 'Checklist · Módulo 4', type: 'checklist',
    body: ['Criei 1 dinâmica ou quebra-gelo com IA',
           'Fiz 1 storytelling interativo / jogo para o conteúdo',
           'Adaptei o MESMO tema em 3 níveis e entreguei à turma',
           'Pactuei os combinados em slides com frases positivas e ícones',
           'Apliquei 1 "Bingo dos combinados" ou outro jogo de regras'] },

  { id: 74, mod: '4', color: 'amber', title: '📖 Leitura — o que há por trás do comportamento', type: 'leitura',
    body: { intro: 'Antes de "conter" o aluno, vale perguntar o que o comportamento comunica. Muitas vezes é uma necessidade não atendida.',
            pontos: ['Comportamento é comunicação: cansaço, fome, tédio, necessidade de atenção ou de pertencimento.',
                     'Separar a pessoa do comportamento: critico a atitude, não o aluno.',
                     'Buscar o contexto: o que mudou na rotina, na família, na sala?',
                     'Dar papel de liderança produtiva transforma rebeldia em engajamento.'],
            dica: 'Tente o "diagnóstico de 3 perguntas" com o aluno: o que te incomoda? o que você precisa? como podemos trabalhar juntos?' } },

  { id: 75, mod: '4', color: 'amber', title: '📖 Leitura — plano de contingência para dias difíceis', type: 'leitura',
    body: { intro: 'Todo professor tem dias difíceis. Ter um "plano B" pronto evita que você reaja no impulso e mantém a aula viva.',
            pontos: ['Tenha 1 atividade "coringa" que funciona em qualquer turma (jogo curto, debate, dinâmica).',
                     'Roteiro de respiração de emergência: parar, respirar, responder (não reagir).',
                     'Defina sinais de pausa combinados com a turma.',
                     'Seja honesto: "hoje estou cansado, vamos fazer assim" humaniza e conecta.'],
            dica: 'Monte uma "pasta de socorro" com 3 atividades rápidas e 1 dinâmica engajadora para emergências.' } },

  { id: 76, mod: '4', color: 'amber', title: '📖 Leitura — combinados que realmente funcionam', type: 'leitura',
    body: { intro: 'Um combinado só entra quando a turma participa de criar, entende o porquê e vê a consequência de forma justa.',
            pontos: ['Construídos COM a turma, não impostos.',
                     'Poucos, claros e em frases positivas ("falar um por vez", não "não gritar").',
                     'Visual (ícones, cores) e revisitados toda semana.',
                     'Consequências combinadas e aplicadas de forma consistente.'],
            dica: 'Transforme em contrato visual: um slide com os 5 combinados + ícones que a turma "assina" (ou marca presença).' } },

  { id: 77, mod: '4', color: 'amber', title: '📖 Leitura — jogos de engajamento por faixa etária', type: 'leitura',
    body: { intro: 'A gamificação precisa casar com a maturidade da turma. Nem todo jogo funciona com qualquer idade.',
            pontos: ['Educação Infantil/Anos Iniciais: jogos com movimento e cores, recompensa coletiva.',
                     'Anos Finais: desafios em grupo, pontuação, storytelling interativo.',
                     'Ensino Médio: problemas reais, debates e protagonismo (evite prêmios infantis).',
                     'Sempre vincule o jogo ao conteúdo: jogar por jogar não ensina.'],
            dica: 'Use o "bingo dos combinados", "desafio 30s" ou "caça ao tesouro" já prontos nos decks d5 e d6.' } },

  { id: 78, mod: '4', color: 'amber', title: '📖 Leitura — guia de estudo deste curso', type: 'leitura',
    body: { intro: 'Este curso funciona no seu ritmo. Use este guia para não se perder e não acumular: menos é mais.',
            pontos: ['Escolha 1 entrega por semana e aplique em sala antes de seguir.',
                     'Use o banco de prompts para economizar tempo.',
                     'Revise os checklists de cada módulo ao terminar.',
                     'Leia os slides de leitura (📖) quando tiver tempo — eles aprofundam.',
                     'Use o menu "Continuar curso" para voltar de onde parou.'],
            dica: 'Não tente fazer tudo de uma vez: o curso foi desenhado para ser percorrido no seu ritmo, sem sobrecarga.' } },

  /* ---------------- ENCERRAMENTO ---------------- */
  { id: 57, mod: 'fim', color: 'dark', title: 'Encerramento', type: 'section',
    body: 'Você está pronto para ser Professor do Futuro' },

  { id: 58, mod: 'fim', color: 'dark', title: 'Seus próximos passos', type: 'list',
    body: ['Escolha 1 tema da próxima semana e gere os slides com IA',
           'Adapte 1 material para inclusão (CAA ou leitura fácil)',
           'Monte 1 avaliação à prova de IA com defesa oral',
           'Pactue os combinados da turma em slides',
           'Use o banco de prompts — são 58 prompts prontos'] },

  { id: 59, mod: 'fim', color: 'dark', title: 'Bons estudos! 🎓✨', type: 'list',
    body: ['Professor do Futuro — da Educação Infantil ao Ensino Médio',
           'Inclusão, IA e gestão: a tecnologia a serviço da sua aula',
           'Acesse os módulos completos em modulos.html',
           'E o banco de prompts em prompts.html'] }

];
