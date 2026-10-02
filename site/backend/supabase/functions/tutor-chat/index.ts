// ============================================================
// PROFESSOR DO FUTURO — tutor-chat (Edge Function / Deno)
// ETAPA 4. POST { mensagem, historico?, contexto? }
// → { ok:true, resposta, sugestoes[], provedor, modelo }
// Chat pedagógico: responde dúvidas do professor, sugere
// atividades e guia o uso do Laboratório. TEXTO livre (não JSON),
// com guardrails: sem dados pessoais, sem promessas de nota
// oficial, sempre com revisão humana.
// ============================================================

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { json, textoLimpo, usuarioAutenticado, CORS_HEADERS } from '../_shared/ia.ts';

const GROQ_KEY = Deno.env.get('GROQ_API_KEY') || '';
const GROQ_MODELO = Deno.env.get('GROQ_MODELO') || 'openai/gpt-oss-120b';
const GROQ_MODELO_RAPIDO = Deno.env.get('GROQ_MODELO_RAPIDO') || 'openai/gpt-oss-20b';

const SISTEMA = [
  'Você é o Tutor do Professor do Futuro: um mentor brasileiro, acolhedor e direto,',
  'especialista em didática, inclusão (AEE/TEA/TDAH) e uso de IA na escola.',
  'Você conversa DENTRO do site do curso e conhece as ferramentas do Laboratório:',
  'Gerar Atividade Pronta (folha A4), Plano de Aula, Quiz em Sala, Rubrica à Prova de IA,',
  'Simplificador de Texto, Atividade Rápida, Corretor ENEM (apoio), Semáforo, Cronômetro, Sorteador.',
  'REGRAS:',
  '1) Responda em português, curto (máx 120 palavras) salvo se pedirem detalhe.',
  '2) Dê 1 ação prática imediata + 1 ferramenta do site para usar.',
  '3) Nunca peça nem repita nome de aluno, escola ou dado pessoal.',
  '4) Correção ENEM oficial é da banca — você dá APOIO.',
  '5) Se pedirem conteúdo sensível/perigoso, recuse com gentileza e sugira alternativa pedagógica.',
  '6) Responda SEMPRE em JSON: {"resposta":"...","sugestoes":["chip1","chip2","chip3"]}.',
].join(' ');

async function chatGroq(mensagens: unknown[], modelo: string): Promise<string> {
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + GROQ_KEY },
    body: JSON.stringify({
      model: modelo,
      messages: mensagens,
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 800,
    }),
  });
  const dados = await r.json().catch(() => null) as any;
  if (!r.ok) throw new Error('Groq [' + modelo + ']: ' + ((dados?.error?.message) || ('HTTP ' + r.status)));
  const texto = dados?.choices?.[0]?.message?.content;
  if (!texto) throw new Error('Groq: resposta vazia.');
  return texto;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ ok: false, erro: 'Use POST.' }, 405);
  try {
    if (!GROQ_KEY) return json({ ok: false, erro: 'IA não configurada.' }, 502);
    const c = await req.json().catch(() => null) as any;
    const mensagem = textoLimpo(c?.mensagem, 1000);
    if (mensagem.length < 2) return json({ ok: false, erro: 'Escreva sua dúvida.' }, 400);
    // Login opcional: logado tem contexto; deslogado usa modo demonstração.
    const logado = await usuarioAutenticado(req);
    const hist = Array.isArray(c?.historico) ? c.historico.slice(-6) : [];
    const msgs: unknown[] = [{ role: 'system', content: SISTEMA }];
    for (const h of hist) {
      if (h && typeof h === 'object') {
        const papel = (h as any).role === 'assistant' ? 'assistant' : 'user';
        const txt = textoLimpo((h as any).content, 800);
        if (txt) msgs.push({ role: papel, content: txt });
      }
    }
    const pagina = textoLimpo(c?.contexto, 120);
    msgs.push({
      role: 'user',
      content: (pagina ? '[O professor está na página: ' + pagina + '] ' : '') + mensagem,
    });
    let texto = '';
    let modelo = GROQ_MODELO_RAPIDO;
    try {
      texto = await chatGroq(msgs, GROQ_MODELO_RAPIDO);
    } catch (_) {
      texto = await chatGroq(msgs, GROQ_MODELO);
      modelo = GROQ_MODELO;
    }
    let j: any = {};
    try {
      const ini = texto.indexOf('{');
      j = JSON.parse(texto.slice(ini, texto.lastIndexOf('}') + 1));
    } catch (_) { j = { resposta: texto.slice(0, 800) }; }
    return json({
      ok: true,
      resposta: String(j.resposta || 'Posso ajudar com planos, atividades, quiz ou inclusão. O que você precisa?').slice(0, 1500),
      sugestoes: Array.isArray(j.sugestoes) ? j.sugestoes.slice(0, 3).map(String) : ['Gerar atividade', 'Plano de aula', 'Ideia de quiz'],
      provedor: 'groq',
      modelo,
      demo: !logado,
    });
  } catch (e) {
    return json({ ok: false, erro: 'Tutor indisponível.', detalhes: String((e as Error).message || e).slice(0, 400) }, 502);
  }
});
