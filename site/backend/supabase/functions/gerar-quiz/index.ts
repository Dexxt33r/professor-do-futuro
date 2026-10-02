// ============================================================
// PROFESSOR DO FUTURO — gerar-quiz (Edge Function / Deno)
// ETAPA 3 (Opção B). POST { tema, segmento, quantidade }
// → { ok:true, quiz:[{pergunta, alternativas[3], correta}], provedor, modelo }
// ============================================================

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import {
  json, textoLimpo, usuarioAutenticado, CORS_HEADERS,
  gerarComIA, limparJson, txt, listaStrings, clampInt,
} from '../_shared/ia.ts';

const SISTEMA = 'Você é um professor brasileiro experiente que cria quizzes de sala divertidos e justos. Responde SEMPRE com um único objeto JSON válido, sem markdown e sem texto fora do JSON.';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ ok: false, erro: 'Use POST.' }, 405);
  try {
    if (!await usuarioAutenticado(req)) return json({ ok: false, erro: 'Faça login no curso.' }, 401);
    const c = await req.json().catch(() => null) as any;
    const tema = textoLimpo(c?.tema, 160);
    if (tema.length < 3) return json({ ok: false, erro: 'Informe o tema (≥3 letras).' }, 400);
    const quant = clampInt(c?.quantidade, 3, 15, 5);
    const segmento = textoLimpo(c?.segmento, 30) || 'Anos Finais';
    const prompt = 'CRIE UM QUIZ DE SALA com ' + quant + ' perguntas de múltipla escolha sobre "' + tema + '" (' + segmento + '). ' +
      'Linguagem na altura da turma, 3 alternativas (A–C) plausíveis, 1 correta, sem pegadinha. ' +
      'Responda SOMENTE com JSON: {"quiz":[{"pergunta":"...","alternativas":["...","...","..."],"correta":0}]}. Sem inventar datas/leis.';
    const gerado = await gerarComIA(prompt, SISTEMA);
    const b = limparJson(gerado.texto) as Record<string, unknown>;
    const bruto = Array.isArray(b.quiz) ? b.quiz as Record<string, unknown>[] : [];
    const quiz = bruto.slice(0, quant).map((q) => {
      const alts = listaStrings(q.alternativas, 3);
      while (alts.length < 3) alts.push('Alternativa ' + String.fromCharCode(65 + alts.length));
      let correta = Number(q.correta);
      if (!isFinite(correta) || correta < 0 || correta > 2) correta = 0;
      return { pergunta: txt(q.pergunta) || ('Pergunta sobre ' + tema), alternativas: alts, correta };
    }).filter((q) => q.pergunta);
    return json({ ok: true, quiz, provedor: gerado.provedor, modelo: gerado.modelo });
  } catch (e) {
    return json({ ok: false, erro: 'IA indisponível.', detalhes: String((e as Error).message || e).slice(0, 600) }, 502);
  }
});
