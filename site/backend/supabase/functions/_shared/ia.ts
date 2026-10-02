// ETAPA 3 (Opção B): núcleo compartilhado das funções de IA.
// Cada função (gerar-plano, gerar-quiz, gerar-rubrica,
// simplificar-texto, corrigir-redacao) importa daqui.
// A chave da IA existe SOMENTE no servidor (Secrets).

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON = Deno.env.get('SUPABASE_ANON_KEY') ||
  Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ||
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY') || '';
const GEMINI_MODELO = Deno.env.get('GEMINI_MODELO') || 'gemini-2.5-flash';
const GROQ_KEY = Deno.env.get('GROQ_API_KEY') || '';
const GROQ_MODELO = Deno.env.get('GROQ_MODELO') || 'openai/gpt-oss-120b';
const GROQ_MODELO_RAPIDO = Deno.env.get('GROQ_MODELO_RAPIDO') || 'openai/gpt-oss-20b';
const OPENROUTER_KEY = Deno.env.get('OPENROUTER_API_KEY') || '';
const OPENROUTER_MODELO = Deno.env.get('OPENROUTER_MODELO') || 'openrouter/free';

export const SITE_URL =
  Deno.env.get('SITE_URL') || 'https://professor-do-futuro-brown.vercel.app';

export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export function textoLimpo(v: unknown, max: number): string {
  if (v === null || v === undefined) return '';
  return String(v).replace(/\s+/g, ' ').trim().slice(0, max);
}

export async function usuarioAutenticado(req: Request): Promise<boolean> {
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
