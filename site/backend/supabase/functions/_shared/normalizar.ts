// Parte 3: normalização (front nunca recebe lixo).

export function limparJson(textoBruto: string): unknown {
  if (!textoBruto) throw new Error('Resposta vazia da IA.');
  const t = String(textoBruto).trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(t); } catch (_) { /* recorta abaixo */ }
  const ini = t.indexOf('{');
  const fim = t.lastIndexOf('}');
  if (ini === -1 || fim <= ini) throw new Error('A IA não devolveu JSON.');
  return JSON.parse(t.slice(ini, fim + 1));
}

export function txt(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

export function listaStrings(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) {
    const s = txt(item);
    if (s) out.push(s);
    if (out.length >= max) break;
  }
  return out;
}

export function clampInt(v: unknown, min: number, max: number, padrao: number): number {
  const n = Math.round(Number(v));
  if (!isFinite(n)) return padrao;
  return Math.min(max, Math.max(min, n));
}
