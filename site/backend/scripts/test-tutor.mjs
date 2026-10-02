// ETAPA 4 (corrigido): teste do tutor-chat em TEXTO livre
// (sem response_format — o gpt-oss-20b quebra o JSON).
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
const pergunta = process.argv.slice(2).join(' ') || 'Sou professor do 5º ano. Me dê uma ideia rápida de atividade de frações.';
const r = await groq.chat.completions.create({
  model: MODELO,
  messages: [
    { role: 'system', content: 'Você é o Tutor do Professor do Futuro. Responda em até 150 palavras, citando o tema pedido. Na última linha escreva "|||" + 3 sugestões curtas com " | ".' },
    { role: 'user', content: pergunta },
  ],
  temperature: 0.6,
  max_tokens: 1000,
});
const t = r.choices[0].message.content;
console.log('Modelo:', MODELO);
console.log('Pergunta:', pergunta);
console.log('Resposta:', t);
const temTema = /fraç|5º|quinto/i.test(t) || /fraç|5º/i.test(pergunta) === false || t.toLowerCase().includes(pergunta.split(' ').slice(-2)[0].toLowerCase());
console.log('\n✓ TUTOR OK (' + t.length + ' chars)' + (temTema ? ' — cita o tema.' : ''));

