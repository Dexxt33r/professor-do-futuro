/* ============================================================
   PROFESSOR DO FUTURO — gerar-atividade / prompt.ts
   ------------------------------------------------------------
   Lógica PURA (sem rede, sem Deno.*): monta o prompt pedagógico,
   o esquema JSON de resposta e NORMALIZA o que a IA devolve.

   Fica separado do index.ts de propósito: assim dá para testar
   no Node (backend/test/atividade.test.mjs) sem precisar de
   internet nem de chave de API.
   ============================================================ */

export interface Pedido {
  disciplina: string;      // ex.: História, Matemática, Ciências
  ano: string;             // ex.: 5º ano do Ensino Fundamental
  tema: string;            // ex.: Revolução Francesa, Frações, Fotossíntese
  tipo: string;            // ver TIPOS abaixo
  quantidade: number;      // nº de questões da folha
  adaptaTdahTea: boolean;  // "Adaptada para TDAH/Autismo"
  adaptaVisual: boolean;   // "Com imagens/pictogramas e espaçamento amplo"
  incluirGabarito: boolean;// folha do professor com respostas
  observacoes: string;     // recados do professor (opcional)
}

export interface Questao {
  numero: number;
  enunciado: string;
  tipo: string;                    // multipla_escolha | dissertativa | completar | ligar
  alternativas: string[];          // só quando multipla_escolha (3 a 5)
  correta: number | null;          // índice da alternativa correta (0 = A)
  resposta_esperada: string;       // para o gabarito (dissertativas)
  linhas_resposta: number;         // 0 = não precisa de linhas
  dica: string;                    // apoio para o aluno (opcional)
  pictograma: string;              // emoji de apoio visual
}

export interface Atividade {
  titulo: string;
  objetivo: string;
  habilidade: string;
  tempo_min: number;
  texto_apoio: { titulo: string; paragrafos: string[] } | null;
  instrucoes: string[];
  palavras_chave: string[];
  questoes: Questao[];
  caca_palavras: { palavras: string[]; instrucao: string } | null;
  adaptacoes: string[];
  acessibilidade: string[];
  gabarito: { numero: number; resposta: string; comentario: string }[];
  observacoes: string[];
  revisao: string;                 // aviso para o professor revisar fatos
}

/* ---------- Tipos de atividade oferecidos no formulário ---------- */
export const TIPOS: Record<string, { nome: string; guia: string }> = {
  multipla: {
    nome: 'Múltipla escolha',
    guia: 'Todas as questões com 4 alternativas (A–D) e apenas uma correta. Alternativas plausíveis, sem pegadinha e sem "todas as anteriores".',
  },
  dissertativa: {
    nome: 'Questões dissertativas',
    guia: 'Questões abertas, cada uma pedindo 1 resposta curta (3 a 6 linhas). Enunciados com comando claro: explique, compare, calcule, justifique.',
  },
  caca_palavras: {
    nome: 'Caça-palavras',
    guia: 'Caça-palavras com 8 a 12 palavras-chave do tema (uma palavra, sem acento, sem espaço) e questões curtas de ligação entre cada palavra e o conceito.',
  },
  texto_perguntas: {
    nome: 'Texto explicativo com perguntas',
    guia: 'Um texto de apoio curto (3 a 5 parágrafos, linguagem do ano/série) seguido de perguntas de compreensão e de aplicação sobre o texto.',
  },
  mista: {
    nome: 'Mista (múltipla escolha + dissertativa + desafio)',
    guia: 'Combine múltipla escolha (metade), dissertativas (metade) e feche com 1 desafio de aplicação que conecte o tema ao cotidiano do aluno.',
  },
};

