import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dir, '..', '.env.local') });

import Groq from 'groq-sdk';
const g = new Groq({ apiKey: process.env.GROQ_API_KEY });
const m = await g.models.list();
console.log('TOTAL: ' + m.data.length);
for (const x of m.data) console.log(' -', x.id);
