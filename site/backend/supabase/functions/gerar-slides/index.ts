// ============================================================
// PROFESSOR DO FUTURO — gerar-slides (Edge Function / Deno)
// ------------------------------------------------------------
// IA na BIBLIOTECA DE SLIDES: monta uma apresentação completa a
// partir de um tema. O professor NUNCA escreve prompt — envia só
// o formulário; o prompt é montado aqui, no servidor.
//
// POST { tema, segmento, nSlides, foco, observacoes }
//   Authorization: Bearer <access_token do Supabase Auth>
//   apikey: <publishable/anon key>
// → { ok:true, deck:{ titulo, subtitulo, slides:[...] }, provedor, modelo }
//
// Os slides saem no MESMO formato do present.js:
//   section | list | table | prompt | checklist
// ============================================================

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import {
  json, textoLimpo, usuarioAutenticado, CORS_HEADERS,
  gerarComIA, limparJson, txt, listaStrings, clampInt,
} from '../_shared/ia.ts';

const SISTEMA = 'Você é um professor brasileiro especialista em didática, BNCC e inclusão (AEE). Você cria apresentações de sala claras, visuais e curtas, com 1 ideia por slide. Responde SEMPRE com um único objeto JSON válido, sem markdown e sem texto fora do JSON.';

const SEGMENTOS: Record<string, string> = {
  infantil: 'Educação Infantil (4–5 anos): frases curtas, muita imagem, corpo e movimento.',
  fund1: 'Anos Iniciais (1º ao 5º ano): linguagem simples, exemplos do dia a dia, atividade mão na massa.',
  fund2: 'Anos Finais (6º ao 9º ano): linguagem direta, dados, exemplos reais e discussão.',
  medio: 'Ensino Médio: tom crítico, contexto de vestibular/Enem e protagonismo do aluno.',
};

const FOCOS: Record<string, string> = {
  nenhum: '',
  inclusao: 'Inclua 2 slides com foco em INCLUSÃO (língua fácil, rotina visual e acessibilidade).',
  engajamento: 'Inclua 2 slides de ENGAJAMENTO (gancho de abertura, dinâmica interativa, escolha do aluno).',
  avaliacao: 'Inclua 2 slides de AVALIAÇÃO (checklist e 1 prompt de IA para gerar exercícios).',
};

function montarPrompt(p: Record<string, string | number>): string {
  const l: string[] = [];
  l.push('CRIE UMA APRESENTAÇÃO DE SALA (slides) e responda SOMENTE com JSON válido.');
  l.push('');
  l.push('Tema: ' + p.tema);
  l.push('Série/segmento: ' + (SEGMENTOS[String(p.segmento)] || SEGMENTOS.fund2));
  l.push('Quantidade: cerca de ' + p.nSlides + ' slides, começando com 1 de abertura e terminando com 1 de fechamento/checklist.');
  if (p.foco) l.push('Foco extra: ' + p.foco);
  if (p.observacoes) l.push('Observações do professor: ' + p.observacoes);
  l.push('');
  l.push('FORMATO (JSON): {"titulo":"...","subtitulo":"...","slides":[ ... ]}');
  l.push('Cada slide tem "type" e "title" além de "body", onde "type" é um de:');
  l.push('- "section": abertura/encerramento; body = frase curta.');
  l.push('- "list": body = lista de 3 a 5 tópicos curtos.');
  l.push('- "table": body = {"head":["Col A","Col B"],"rows":[["...","..."],["...","..."]]} (2 a 4 colunas).');
  l.push('- "prompt": body = 1 prompt pronto de IA para o professor COPIAR (sem colchetes de exemplo).');
  l.push('- "checklist": body = 4 a 6 itens de verificação.');
  l.push('');
  l.push('REGRAS: título do slide com no máximo 6 palavras; cada tópico com no máximo 12 palavras;');
  l.push('1 ideia por slide; sem nome de aluno/escola; não invente leis nem datas; português do Brasil.');
  return l.join('\n');
}

function normalizarDeck(b: Record<string, unknown>, tema: string) {
  const TIPOS = ['section', 'list', 'table', 'prompt', 'checklist'];
  const bruto = Array.isArray(b.slides) ? b.slides as Record<string, unknown>[] : [];
  const slides: Record<string, unknown>[] = [];
  for (const s of bruto.slice(0, 24)) {
    if (!s || typeof s !== 'object') continue;
    let type = txt(s.type).toLowerCase();
    if (TIPOS.indexOf(type) === -1) type = 'list';
    const title = txt(s.title) || 'Slide';
    if (type === 'table') {
      const t = (s.body && typeof s.body === 'object') ? s.body as Record<string, unknown> : { head: [], rows: [] };
      const head = listaStrings(t.head, 4);
      const rowsBruto = Array.isArray(t.rows) ? t.rows as unknown[] : [];
      const rows: string[][] = [];
      for (const r of rowsBruto.slice(0, 8)) {
        if (Array.isArray(r)) rows.push(r.map((c) => txt(c)).slice(0, head.length || 4));
      }
      if (head.length >= 2 && rows.length >= 1) {
        slides.push({ type: 'table', title, body: { head, rows } });
      } else {
        const linhas = rows.map((r) => r.join(' · ')).filter(Boolean);
        slides.push({ type: 'list', title, body: linhas.length ? linhas.slice(0, 6) : ['Adicione aqui os pontos principais.'] });
      }
    } else if (type === 'prompt') {
      slides.push({ type: 'prompt', title, body: txt(s.body) || ('Crie um material sobre ' + tema + ', na altura da minha turma.') });
    } else if (type === 'section') {
      slides.push({ type: 'section', title, body: txt(s.body) || title });
    } else {
      const itens = listaStrings(s.body, 8);
      slides.push({ type, title, body: itens.length ? itens : ['Adicione aqui os pontos principais.'] });
    }
  }
  return {
    titulo: txt(b.titulo) || ('Apresentação — ' + tema),
    subtitulo: txt(b.subtitulo) || ('Gerada por IA sobre ' + tema),
    slides,
  };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ ok: false, erro: 'Use POST.' }, 405);
  try {
    if (!await usuarioAutenticado(req)) return json({ ok: false, erro: 'Faça login no curso.' }, 401);
    const c = await req.json().catch(() => null) as any;
    const tema = textoLimpo(c?.tema, 160);
    if (tema.length < 3) return json({ ok: false, erro: 'Informe o tema (≥3 letras).' }, 400);
    const ped = {
      tema,
      segmento: textoLimpo(c?.segmento, 20) || 'fund2',
      nSlides: clampInt(c?.nSlides, 5, 20, 8),
      foco: textoLimpo(c?.foco, 20) || 'nenhum',
      observacoes: textoLimpo(c?.observacoes, 400),
    };
    const gerado = await gerarComIA(montarPrompt(ped), SISTEMA);
    const b = limparJson(gerado.texto) as Record<string, unknown>;
    const deck = normalizarDeck(b, tema);
    if (!deck.slides.length) return json({ ok: false, erro: 'A IA não gerou slides. Tente de novo.' }, 502);
    return json({ ok: true, deck, provedor: gerado.provedor, modelo: gerado.modelo });
  } catch (e) {
    return json({ ok: false, erro: 'IA indisponível.', detalhes: String((e as Error).message || e).slice(0, 600) }, 502);
  }
});