/* ---------- Esquema JSON exigido da IA (formato Gemini/OpenAPI) ---------- */
export const ESQUEMA_RESPOSTA = {
  type: 'object',
  properties: {
    titulo: { type: 'string' },
    objetivo: { type: 'string' },
    habilidade: { type: 'string' },
    tempo_min: { type: 'integer' },
    texto_apoio: {
      type: 'object',
      properties: {
        titulo: { type: 'string' },
        paragrafos: { type: 'array', items: { type: 'string' } },
      },
      required: ['titulo', 'paragrafos'],
    },
    instrucoes: { type: 'array', items: { type: 'string' } },
    palavras_chave: { type: 'array', items: { type: 'string' } },
    questoes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          enunciado: { type: 'string' },
          tipo: { type: 'string', enum: ['multipla_escolha', 'dissertativa', 'completar', 'ligar'] },
          alternativas: { type: 'array', items: { type: 'string' } },
          correta: { type: 'integer' },
          resposta_esperada: { type: 'string' },
          linhas_resposta: { type: 'integer' },
          dica: { type: 'string' },
          pictograma: { type: 'string' },
        },
        required: ['enunciado', 'tipo'],
      },
    },
    caca_palavras: {
      type: 'object',
      properties: {
        palavras: { type: 'array', items: { type: 'string' } },
        instrucao: { type: 'string' },
      },
      required: ['palavras'],
    },
    adaptacoes: { type: 'array', items: { type: 'string' } },
    acessibilidade: { type: 'array', items: { type: 'string' } },
    gabarito: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          numero: { type: 'integer' },
          resposta: { type: 'string' },
          comentario: { type: 'string' },
        },
        required: ['numero', 'resposta'],
      },
    },
    observacoes: { type: 'array', items: { type: 'string' } },
  },
  required: ['titulo', 'questoes'],
} as const;

/* ============================================================
   MONTAGEM DO PROMPT — o "professor do futuro" instruindo a IA
   ============================================================ */
function promptBase(p: Pedido): string {
  const tipo = TIPOS[p.tipo] || TIPOS.mista;
  const quant = clampInt(p.quantidade, 3, 20, 8);

  const l: string[] = [];
  l.push('Você é um professor brasileiro experiente, especialista em didática, em avaliação da aprendizagem e em educação inclusiva (AEE).');
  l.push('Sua tarefa é ESCREVER UMA ATIVIDADE ESCOLAR PRONTA PARA IMPRESSÃO (folha A4) e responder SOMENTE com JSON válido, no esquema pedido.');
  l.push('');
  l.push('=== DADOS DA ATIVIDADE ===');
  l.push('- Disciplina/matéria: ' + p.disciplina);
  l.push('- Ano/série: ' + p.ano);
  l.push('- Tema principal da aula: ' + p.tema);
  l.push('- Tipo de atividade: ' + tipo.nome);
  l.push('- Quantidade de questões: ' + quant);
  if (p.observacoes && p.observacoes.trim()) {
    l.push('- Observações do professor: ' + p.observacoes.trim());
  }
  l.push('');
  l.push('=== COMO ESCREVER O CONTEÚDO ===');
  l.push('- Linguagem EXATAMENTE na altura do ano/série informado: frases curtas, vocabulário conhecido, zero jargão acadêmico.');
  l.push('- O texto de apoio (campo "texto_apoio") explica o tema em 3 a 5 parágrafos curtos e deve bastar para o aluno resolver a folha (o aluno não vai consultar o livro).');
  l.push('- Foco no essencial do tema: fatos corretos, exemplos do cotidiano brasileiro, 1 analogia simples.');
  l.push('- ' + tipo.guia);
  l.push('- Cada questão precisa de um comando claro ("Explique...", "Calcule...", "Marque a alternativa...", "Complete...").');
  l.push('- Nas dissertativas, "linhas_resposta" entre 3 e 6 (é o espaço de escrita no papel). Nas de múltipla escolha, "linhas_resposta" = 0.');
  l.push('- Em "alternativas" use de 3 a 4 opções e informe "correta" com o índice (0 = primeira alternativa). Sem alternativas repetidas e sem negativas ambíguas.');
  l.push('- Cada questão deve ter "resposta_esperada" (em 1 a 3 frases) — é o gabarito do professor — e um "pictograma" (1 emoji que represente a questão).');
  l.push('- "palavras_chave": de 8 a 12 palavras do tema, em MAIÚSCULAS, sem acento, sem espaço e com no máximo 12 letras (elas vão para o caça-palavras e para o vocabulário da folha).');
  l.push('- "instrucoes": 3 a 5 passos numeráveis de como fazer a atividade (na voz do professor, para o aluno).');
  l.push('- "habilidade": 1 frase descrevendo a habilidade trabalhada (descrição pedagógica; NÃO invente código de BNCC).');
  l.push('- "tempo_min": tempo realista em minutos para o aluno concluir a folha.');
  return l.join('\n');
}

