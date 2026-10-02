// ETAPA 4: teste do tutor-chat (conversa curta, via Groq direto).
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dir, '..', '.env.local') });
import Groq from 'groq-sdk';

const KEY = process.env.GROQ_API_KEY || '';
const MODELO = process.env.GROQ_MODELO_RAPIDO || 'openai/gpt-oss-20b';
if (!KEY) { console.error('✗ sem GROQ_API_KEY'); process.exit(1); }

const groq = new Groq({ apiKey: KEY });
const r = await groq.chat.completions.create({
  model: MODELO,
  messages: [
    { role: 'system', content: 'Você é o Tutor do Professor do Futuro. Responda SEMPRE com JSON {"resposta":"...","sugestoes":["a","b","c"]}, máx 60 palavras.' },
    { role: 'user', content: 'Sou professor do 5º ano. Me dê uma ideia rápida de atividade de frações.' },
  ],
  response_format: { type: 'json_object' },
  temperature: 0.7,
  max_tokens: 500,
});
const t = r.choices[0].message.content;
console.log('Modelo:', MODELO);
console.log('Resposta:', t);
const j = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1));
console.log('\n✓ TUTOR OK — resposta:', (j.resposta || '').slice(0, 120) + '…');
console.log('  sugestões:', (j.sugestoes || []).join(' · '));
