// ============================================================
// PROFESSOR DO FUTURO — CURSO
// gerar-atividade (Supabase Edge Function / Deno)
// ------------------------------------------------------------
// BACK-END da geração de atividades com IA. É o equivalente, neste
// projeto (site estático, sem build), a uma "API Route" do Next.js:
// roda no servidor e é o ÚNICO lugar onde a chave da IA existe.
//
// POST /functions/v1/gerar-atividade
//   Authorization: Bearer <access_token do Supabase Auth>
//   apikey: <publishable/anon key>
//   { disciplina, ano, tema, tipo, quantidade, adaptaTdahTea,
//     adaptaVisual, incluirGabarito, observacoes }
// → { ok:true, atividade:{...}, provedor:'gemini'|'groq'|'openrouter', modelo:'...' }
// → { ok:false, erro:'...', erros:[...] }  (o site cai no modo offline)
//
// PROVEDORES GRATUITOS (cadeia de fallback, na ordem):
//   1) Google Gemini  → secret GEMINI_API_KEY     (free tier, sem cartão)
//   2) Groq           → secret GROQ_API_KEY       (plano Free)
//   3) OpenRouter     → secret OPENROUTER_API_KEY (modelos ":free")
// Basta configurar UMA delas. Veja site/backend/README.md.
// ============================================================

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { montarPrompt, normalizarAtividade, limparJson, ESQUEMA_RESPOSTA } from './prompt.ts';
import type { Pedido } from './prompt.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON = Deno.env.get('SUPABASE_ANON_KEY') ||
  Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ||
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY') || '';
const GEMINI_MODELO = Deno.env.get('GEMINI_MODELO') || 'gemini-2.5-flash';
const GROQ_KEY = Deno.env.get('GROQ_API_KEY') || '';
const GROQ_MODELO = Deno.env.get('GROQ_MODELO') || 'openai/gpt-oss-120b';
const OPENROUTER_KEY = Deno.env.get('OPENROUTER_API_KEY') || '';
const OPENROUTER_MODELO = Deno.env.get('OPENROUTER_MODELO') || 'openrouter/free';

const SITE_URL = Deno.env.get('SITE_URL') || 'https://professor-do-futuro-brown.vercel.app';

/* ---------------- utilitários HTTP ---------------- */
const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function textoLimpo(v: unknown, max: number): string {
  if (v === null || v === undefined) return '';
  return String(v).replace(/\s+/g, ' ').trim().slice(0, max);
}

/* ---------------- 1) autenticação (só aluno logado) ---------------- */
async function usuarioAutenticado(req: Request): Promise<boolean> {
  const auth = req.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return false;
  if (!SUPABASE_URL || !SUPABASE_ANON) return false;
  try {
    const r = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: { apikey: SUPABASE_ANON, Authorization: 'Bearer ' + token },
    });
    return r.ok;
  } catch (_) {
    return false;
  }
}

// Instrução de sistema usada pelos provedores no padrão OpenAI (Groq e OpenRouter).
// O Gemini recebe o mesmo papel dentro do próprio prompt.
const SISTEMA = 'Você é um professor brasileiro experiente, especialista em didática, avaliação da aprendizagem e educação inclusiva (AEE). ' +
  'Escreve atividades escolares objetivas, corretas e adequadas ao ano/série informado. ' +
  'Responde SEMPRE com um único objeto JSON válido, sem markdown e sem texto fora do JSON.';

/* ---------------- 2) provedores gratuitos de IA ---------------- */

// Google Gemini (AI Studio — free tier). Devolve o texto bruto do modelo.
async function chamarGemini(prompt: string, modelo: string): Promise<string> {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
    encodeURIComponent(modelo) + ':generateContent?key=' + encodeURIComponent(GEMINI_KEY);

  const generationConfig: Record<string, unknown> = {
    temperature: 0.7,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
    responseSchema: ESQUEMA_RESPOSTA,
  };
  // Modelos 2.5+/3.x são "thinking": sem desligar, o raciocínio consome o
  // limite de saída e o JSON pode voltar vazio/truncado.
  if (/^gemini-(2\.5|3)/i.test(modelo) && !/image/i.test(modelo)) {
    generationConfig.thinkingConfig = { thinkingBudget: 0 };
  }

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    }),
  });

  const dados = await r.json().catch(() => null) as any;
  if (!r.ok) {
    const msg = (dados && dados.error && dados.error.message) || ('HTTP ' + r.status);
    throw new Error('Gemini [' + modelo + ']: ' + msg);
  }
  const partes = dados && dados.candidates && dados.candidates[0] &&
    dados.candidates[0].content && dados.candidates[0].content.parts;
  const texto = Array.isArray(partes) ? partes.map((p: any) => (p && p.text) || '').join('') : '';
  if (!texto) throw new Error('Gemini: resposta vazia (troque GEMINI_MODELO ou aumente maxOutputTokens).');
  return texto;
}

