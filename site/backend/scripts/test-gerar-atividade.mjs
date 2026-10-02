// ============================================================
// PROFESSOR DO FUTURO — ETAPA 2: teste ponta-a-ponta local
// ------------------------------------------------------------
// Simula EXATAMENTE o que a Edge Function gerar-atividade faz:
//   1) montarPrompt(pedido)  → prompt pedagógico (servidor)
//   2) Groq principal        → openai/gpt-oss-120b
//      (fallback: GROQ_MODELO_RAPIDO=openai/gpt-oss-20b)
//   3) limparJson + normalizarAtividade → folha pronta
//
// Roda local (Node 20+):
//   cd site/backend
//   node scripts/test-gerar-atividade.mjs [tema]
//
// Ex.: node scripts/test-gerar-atividade.mjs Fotossíntese
// ============================================================

import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dir, '..', '.env.local') });
dotenv.config({ path: path.join(__dir, '..', '.env') });

import Groq from 'groq-sdk';
import {
  montarPrompt,
  normalizarAtividade,
  limparJson,
} from '../supabase/functions/gerar-atividade/prompt.ts';

const KEY = process.env.GROQ_API_KEY || '';
const PRINCIPAL = process.env.GROQ_MODELO || 'openai/gpt-oss-120b';
const RAPIDO = process.env.GROQ_MODELO_RAPIDO || 'openai/gpt-oss-20b';
const SISTEMA =
  'Você é um professor brasileiro experiente, especialista em didática, avaliação da aprendizagem e educação inclusiva (AEE). ' +
  'Escreve atividades escolares objetivas, corretas e adequadas ao ano/série informado. ' +
  'Responde SEMPRE com um único objeto JSON válido, sem markdown e sem texto fora do JSON.';

if (!KEY) {
  console.error('✗ GROQ_API_KEY não encontrada em site/backend/.env.local');
  process.exit(1);
}

// Mesmo pedido que o formulário ferramentas.html#gerar envia
// (só dropdowns/inputs — nenhum prompt digitado pelo usuário).
const pedido = {
  disciplina: 'Ciências',
  ano: '5º ano do Ensino Fundamental',
  tema: process.argv[2] || 'Fotossíntese',
  tipo: 'mista',
  quantidade: 5,
  adaptaTdahTea: true,
  adaptaVisual: false,
  incluirGabarito: true,
  observacoes: '',
};

console.log('— Professor do Futuro · ETAPA 2 (ponta-a-ponta) —');
console.log('Pedido (só formulário):', JSON.stringify(pedido));

const prompt = montarPrompt(pedido);
console.log('Prompt montado no servidor:', prompt.length, 'chars');

const groq = new Groq({ apiKey: KEY });
let texto = '';
let modeloUsado = '';
for (const m of [PRINCIPAL, RAPIDO]) {
  try {
    console.log('\n→ tentando Groq [' + m + '] …');
    const ini = Date.now();
    const r = await groq.chat.completions.create({
      model: m,
      messages: [
        { role: 'system', content: SISTEMA },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 6000,
    });
    texto = r?.choices?.[0]?.message?.content || '';
    modeloUsado = m;
    console.log('  respondeu em ' + (Date.now() - ini) + ' ms (' + texto.length + ' chars)');
    if (texto) break;
  } catch (e) {
    console.log('  falhou: ' + (e?.message || e));
  }
}

if (!texto) {
  console.error('\n✗ Groq não respondeu em nenhum modelo.');
  process.exit(1);
}

const atividade = normalizarAtividade(limparJson(texto), pedido);
console.log('\n✓ ATIVIDADE GERADA');
console.log('  provedor: groq · modelo:', modeloUsado);
console.log('  título:', atividade.titulo);
console.log('  questões:', atividade.questoes.length);
atividade.questoes.slice(0, 3).forEach((q) => {
  console.log(`  ${q.numero}) [${q.tipo}] ${q.enunciado.slice(0, 90)}…`);
});
console.log('  gabarito:', atividade.gabarito.length, 'itens');
console.log('  palavras-chave:', (atividade.palavras_chave || []).slice(0, 6).join(', '));
console.log('\n✓ ETAPA 2 APROVADA: formulário → prompt do servidor → Groq → folha normalizada.');
