// ============================================================
// PROFESSOR DO FUTURO — gerar-plano (Edge Function / Deno)
// ETAPA 3 (Opção B: 1 função por ferramenta).
// POST { tema, segmento, duracao, nSlides, foco, observacoes }
// → { ok:true, plano:{...}, provedor, modelo }
// O navegador envia só o formulário — o prompt é montado aqui.
// ============================================================

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import {
  json, textoLimpo, usuarioAutenticado, CORS_HEADERS,
  gerarComIA, limparJson, txt, listaStrings, clampInt,
} from '../_shared/ia.ts';

const SISTEMA = 'Você é um professor brasileiro experiente, especialista em planejamento de aula, didática e inclusão (AEE). Responde SEMPRE com um único objeto JSON válido, sem markdown e sem texto fora do JSON.';

const SEGMENTOS: Record<string, string> = {
  infantil: 'Educação Infantil (crianças de 4–5 anos): linguagem lúdica, poucas palavras, muita imagem e movimento.',
  fund1: 'Anos Iniciais (1º ao 5º ano): frases curtas, exemplos do dia a dia, atividades mão na massa.',
  fund2: 'Anos Finais (6º ao 9º ano): linguagem direta, dados, exemplos reais e discussão.',
  medio: 'Ensino Médio: tom crítico, dados e contexto de vestibular/Enem.',
};

function montarPrompt(p: Record<string, string | number>): string {
  const l: string[] = [];
  l.push('ESCREVA UM PLANO DE AULA COMPLETO e responda SOMENTE com JSON válido.');
  l.push('');
  l.push('Tema: ' + p.tema);
  l.push('Segmento: ' + (SEGMENTOS[String(p.segmento)] || SEGMENTOS.fund1));
  l.push('Duração: ' + p.duracao + ' | Slides: ' + p.nSlides + ' | Foco extra: ' + p.foco);
  if (p.observacoes) l.push('Observações do professor: ' + p.observacoes);
  l.push('');
  l.push('Entregue: objetivo (1 frase), materiais (lista), blocos de tempo (lista "0–5 min: ..."), slides (titulo+texto+img), niveis (3, mesma turma), dinamicas (2, nome+como), quiz (5 perguntas multipla escolha com correta), inclusao (1 parágrafo AEE), revisao (aviso fixo).');
  l.push('REGRAS: sem markdown fora do JSON; sem nome de aluno/escola; sem inventar leis/datas; revisao = "Material gerado por IA a partir de um pedido do professor. Revise fatos e datas antes de aplicar."');
  return l.join('\n');
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
      tema, segmento: textoLimpo(c?.segmento, 20) || 'fund1',
      duracao: textoLimpo(c?.duracao, 30) || '1 aula (50 min)',
      nSlides: clampInt(c?.nSlides, 4, 20, 10),
      foco: textoLimpo(c?.foco, 20) || 'nenhum',
      observacoes: textoLimpo(c?.observacoes, 500),
    };
    const gerado = await gerarComIA(montarPrompt(ped), SISTEMA);
    const b = limparJson(gerado.texto) as Record<string, unknown>;
    const plano = {
      titulo: txt(b.titulo) || ('Plano de aula — ' + tema),
      objetivo: txt(b.objetivo),
      materiais: listaStrings(b.materiais, 10),
      blocos: listaStrings(b.blocos, 12),
      slides: listaStrings(b.slides, 20),
      niveis: listaStrings(b.niveis, 6),
      dinamicas: listaStrings(b.dinamicas, 6),
      quiz: listaStrings(b.quiz, 8),
      inclusao: txt(b.inclusao),
      revisao: txt(b.revisao) || 'Material gerado por IA. Revise antes de aplicar.',
    };
    return json({ ok: true, plano, provedor: gerado.provedor, modelo: gerado.modelo });
  } catch (e) {
    return json({ ok: false, erro: 'IA indisponível.', detalhes: String((e as Error).message || e).slice(0, 600) }, 502);
  }
});
