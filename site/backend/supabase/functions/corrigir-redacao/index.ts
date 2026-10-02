// ============================================================
// PROFESSOR DO FUTURO — corrigir-redacao (Edge Function / Deno)
// ETAPA 3 (Opção B). POST { tema, texto }
// → { ok:true, correcao:{ notas:{c1..c5}, total, comentarios[],
//      proposta_ok, direitos_ok, avisos[] }, provedor, modelo }
// Segue a Matriz do Inep (C1–C5, 0/40/80/120/160/200). É APOIO ao
// professor — a nota oficial é da banca. Nunca expõe dado pessoal.
// ============================================================

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import {
  json, textoLimpo, usuarioAutenticado, CORS_HEADERS,
  gerarComIA, limparJson, txt, listaStrings,
} from '../_shared/ia.ts';

const SISTEMA = 'Você é um corretor experiente da Redação do Enem, fiel à Matriz de Referência e à Cartilha do Participante do Inep: 5 competências (C1–C5), cada uma em 0, 40, 80, 120, 160 ou 200 pontos. Rigoroso e justo. Responde SEMPRE com JSON válido, sem markdown.';

function notaValida(v: unknown): number {
  const validas = [0, 40, 80, 120, 160, 200];
  const n = Math.round(Number(v));
  return validas.includes(n) ? n : 120;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ ok: false, erro: 'Use POST.' }, 405);
  try {
    if (!await usuarioAutenticado(req)) return json({ ok: false, erro: 'Faça login no curso.' }, 401);
    const c = await req.json().catch(() => null) as any;
    const tema = textoLimpo(c?.tema, 200);
    const texto = textoLimpo(c?.texto, 6000);
    if (tema.length < 3) return json({ ok: false, erro: 'Informe o tema.' }, 400);
    if (texto.length < 100) return json({ ok: false, erro: 'Cole a redação (≥100 letras).' }, 400);
    const prompt = 'CORRIJA ESTA REDAÇÃO DO ENEM.\nTema: ' + tema +
      '\nC1 norma culta; C2 tema+repertório (tangenciamento→C2 máx 40); C3 argumentação; C4 coesão; ' +
      'C5 proposta com 5 elementos (agente, ação, meio/modo, finalidade, detalhamento) + direitos humanos. ' +
      'Notas só em 0/40/80/120/160/200. Texto:\n"""\n' + texto + '\n"""\n' +
      'JSON: {"c1":120,"c2":120,"c3":120,"c4":120,"c5":120,"comentarios":["..."],"proposta_ok":true,"direitos_ok":true,"avisos":["..."]}.';
    const gerado = await gerarComIA(prompt, SISTEMA);
    const b = limparJson(gerado.texto) as Record<string, unknown>;
    const notas = {
      c1: notaValida(b.c1), c2: notaValida(b.c2), c3: notaValida(b.c3),
      c4: notaValida(b.c4), c5: notaValida(b.c5),
    };
    return json({
      ok: true,
      correcao: {
        notas, total: notas.c1 + notas.c2 + notas.c3 + notas.c4 + notas.c5,
        comentarios: listaStrings(b.comentarios, 8),
        proposta_ok: !!b.proposta_ok, direitos_ok: b.direitos_ok !== false,
        avisos: listaStrings(b.avisos, 6),
        revisao: txt(b.revisao) || 'Correção de APOIO por IA. A nota oficial é definida pela banca do Inep.',
      },
      provedor: gerado.provedor, modelo: gerado.modelo,
    });
  } catch (e) {
    return json({ ok: false, erro: 'IA indisponível.', detalhes: String((e as Error).message || e).slice(0, 600) }, 502);
  }
});
