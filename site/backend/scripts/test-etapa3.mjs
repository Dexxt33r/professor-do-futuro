// ETAPA 3 (Opção B): teste das 5 novas funções de IA.
// Roda local — simula o que cada Edge Function faz:
// montarPrompt(form) → Groq → normalizar.
//   cd site/backend
//   node scripts/test-etapa3.mjs [plano|quiz|rubrica|simp|redacao|todas]
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dir, '..', '.env.local') });

import Groq from 'groq-sdk';

const KEY = process.env.GROQ_API_KEY || '';
const MODELO = process.env.GROQ_MODELO || 'openai/gpt-oss-120b';
if (!KEY) { console.error('✗ sem GROQ_API_KEY'); process.exit(1); }
const groq = new Groq({ apiKey: KEY });

async function gerar(sistema, prompt) {
  const r = await groq.chat.completions.create({
    model: MODELO,
    messages: [{ role: 'system', content: sistema }, { role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 4000,
  });
  return r.choices[0].message.content;
}

function limpar(t) {
  const ini = t.indexOf('{');
  const fim = t.lastIndexOf('}');
  return JSON.parse(t.slice(ini, fim + 1));
}

const alvo = process.argv[2] || 'todas';
const S = 'Você é um professor brasileiro experiente. Responda SEMPRE com JSON válido, sem markdown.';
let pass = 0;
let fail = 0;

async function caso(nome, prompt, valida) {
  try {
    const t = await gerar(S, prompt);
    const j = limpar(t);
    valida(j);
    pass++;
    console.log('  ✓ ' + nome);
  } catch (e) {
    fail++;
    console.log('  ✗ ' + nome + ' → ' + (e.message || e).slice(0, 160));
  }
}

console.log('— ETAPA 3 · teste das 5 funções (' + MODELO + ') —');

if (alvo === 'plano' || alvo === 'todas') {
  await caso('gerar-plano: plano de Frações', 'Plano de aula sobre Frações (Anos Iniciais, 50min). JSON: {"titulo":"...","objetivo":"...","blocos":["..."],"slides":["..."],"quiz":["..."],"inclusao":"..."}', (j) => {
    if (!j.titulo || !j.objetivo || !j.blocos?.length) throw new Error('plano incompleto');
  });
}
if (alvo === 'quiz' || alvo === 'todas') {
  await caso('gerar-quiz: 3 perguntas', 'Quiz com 3 perguntas sobre Fotossíntese. JSON: {"quiz":[{"pergunta":"...","alternativas":["a","b","c"],"correta":0}]}', (j) => {
    if (j.quiz?.length !== 3) throw new Error('esperava 3, veio ' + j.quiz?.length);
  });
}
if (alvo === 'rubrica' || alvo === 'todas') {
  await caso('gerar-rubrica: apresentação oral', 'Rubrica para apresentação oral (Fundamental). JSON: {"titulo":"...","criterios":[{"nome":"...","niveis":["a","b","c"]}]}', (j) => {
    if (!j.criterios?.length) throw new Error('sem critérios');
  });
}
if (alvo === 'simp' || alvo === 'todas') {
  await caso('simplificar-texto: língua fácil', 'Reescreva em língua fácil: "A utilização de recursos hídricos necessita de manejo adequado." JSON: {"frases":["..."],"trocas":["..."]}', (j) => {
    if (!j.frases?.length) throw new Error('sem frases');
  });
}
if (alvo === 'redacao' || alvo === 'todas') {
  await caso('corrigir-redacao: C1–C5', 'Corrija (Enem C1–C5, notas 0/40/80/120/160/200): tema "Meio ambiente", texto "O meio ambiente precisa de cuidado. É importante reciclar e economizar água. Todos devem participar da preservação com ações diárias. O governo deve criar leis e campanhas. Assim teremos um futuro melhor para todos sempre." JSON: {"c1":120,"c2":120,"c3":120,"c4":120,"c5":120,"comentarios":["..."]}', (j) => {
    const s = (j.c1 || 0) + (j.c2 || 0) + (j.c3 || 0) + (j.c4 || 0) + (j.c5 || 0);
    if (s <= 0 || s > 1000) throw new Error('total inválido: ' + s);
    console.log('    (total de apoio: ' + s + '/1000)');
  });
}

console.log(fail ? `\n❌ ${fail} falhou / ${pass} passou` : `\n✓ ETAPA 3 APROVADA — ${pass} funções responderam.`);
process.exit(fail ? 1 : 0);