/* ---------- instruções extras: inclusão, adaptação e regras finais ---------- */
export function instrucoesInclusao(p: Pedido): string[] {
  const l: string[] = [];
  const quant = clampInt(p.quantidade, 3, 20, 8);
  l.push('');
  l.push('=== INCLUSÃO E ADAPTAÇÃO (obrigatório) ===');
  if (p.adaptaTdahTea) {
    l.push('- ATIVIDADE ADAPTADA PARA TDAH/AUTISMO (TEA): comandos em UMA frase curta e direta; uma instrução por vez; nada de "observe a figura e... além disso";');
    l.push('  use marcadores visuais (setas, numeração, pictogramas), destaques em **negrito** nos verbos de comando e previsibilidade (a folha segue sempre a mesma ordem).');
    l.push('  No campo "adaptacoes", liste as decisões de design que você tomou para o aluno com TDAH/TEA.');
  } else {
    l.push('- Sem rótulo de diagnóstico: mantenha comandos curtos e previsíveis (bom para toda a turma).');
    l.push('- No campo "adaptacoes", liste ajustes leves de clareza que você já aplicou.');
  }
  if (p.adaptaVisual) {
    l.push('- COM IMAGENS/ESPAÇAMENTO AMPLO: cada questão começa com um pictograma emoji, use no máximo 2 frases por enunciado,');
    l.push('  e indique "linhas_resposta" generoso (1 linha extra). Nada de texto corrido denso nem tabela apertada.');
  }
  l.push('- Em "acessibilidade", liste 3 a 5 orientações de impressão/acesso (ex.: "imprimir em fonte 14 e folha A4", "ler o enunciado em voz alta", "usar alto contraste").');
  l.push('- Inclua no texto de apoio pelo menos 1 exemplo concreto e 1 pergunta de conexão com a vida do aluno.');
  l.push(p.incluirGabarito
    ? '- A folha terá uma SEGUNDA página só do professor com o gabarito: preencha "gabarito" com todas as questões (numero, resposta, comentario com o erro mais comum).'
    : '- Preencha "gabarito" mesmo assim (uso interno do professor), com respostas curtas.');
  l.push('');
  l.push('=== REGRAS FINAIS ===');
  l.push('- Responda APENAS com o objeto JSON (sem markdown, sem comentários, sem texto antes ou depois).');
  l.push('- NÃO invente citações, leis, datas ou dados duvidosos. Se algo for incerto, prefira uma formulação geral.');
  l.push('- Não escreva nome de aluno, de escola nem dado pessoal.');
  l.push('- O campo "revisao" deve conter exatamente: "Material gerado por IA a partir de um pedido do professor. Revise fatos e datas antes de aplicar."');
  l.push('- Quantidade de questões: exatamente ' + quant + ' no array "questoes".');
  if (p.tipo === 'caca_palavras') {
    l.push('- Preencha também "caca_palavras" com as 8 a 12 palavras (sem acento, maiúsculas) e uma instrução curta.');
  }
  return l;
}

/* Prompt completo = base + regras de inclusão/adaptação */
export function montarPrompt(p: Pedido): string {
  return [promptBase(p), instrucoesInclusao(p).join('\n')].join('\n');
}

/* ============================================================
   NORMALIZAÇÃO — garante que o front-end nunca receba lixo
   ============================================================ */

export function limparJson(textoBruto: string): unknown {
  if (!textoBruto) throw new Error('Resposta vazia da IA.');
  let t = String(textoBruto).trim();
  // remove cercas de markdown (```json ... ```)
  t = t.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(t); } catch (_) { /* tenta recortar abaixo */ }
  const ini = t.indexOf('{');
  const fim = t.lastIndexOf('}');
  if (ini === -1 || fim <= ini) throw new Error('A IA não devolveu JSON.');
  return JSON.parse(t.slice(ini, fim + 1));
}

function txt(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function listaStrings(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) {
    const s = txt(item);
    if (s) out.push(s);
    if (out.length >= max) break;
  }
  return out;
}

export function clampInt(v: unknown, min: number, max: number, padrao: number): number {
  const n = Math.round(Number(v));
  if (!isFinite(n)) return padrao;
  return Math.min(max, Math.max(min, n));
}

