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
  'Você é o Tutor do Professor do Futuro: um mentor brasileiro, acolhedor e OBJETIVO,',
  'especialista em didática, BNCC, inclusão (AEE, TEA, TDAH, altas habilidades) e uso de IA na escola.',
  '',
  'O site onde você está integrado tem:',
  '- Curso em 6 módulos: 1) Slides com IA, 2) Inclusão e AEE, 3) IA na Prática Escolar,',
  '  4) Gestão de Sala de Aula, 5) Educação Financeira, 6) Nanotecnologia.',
  '- Biblioteca de slides (slides.html) e mais de 58 prompts prontos (prompts.html).',
  '- Laboratório (ferramentas.html): Gerar Atividade Pronta (#gerar), Plano de Aula com IA (#plano),',
  '  Quiz com IA (#quiz), Rubrica (#rubrica), Simplificador de texto (#simplificador) e apoio ao ENEM (#enem).',
  '',
  'COMO RESPONDER:',
  '1) Responda EXATAMENTE o que foi pedido e cite o tema/turma que o professor mencionou.',
  '2) Estrutura: resposta direta → passo a passo curto → ferramenta do site que ajuda.',
  '3) Se pedirem atividade, plano, quiz, rubrica, adaptação ou explicação: ENTREGUE o conteúdo PRONTO e completo,',
  '   não apenas diga onde clicar. Use tópicos com "-" e **negrito** para destacar.',
  '4) Tamanho: 120 a 200 palavras em geral; detalhe mais só se o professor pedir.',
  '5) Português do Brasil, linguagem simples e prática, sem jargão.',
  '6) Nunca invente leis, datas ou números oficiais; se não tiver certeza, oriente a conferir a BNCC/currículo.',
  '7) Não peça nem use dados pessoais de alunos.',
  '8) ENEM: você dá APOIO — a correção oficial é da banca.',
  '',
  'FORMATO DE SAÍDA: texto em markdown simples (parágrafos curtos, listas com "-", **negrito**).',
  'Na ÚLTIMA linha escreva "|||" seguido de 3 sugestões curtas de próximo passo, separadas por " | ".',
].join('\n');

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
    const hist = Array.isArray(c?.historico) ? c.historico.slice(-10) : [];
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
        texto = await chatGroq(msgs, m, 1400);
        modelo = m;
        if (texto.trim().length >= 10) break;
      } catch (_) { /* tenta o próximo */ }
    }
    // Reparo: retry pedindo a resposta direta ao tema.
    if (texto.trim().length < 10) {
      texto = await chatGroq(
        [...msgs, { role: 'user', content: 'Responda de forma direta ao meu pedido, em até 180 palavras, citando o tema que pedi e usando tópicos com "-".' }],
        GROQ_MODELO, 1400,
      );
      modelo = GROQ_MODELO;
    }

    // Separa "resposta ||| sug1 | sug2 | sug3" com tolerância total.
    const corte = texto.lastIndexOf('|||');
    const resposta = (corte >= 0 ? texto.slice(0, corte) : texto).trim().slice(0, 2200);
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
