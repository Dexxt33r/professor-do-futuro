// ============================================================
// PROFESSOR DO FUTURO — PoC ETAPA 1 (atalho na raiz)
// ------------------------------------------------------------
// O teste real mora em: site/backend/scripts/test-groq.mjs
// Este arquivo só repassa a execução para lá, então
// `node scripts/test-groq.mjs` (a partir da raiz) funciona.
// Uso:
//   node scripts/test-groq.mjs
// ============================================================

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const alvo = path.join(raiz, 'site', 'backend', 'scripts', 'test-groq.mjs');

console.log('→ repassando para', 'site/backend/scripts/test-groq.mjs …\n');

const r = spawnSync(process.execPath, [alvo], {
  cwd: path.join(raiz, 'site', 'backend'),
  stdio: 'inherit',
});
process.exit(r.status ?? 1);
