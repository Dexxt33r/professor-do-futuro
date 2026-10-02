// ============================================================
// PROFESSOR DO FUTURO — PoC ETAPA 1: Teste de Conexão Groq
// ------------------------------------------------------------
// Roda local (Node 20+):
//   cd site/backend
//   node scripts/test-groq.mjs
//
// O que faz: lê GROQ_API_KEY do .env.local (nunca hardcode),
// chama o Modelo Principal (GROQ_MODELO) e confirma
// que a API respondeu com sucesso.
//
// NOTA (02/10/2026): os modelos llama-3.3-70b-versatile e
// llama-3.1-8b-instant foram DESCONTINUADOS pela Groq — a conta
// usada aqui só lista os modelos ativos abaixo. Por isso o
// padrão passou a ser openai/gpt-oss-120b (principal) e
// openai/gpt-oss-20b (rápido). Veja scripts/list-models.mjs.
// ============================================================

import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
// scripts/ -> backend/ -> carrega site/backend/.env.local (e .env como fallback)
dotenv.config({ path: path.join(__dir, '..', '.env.local') });
dotenv.config({ path: path.join(__dir, '..', '.env') });

import Groq from 'groq-sdk';

const KEY = process.env.GROQ_API_KEY || '';
const MODELO_PRINCIPAL = process.env.GROQ_MODELO || 'openai/gpt-oss-120b';

function mascara(k) {
  if (!k) return '(vazia)';
  if (k.length <= 10) return k.slice(0, 3) + '***';
  return k.slice(0, 7) + '...' + k.slice(-4) + ` (${k.length} chars)`;
}

console.log('— Professor do Futuro · PoC Groq —');
console.log('Modelo principal:', MODELO_PRINCIPAL);
console.log('GROQ_API_KEY:', mascara(KEY));

if (!KEY) {
  console.error('\n✗ FALHA: GROQ_API_KEY não encontrada.');
  console.error('  Crie site/backend/.env.local com: GROQ_API_KEY=gsk_...');
  process.exit(1);
}

const groq = new Groq({ apiKey: KEY });
const inicio = Date.now();

try {
  const resp = await groq.chat.completions.create({
    model: MODELO_PRINCIPAL,
    messages: [
      {
        role: 'system',
        content:
          'Você é um professor brasileiro experiente, especialista em didática. Responda de forma curta e objetiva.',
      },
      {
        role: 'user',
        content:
          'Teste de conexão: responda exatamente com um JSON {"status":"Conexao OK","modelo":"' +
          MODELO_PRINCIPAL +
          '"} e nada mais.',
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0,
    max_tokens: 200,
  });

  const ms = Date.now() - inicio;
  const texto = resp?.choices?.[0]?.message?.content ?? '';
  console.log('\n✓ SUCESSO: a API da Groq respondeu em ' + ms + ' ms');
  console.log('Modelo usado:', resp?.model || MODELO_PRINCIPAL);
  console.log('Resposta:', texto);

  try {
    const j = JSON.parse(texto);
    if (j.status === 'Conexao OK') console.log('✓ JSON válido — PoC APROVADA.');
    else console.log('! JSON válido, mas status inesperado:', j);
  } catch {
    console.log('! Resposta não é JSON puro, mas a conexão funcionou.');
  }
} catch (err) {
  console.error('\n✗ FALHA na chamada à Groq:');
  console.error(' ', err?.message || err);
  if (err?.status) console.error('  HTTP status:', err.status);
  process.exit(1);
}
