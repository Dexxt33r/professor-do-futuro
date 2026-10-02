// ============================================================
// PROFESSOR DO FUTURO — simplificar-texto (Edge Function / Deno)
// ETAPA 3 (Opção B). POST { texto }
// → { ok:true, frases:[...], trocas:[...], provedor, modelo }
// Língua fácil (Easy Read): 1 ideia por linha, palavras simples.
// ============================================================

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import {
  json, textoLimpo, usuarioAutenticado, CORS_HEADERS,
  gerarComIA, limparJson, listaStrings,
} from '../_shared/ia.ts';

const SISTEMA = 'Você é um especialista brasileiro em leitura fácil (Easy Read) e acessibilidade: transforma textos difíceis em linguagem simples sem perder o sentido. Responde SEMPRE com JSON válido, sem markdown.';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ ok: false, erro: 'Use POST.' }, 405);
  try {
    if (!await usuarioAutenticado(req)) return json({ ok: false, erro: 'Faça login no curso.' }, 401);
    const c = await req.json().catch(() => null) as any;
    const texto = textoLimpo(c?.texto, 4000);
    if (texto.length < 20) return json({ ok: false, erro: 'Cole um texto com pelo menos 20 letras.' }, 400);
    const prompt = 'REESCREVA EM LÍNGUA FÁCIL (leitura fácil): frases curtas (1 ideia por frase), palavras simples, ordem direta, sem jargão. ' +
      'Mantenha TODAS as informações importantes. Texto:\n"""\n' + texto + '\n"""\n' +
      'JSON: {"frases":["frase 1 simples","frase 2 simples",...],"trocas":["palavra difícil → palavra simples",...]}.';
    const gerado = await gerarComIA(prompt, SISTEMA);
    const b = limparJson(gerado.texto) as Record<string, unknown>;
    return json({
      ok: true,
      frases: listaStrings(b.frases, 40),
      trocas: listaStrings(b.trocas, 20),
      provedor: gerado.provedor, modelo: gerado.modelo,
    });
  } catch (e) {
    return json({ ok: false, erro: 'IA indisponível.', detalhes: String((e as Error).message || e).slice(0, 600) }, 502);
  }
});