// Groq (plano Free) — API compatível com o padrão OpenAI.
async function chamarGroq(prompt: string): Promise<string> {
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + GROQ_KEY,
    },
    body: JSON.stringify({
      model: GROQ_MODELO,
      messages: [
        { role: 'system', content: SISTEMA },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 6000,
    }),
  });

  const dados = await r.json().catch(() => null) as any;
  if (!r.ok) {
    const msg = (dados && dados.error && dados.error.message) || ('HTTP ' + r.status);
    throw new Error('Groq [' + GROQ_MODELO + ']: ' + msg);
  }
  const texto = dados && dados.choices && dados.choices[0] && dados.choices[0].message &&
    dados.choices[0].message.content;
  if (!texto) throw new Error('Groq: resposta vazia.');
  return texto;
}

// OpenRouter (modelos ":free" / alias "openrouter/free") — mesmo padrão OpenAI.
async function chamarOpenRouter(prompt: string): Promise<string> {
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + OPENROUTER_KEY,
      'HTTP-Referer': SITE_URL,
      'X-Title': 'Professor do Futuro - Gerador de Atividade',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODELO,
      messages: [
        { role: 'system', content: SISTEMA },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 6000,
    }),
  });

  const dados = await r.json().catch(() => null) as any;
  if (!r.ok) {
    const msg = (dados && dados.error && dados.error.message) || ('HTTP ' + r.status);
    throw new Error('OpenRouter [' + OPENROUTER_MODELO + ']: ' + msg);
  }
  const texto = dados && dados.choices && dados.choices[0] && dados.choices[0].message &&
    dados.choices[0].message.content;
  if (!texto) throw new Error('OpenRouter: resposta vazia.');
  return texto;
}

/* ---------------- 3) cadeia de fallback ---------------- */
async function gerarComIA(prompt: string): Promise<{ texto: string; provedor: string; modelo: string }> {
  const erros: string[] = [];

  if (GEMINI_KEY) {
    const modelos = [GEMINI_MODELO];
    if (GEMINI_MODELO !== 'gemini-2.5-flash-lite') modelos.push('gemini-2.5-flash-lite');
    for (const m of modelos) {
      try {
        const texto = await chamarGemini(prompt, m);
        return { texto, provedor: 'gemini', modelo: m };
      } catch (err) {
        const msg = String((err as Error).message || err);
        erros.push(msg);
        // Modelo inexistente/descontinuado → tenta o próximo da lista.
        if (!/not found|not supported|does not exist|404/i.test(msg)) break;
      }
    }
  }
  if (GROQ_KEY) {
    try {
      return { texto: await chamarGroq(prompt), provedor: 'groq', modelo: GROQ_MODELO };
    } catch (err) { erros.push(String((err as Error).message || err)); }
  }
  if (OPENROUTER_KEY) {
    try {
      return { texto: await chamarOpenRouter(prompt), provedor: 'openrouter', modelo: OPENROUTER_MODELO };
    } catch (err) { erros.push(String((err as Error).message || err)); }
  }
  if (!GEMINI_KEY && !GROQ_KEY && !OPENROUTER_KEY) {
    erros.push('Nenhuma chave de IA configurada (GEMINI_API_KEY, GROQ_API_KEY ou OPENROUTER_API_KEY).');
  }
  if (!erros.length) erros.push('Todos os provedores gratuitos falharam.');
  throw new Error(erros.join(' | '));
}

/* ---------------- 4) endpoint ---------------- */
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ ok: false, erro: 'Use POST.' }, 405);

  try {
    // Só aluno autenticado consome a IA (evita que a chave seja usada de fora).
    const autorizado = await usuarioAutenticado(req);
    if (!autorizado) {
      return json({ ok: false, erro: 'Faça login no curso para gerar atividades.' }, 401);
    }

    const corpo = await req.json().catch(() => null) as any;
    if (!corpo || typeof corpo !== 'object') {
      return json({ ok: false, erro: 'Corpo da requisição inválido.' }, 400);
    }

    const pedido: Pedido = {
      disciplina: textoLimpo(corpo.disciplina, 60) || 'Interdisciplinar',
      ano: textoLimpo(corpo.ano, 60) || 'Ensino Fundamental',
      tema: textoLimpo(corpo.tema, 160),
      tipo: textoLimpo(corpo.tipo, 30) || 'mista',
      quantidade: Number(corpo.quantidade) || 8,
      adaptaTdahTea: !!corpo.adaptaTdahTea,
      adaptaVisual: !!corpo.adaptaVisual,
      incluirGabarito: corpo.incluirGabarito !== false,
      observacoes: textoLimpo(corpo.observacoes, 500),
    };

    if (pedido.tema.length < 3) {
      return json({ ok: false, erro: 'Informe o tema principal da aula (pelo menos 3 letras).' }, 400);
    }

    const prompt = montarPrompt(pedido);
    const gerado = await gerarComIA(prompt);
    const bruto = limparJson(gerado.texto);
    const atividade = normalizarAtividade(bruto, pedido);

    if (!atividade.questoes.length) {
      return json({ ok: false, erro: 'A IA não devolveu questões. Tente novamente ou use o modo offline.' }, 502);
    }

    return json({
      ok: true,
      atividade,
      provedor: gerado.provedor,
      modelo: gerado.modelo,
    });
  } catch (err) {
    // 502 → o site mostra o aviso e cai automaticamente no modo offline.
    return json({
      ok: false,
      erro: 'Não foi possível falar com a IA agora. Use o modo offline ou tente novamente.',
      detalhes: String((err as Error).message || err).slice(0, 600),
    }, 502);
  }
});


