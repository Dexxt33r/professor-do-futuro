// ============================================================
// PROFESSOR DO FUTURO — gerar-rubrica (Edge Function / Deno)
// ETAPA 3 (Opção B). POST { tipo, etapa, tarefa }
// → { ok:true, rubrica:{ titulo, criterios:[{nome, niveis:[3]}] }, provedor, modelo }
// Rubrica "à prova de IA": valoriza processo, defesa e aplicação.
// ============================================================

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import {
  json, textoLimpo, usuarioAutenticado, CORS_HEADERS,
  gerarComIA, limparJson, txt, listaStrings,
} from '../_shared/ia.ts';

const SISTEMA = 'Você é um especialista brasileiro em avaliação da aprendizagem, focado em rubricas que valorizam processo, defesa oral e aplicação real (à prova de cola com IA). Responde SEMPRE com JSON válido, sem markdown.';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ ok: false, erro: 'Use POST.' }, 405);
  try {
    if (!await usuarioAutenticado(req)) return json({ ok: false, erro: 'Faça login no curso.' }, 401);
    const c = await req.json().catch(() => null) as any;
    const tipo = textoLimpo(c?.tipo, 30) || 'apresentação oral';
    const etapa = textoLimpo(c?.etapa, 30) || 'Ensino Fundamental';
    const tarefa = textoLimpo(c?.tarefa, 300);
    const prompt = 'CRIE UMA RUBRICA "À PROVA DE IA" para: tipo=' + tipo + ', etapa=' + etapa +
      (tarefa ? ', tarefa=' + tarefa : '') + '. ' +
      '4 critérios (ex.: compreensão, aplicação, defesa oral, colaboração), cada um com 3 níveis (Iniciante/Em desenvolvimento/Proficiente) descritos em 1 frase. ' +
      'Valorize o que a IA não faz: explicar com as próprias palavras, defender escolhas, aplicar à comunidade. ' +
      'JSON: {"titulo":"...","criterios":[{"nome":"...","niveis":["...","...","..."]}]}.';
    const gerado = await gerarComIA(prompt, SISTEMA);
    const b = limparJson(gerado.texto) as Record<string, unknown>;
    const bruto = Array.isArray(b.criterios) ? b.criterios as Record<string, unknown>[] : [];
    const criterios = bruto.slice(0, 6).map((x) => ({
      nome: txt(x.nome) || 'Critério',
      niveis: listaStrings(x.niveis, 3),
    })).filter((x) => x.niveis.length);
    return json({
      ok: true,
      rubrica: { titulo: txt(b.titulo) || ('Rubrica — ' + tipo), criterios },
      provedor: gerado.provedor, modelo: gerado.modelo,
    });
  } catch (e) {
    return json({ ok: false, erro: 'IA indisponível.', detalhes: String((e as Error).message || e).slice(0, 600) }, 502);
  }
});
