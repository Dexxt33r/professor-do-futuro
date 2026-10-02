// Parte 2: provedores (Groq principal → rápido, Gemini, OpenRouter).

async function chamarGroq(prompt: string, sistema: string, modelo: string): Promise<string> {
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + GROQ_KEY },
    body: JSON.stringify({
      model: modelo,
      messages: [
        { role: 'system', content: sistema },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 6000,
    }),
  });
  const dados = await r.json().catch(() => null) as any;
  if (!r.ok) throw new Error('Groq [' + modelo + ']: ' + ((dados?.error?.message) || ('HTTP ' + r.status)));
  const texto = dados?.choices?.[0]?.message?.content;
  if (!texto) throw new Error('Groq: resposta vazia.');
  return texto;
}

async function chamarOpenAICompativel(
  url: string, headers: Record<string, string>, modelo: string,
  prompt: string, sistema: string, rotulo: string,
): Promise<string> {
  const r = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: modelo,
      messages: [
        { role: 'system', content: sistema },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 6000,
    }),
  });
  const dados = await r.json().catch(() => null) as any;
  if (!r.ok) throw new Error(rotulo + ' [' + modelo + ']: ' + ((dados?.error?.message) || ('HTTP ' + r.status)));
  const texto = dados?.choices?.[0]?.message?.content;
  if (!texto) throw new Error(rotulo + ': resposta vazia.');
  return texto;
}

async function chamarGemini(prompt: string, modelo: string): Promise<string> {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
    encodeURIComponent(modelo) + ':generateContent?key=' + encodeURIComponent(GEMINI_KEY);
  const generationConfig: Record<string, unknown> = {
    temperature: 0.7, maxOutputTokens: 8192, responseMimeType: 'application/json',
  };
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
  if (!r.ok) throw new Error('Gemini [' + modelo + ']: ' + ((dados?.error?.message) || ('HTTP ' + r.status)));
  const partes = dados?.candidates?.[0]?.content?.parts;
  const texto = Array.isArray(partes) ? partes.map((p: any) => p?.text || '').join('') : '';
  if (!texto) throw new Error('Gemini: resposta vazia.');
  return texto;
}

/** Groq (principal → rápido) → Gemini → OpenRouter. */
export async function gerarComIA(
  prompt: string, sistema: string,
): Promise<{ texto: string; provedor: string; modelo: string }> {
  const erros: string[] = [];
  if (GROQ_KEY) {
    const modelos = [GROQ_MODELO];
    if (GROQ_MODELO_RAPIDO !== GROQ_MODELO) modelos.push(GROQ_MODELO_RAPIDO);
    for (const m of modelos) {
      try {
        return { texto: await chamarGroq(prompt, sistema, m), provedor: 'groq', modelo: m };
      } catch (e) { erros.push(String((e as Error).message || e)); }
    }
  }
  if (GEMINI_KEY) {
    const modelos = [GEMINI_MODELO];
    if (GEMINI_MODELO !== 'gemini-2.5-flash-lite') modelos.push('gemini-2.5-flash-lite');
    for (const m of modelos) {
      try {
        return { texto: await chamarGemini(prompt, m), provedor: 'gemini', modelo: m };
      } catch (e) {
        const msg = String((e as Error).message || e);
        erros.push(msg);
        if (!/not found|not supported|does not exist|404/i.test(msg)) break;
      }
    }
  }
  if (OPENROUTER_KEY) {
    try {
      const texto = await chamarOpenAICompativel(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + OPENROUTER_KEY,
          'HTTP-Referer': SITE_URL, 'X-Title': 'Professor do Futuro',
        },
        OPENROUTER_MODELO, prompt, sistema, 'OpenRouter',
      );
      return { texto, provedor: 'openrouter', modelo: OPENROUTER_MODELO };
    } catch (e) { erros.push(String((e as Error).message || e)); }
  }
  if (!GEMINI_KEY && !GROQ_KEY && !OPENROUTER_KEY) {
    erros.push('Nenhuma chave de IA configurada.');
  }
  if (!erros.length) erros.push('Todos os provedores gratuitos falharam.');
  throw new Error(erros.join(' | '));
}