export function normalizarAtividade(bruto: unknown, p: Pedido): Atividade {
  const b = (bruto && typeof bruto === 'object') ? bruto as Record<string, unknown> : {};
  const quant = clampInt(p.quantidade, 3, 20, 8);

  // ---------- questões ----------
  const brutoQ = Array.isArray(b.questoes) ? b.questoes as Record<string, unknown>[] : [];
  const questoes: Questao[] = [];
  for (const q of brutoQ.slice(0, quant)) {
    if (!q || typeof q !== 'object') continue;
    const alts = listaStrings(q.alternativas, 5);
    const ehMultipla = txt(q.tipo) === 'multipla_escolha' || alts.length > 1;
    let correta = Number(q.correta);
    if (!isFinite(correta) || correta < 0 || correta >= alts.length) correta = 0;
    const n = questoes.length + 1;
    questoes.push({
      numero: n,
      enunciado: txt(q.enunciado) || ('Questão ' + n + ': escreva com suas palavras o que você aprendeu sobre ' + p.tema + '.'),
      tipo: ehMultipla ? 'multipla_escolha' : (txt(q.tipo) || 'dissertativa'),
      alternativas: ehMultipla ? alts : [],
      correta: (ehMultipla && alts.length) ? correta : null,
      resposta_esperada: txt(q.resposta_esperada),
      linhas_resposta: ehMultipla ? 0 : clampInt(q.linhas_resposta, 0, 10, 4),
      dica: txt(q.dica),
      pictograma: txt(q.pictograma) || (ehMultipla ? '🔤' : '✍️'),
    });
  }

  // ---------- caça-palavras ----------
  let caca: Atividade['caca_palavras'] = null;
  const cp = (b.caca_palavras && typeof b.caca_palavras === 'object') ? b.caca_palavras as Record<string, unknown> : null;
  const palavrasCp = cp ? listaStrings(cp.palavras, 14) : [];
  if (p.tipo === 'caca_palavras' || palavrasCp.length >= 4) {
    caca = {
      palavras: palavrasCp.length >= 4 ? palavrasCp : listaStrings(b.palavras_chave, 12),
      instrucao: (cp && txt(cp.instrucao)) || 'Encontre as palavras da lista no diagrama e circule cada uma. Depois, escreva com suas palavras o significado de duas delas.',
    };
  }

  // ---------- texto de apoio ----------
  let textoApoio: Atividade['texto_apoio'] = null;
  const ta = (b.texto_apoio && typeof b.texto_apoio === 'object') ? b.texto_apoio as Record<string, unknown> : null;
  if (ta) {
    const paras = listaStrings(ta.paragrafos, 8);
    if (paras.length) textoApoio = { titulo: txt(ta.titulo) || ('Sobre ' + p.tema), paragrafos: paras };
  }

  // ---------- gabarito (usa resposta_esperada quando a IA não mandar) ----------
  const gb = Array.isArray(b.gabarito) ? b.gabarito as Record<string, unknown>[] : [];
  const gabarito: Atividade['gabarito'] = [];
  for (const g of gb.slice(0, questoes.length + 2)) {
    if (!g || typeof g !== 'object') continue;
    const resposta = txt(g.resposta);
    if (!resposta) continue;
    gabarito.push({
      numero: clampInt(g.numero, 1, 99, gabarito.length + 1),
      resposta,
      comentario: txt(g.comentario),
    });
  }
  if (!gabarito.length) {
    for (const q of questoes) {
      let r = q.resposta_esperada;
      if (!r && q.tipo === 'multipla_escolha' && q.alternativas.length && q.correta !== null) {
        r = String.fromCharCode(65 + q.correta) + ') ' + q.alternativas[q.correta];
      }
      gabarito.push({ numero: q.numero, resposta: r || 'Resposta pessoal — valide a argumentação do aluno.', comentario: '' });
    }
  }

  const instrucoes = listaStrings(b.instrucoes, 6);
  return {
    titulo: txt(b.titulo) || ('Atividade de ' + p.disciplina + ': ' + p.tema),
    objetivo: txt(b.objetivo) || ('Compreender e aplicar o tema "' + p.tema + '" em situações do cotidiano.'),
    habilidade: txt(b.habilidade),
    tempo_min: clampInt(b.tempo_min, 5, 240, 50),
    texto_apoio: textoApoio,
    instrucoes: instrucoes.length ? instrucoes : [
      'Leia o texto de apoio com atenção.',
      'Responda às questões usando suas próprias palavras.',
      'Revise suas respostas antes de entregar.',
    ],
    palavras_chave: listaStrings(b.palavras_chave, 12),
    questoes,
    caca_palavras: caca,
    adaptacoes: listaStrings(b.adaptacoes, 8),
    acessibilidade: listaStrings(b.acessibilidade, 8),
    gabarito,
    observacoes: listaStrings(b.observacoes, 6),
    revisao: txt(b.revisao) || 'Material gerado por IA a partir de um pedido do professor. Revise fatos e datas antes de aplicar.',
  };
}

export function nomeTipo(tipo: string): string {
  return (TIPOS[tipo] || TIPOS.mista).nome;
}


