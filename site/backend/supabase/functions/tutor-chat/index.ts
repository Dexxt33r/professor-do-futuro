// ============================================================
// PROFESSOR DO FUTURO — tutor-chat (Edge Function / Deno)
// POST { mensagem, historico?, contexto? } → { resposta, sugestoes[] }
// CORREÇÃO: gpt-oss-20b quebra com response_format json (400) →
// tutor usa TEXTO livre + parsing tolerante ("||| sug1 | sug2").
// Principal (120b) primeiro; rápido só como reserva + 1 retry.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { json, textoLimpo, usuarioAutenticado, CORS_HEADERS } from '../_shared/ia.ts';

const GROQ_KEY = Deno.env.get('GROQ_API_KEY') || '';
const GROQ_MODELO = Deno.env.get('GROQ_MODELO') || 'openai/gpt-oss-120b';
const GROQ_MODELO_RAPIDO = Deno.env.get('GROQ_MODELO_RAPIDO') || 'openai/gpt-oss-20b';

const SISTEMA = [
  'Você é o Tutor do Professor do Futuro: mentor brasileiro, acolhedor e DIRETO,',
  'especialista em didática, inclusão (AEE/TEA/TDAH) e IA na escola.',
  'Conhece o Laboratório: Atividade A4, Plano de Aula, Quiz, Rubrica, Simplificador, ENEM (apoio).',
  'REGRAS DURAS:',
  '1) Responda EXATAMENTE o que foi pedido — cite o tema do professor na resposta.',
  '2) Prático: 1 resposta direta + 1 ação imediata + 1 ferramenta do site.',
  '3) Curto (até 150 palavras); detalhado SÓ se pedirem.',
  '4) Pediu atividade/plano/quiz? ENTREGUE o conteúdo pronto, não só diga onde clicar.',
  '5) Sem dado pessoal. ENEM oficial é da banca (você dá APOIO).',
  'FORMATO: TEXTO simples. Na última linha escreva "|||" + 3 sugestões curtas com " | ".',
].join(' ');

async function chatGroq(mensagens: unknown[], modelo: string, maxTokens: number): Promise<string> {
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + GROQ_KEY },
    // SEM response_format: gpt-oss quebra o JSON (400 json_validate_failed).
    body: JSON.stringify({ model: modelo, messages: mensagens, temperature: 0.6, max_tokens: maxTokens }),
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
    const hist = Array.isArray(c?.historico) ? c.historico.slice(-8) : [];
    const msgs: unknown[] = [{ role: 'system', content: SISTEMA }];
    for (const h of hist) {
      if (h && typeof h === 'object') {
        const papel = (h as any).role === 'assistant' ? 'assistant' : 'user';
        const txt = textoLimpo((h as any).content, 800);
        if (txt) msgs.push({ role: papel, content: txt });
      }
    }
    const pagina = textoLimpo(c?.contexto, 120);
    msgs.push({ role: 'user', content: (pagina ? '[Página: ' + pagina + '] ' : '') + mensagem });

    // PRINCIPAL primeiro (fidelidade); rápido só como reserva.
    let texto = '';
    let modelo = GROQ_MODELO;
    for (const m of [GROQ_MODELO, GROQ_MODELO_RAPIDO]) {
      try {
        texto = await chatGroq(msgs, m, 1000);
        modelo = m;
        if (texto.trim().length >= 10) break;
      } catch (_) { /* tenta o próximo */ }
    }
    // Reparo: retry pedindo a resposta direta ao tema.
    if (texto.trim().length < 10) {
      texto = await chatGroq(
        [...msgs, { role: 'user', content: 'Responda de forma direta ao meu pedido, em até 150 palavras, citando o tema que pedi.' }],
        GROQ_MODELO, 1000,
      );
      modelo = GROQ_MODELO;
    }

    // Separa "resposta ||| sug1 | sug2 | sug3" com tolerância total.
    const corte = texto.lastIndexOf('|||');
    const resposta = (corte >= 0 ? texto.slice(0, corte) : texto).trim().slice(0, 1500);
    const sugs = (corte >= 0 ? texto.slice(corte + 3) : '').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3);
    return json({
      ok: true,
      resposta: resposta || 'Posso ajudar com planos, atividades, quiz ou inclusão. O que você precisa?',
      sugestoes: sugs.length ? sugs : ['Gerar atividade', 'Plano de aula', 'Ideia de quiz'],
      provedor: 'groq',
      modelo,
      demo: !logado,
    });
  } catch (e) {
    return json({ ok: false, erro: 'Tutor indisponível.', detalhes: String((e as Error).message || e).slice(0, 400) }, 502);
  }
});
