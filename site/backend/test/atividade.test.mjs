/* ============================================================
   PROFESSOR DO FUTURO — teste do Gerador de Atividade Pronta
   ------------------------------------------------------------
   Roda no Node (não precisa de internet, de Supabase nem de chave):

     node site/backend/test/atividade.test.mjs

   O que ele verifica:
   • prompt pedagógico montado com os dados do formulário;
   • normalização da resposta da IA (campos faltando, tipos errados);
   • caça-palavras: grade válida e todas as palavras realmente colocadas;
   • folha A4: cabeçalho, questões, linhas de resposta, gabarito e
     a folha do professor, com escape de HTML;
   • modo offline: funciona para todos os tipos de atividade.
   ============================================================ */

import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

import {
  montarPrompt,
  normalizarAtividade,
  limparJson,
  clampInt,
  nomeTipo,
  TIPOS,
} from '../supabase/functions/gerar-atividade/prompt.ts';

const require = createRequire(import.meta.url);
const Ativ = require('../../js/atividade.js');

let ok = 0;
function teste(nome, fn){
  try{ fn(); ok++; console.log('  ✓ ' + nome); }
  catch(err){ console.error('  ✗ ' + nome + '\n     ' + (err && err.message)); process.exitCode = 1; }
}

const PEDIDO = {
  disciplina: 'História',
  ano: '5º ano do Ensino Fundamental',
  tema: 'Revolução Francesa',
  tipo: 'mista',
  quantidade: 6,
  adaptaTdahTea: true,
  adaptaVisual: true,
  incluirGabarito: true,
  observacoes: 'turma agitada após o recreio',
};

/* ---------------- 1) prompt ---------------- */
console.log('\n1) Prompt enviado à IA');
teste('leva disciplina, ano, tema e tipo', () => {
  const p = montarPrompt(PEDIDO);
  ['História', '5º ano do Ensino Fundamental', 'Revolução Francesa', TIPOS.mista.nome].forEach(t => {
    assert.ok(p.includes(t), 'faltou no prompt: ' + t);
  });
});
teste('inclui as regras de TDAH/TEA e de espaçamento amplo', () => {
  const p = montarPrompt(PEDIDO);
  assert.match(p, /TDAH\/AUTISMO/);
  assert.match(p, /ESPAÇAMENTO AMPLO/);
  assert.match(p, /REGRAS FINAIS/);
});
teste('pede exatamente a quantidade de questões', () => {
  assert.match(montarPrompt(PEDIDO), /exatamente 6/);
});
teste('sem adaptação marcada, fala de comandos previsíveis (sem rótulo de diagnóstico)', () => {
  const p = montarPrompt({ ...PEDIDO, adaptaTdahTea: false, adaptaVisual: false });
  assert.match(p, /Sem rótulo de diagnóstico/);
  assert.ok(!/ATIVIDADE ADAPTADA PARA TDAH\/AUTISMO/.test(p));
});
/* ---------------- 2) limpeza e normalização ---------------- */
console.log('\n2) Resposta da IA (limpeza e normalização)');
teste('limpaJson aceita JSON puro', () => {
  assert.deepEqual(limparJson('{"a":1}'), { a: 1 });
});
teste('limpaJson remove cercas de markdown', () => {
  assert.deepEqual(limparJson('```json\n{"a":2}\n```'), { a: 2 });
});
teste('limpaJson recorta texto em volta', () => {
  assert.deepEqual(limparJson('Claro! {"a":3} Espero ter ajudado.'), { a: 3 });
});
teste('limpaJson falha com aviso claro sem JSON', () => {
  assert.throws(() => limparJson('desculpe, não consegui'), /JSON/);
});
teste('clampInt respeita limites', () => {
  assert.equal(clampInt('99', 3, 20, 8), 20);
  assert.equal(clampInt('abc', 3, 20, 8), 8);
  assert.equal(clampInt(2, 3, 20, 8), 3);
});

teste('normaliza resposta incompleta e completa os campos', () => {
  const a = normalizarAtividade({ titulo: 'Prova de frações', questoes: [{ enunciado: 'Quanto é 1/2?' }] }, PEDIDO);
  assert.equal(a.titulo, 'Prova de frações');
  assert.equal(a.questoes.length, 1);
  assert.equal(a.questoes[0].numero, 1);
  assert.equal(a.questoes[0].tipo, 'dissertativa');
  assert.equal(a.questoes[0].linhas_resposta, 4);
  assert.equal(a.gabarito.length, 1);
  assert.ok(a.instrucoes.length >= 3);
});

teste('múltipla escolha: índice inválido cai para a alternativa A', () => {
  const a = normalizarAtividade({
    questoes: [{ enunciado: 'Q', tipo: 'multipla_escolha', alternativas: ['um', 'dois'], correta: 9 }],
  }, PEDIDO);
  assert.equal(a.questoes[0].tipo, 'multipla_escolha');
  assert.equal(a.questoes[0].correta, 0);
  assert.equal(a.questoes[0].linhas_resposta, 0);
  assert.equal(a.gabarito[0].resposta, 'A) um');
});

teste('limita a quantidade de questões ao pedido', () => {
  const muitas = [];
  for (let i = 0; i < 30; i++) muitas.push({ enunciado: 'Q' + i });
  const a = normalizarAtividade({ questoes: muitas }, PEDIDO);
  assert.equal(a.questoes.length, 6);
});

teste('caça-palavras usa palavras-chave quando o tipo é caça-palavras', () => {
  const cp = normalizarAtividade({ palavras_chave: ['REI', 'POVO', 'MOEDA', 'LEI'] }, { ...PEDIDO, tipo: 'caca_palavras' });
  assert.ok(cp.caca_palavras);
  assert.deepEqual(cp.caca_palavras.palavras, ['REI', 'POVO', 'MOEDA', 'LEI']);
  assert.ok(cp.caca_palavras.instrucao.length > 10);

  const semCp = normalizarAtividade({ palavras_chave: ['REI'] }, { ...PEDIDO, tipo: 'multipla' });
  assert.equal(semCp.caca_palavras, null);
});

teste('normaliza lixo total sem quebrar', () => {
  const a = normalizarAtividade('isto não é json', PEDIDO);
  assert.equal(a.questoes.length, 0);
  assert.ok(a.titulo.includes('Revolução Francesa'));
  assert.ok(a.tempo_min >= 5 && a.tempo_min <= 240);
});

teste('nomeTipo devolve rótulo legível', () => {
  assert.equal(nomeTipo('caca_palavras'), 'Caça-palavras');
  assert.equal(nomeTipo('nao_existe'), TIPOS.mista.nome);
});

/* ---------------- 3) caça-palavras (offline, no navegador) ---------------- */
console.log('\n3) Caça-palavras gerado no navegador');
teste('todas as palavras cabem na grade e são encontradas', () => {
  const palavras = ['REVOLUCAO', 'POVO', 'REI', 'BASTILHA'];
  const jogo = Ativ.gerarCacaPalavras(palavras, 12);
  assert.ok(jogo.largura >= 12, 'grade pequena');
  assert.equal(jogo.grade.length, jogo.largura);
  assert.equal(jogo.colocadas.length, palavras.length, 'nem todas as palavras entraram');
  assert.equal(jogo.naoColocadas.length, 0);

  // confere cada palavra na grade, na direção informada
  const direcoes = { '→': [0, 1], '↓': [1, 0], '↘': [1, 1], '↙': [1, -1] };
  jogo.colocadas.forEach(c => {
    const [dl, dc] = direcoes[c.direcao];
    let lida = '';
    for (let k = 0; k < c.palavra.length; k++) lida += jogo.grade[c.linha - 1 + dl * k][c.coluna - 1 + dc * k];
    assert.equal(lida, c.palavra, 'palavra desalinhada: ' + c.palavra);
  });
});
teste('grade só tem letras A–Z', () => {
  const jogo = Ativ.gerarCacaPalavras(['FOTOSSINTESE', 'AGUA', 'LUZ'], 12);
  jogo.grade.forEach(linha => linha.forEach(cel => assert.match(cel, /^[A-Z]$/)));
});
teste('descarta palavras curtas e repetidas', () => {
  const jogo = Ativ.gerarCacaPalavras(['AB', 'REPETIDA', 'repetida'], 12);
  assert.deepEqual(jogo.colocadas.map(c => c.palavra), ['REPETIDA']);
});
teste('é determinístico (mesmo tema → mesmo diagrama)', () => {
  const a = Ativ.gerarCacaPalavras(['MOEDA', 'LEI', 'POVO'], 12);
  const b = Ativ.gerarCacaPalavras(['MOEDA', 'LEI', 'POVO'], 12);
  assert.deepEqual(a.grade, b.grade);
});
teste('palavrasDoTema tira acentos e completa com palavras genéricas', () => {
  const p = Ativ.palavrasDoTema('Fotossíntese e respiração');
  assert.ok(p.includes('FOTOSSINTESE'));
  assert.ok(p.length >= 4);
  p.forEach(w => assert.match(w, /^[A-Z]{4,12}$/));
});

/* ---------------- 4) folha A4 + modo offline ---------------- */
console.log('\n4) Folha A4 (saída para impressão/PDF)');
const OFFLINE = Ativ.fallbackLocal(PEDIDO);

teste('modo offline monta questões para o tema', () => {
  assert.equal(OFFLINE.questoes.length, 6);
  assert.ok(OFFLINE.titulo.includes('Revolução Francesa'));
  OFFLINE.questoes.forEach(q => assert.ok(q.enunciado.includes('Revolução Francesa')));
  assert.ok(OFFLINE.texto_apoio === null, 'offline não inventa texto de apoio');
});

teste('modo offline gera caça-palavras quando o tipo é caça-palavras', () => {
  const a = Ativ.fallbackLocal({ ...PEDIDO, tipo: 'caca_palavras' });
  assert.ok(a.caca_palavras && a.caca_palavras.palavras.length >= 4);
  const semCp = Ativ.fallbackLocal({ ...PEDIDO, tipo: 'multipla' });
  assert.equal(semCp.caca_palavras, null);
});

teste('modo offline avisa que não usou IA', () => {
  assert.ok(OFFLINE.observacoes.join(' ').includes('MODO OFFLINE'));
});

teste('folha do aluno tem cabeçalho, questão, linhas e rodapé', () => {
  const html = Ativ.montarFolhas(OFFLINE, PEDIDO, { fonte: 'offline' });
  assert.match(html, /class="folha folha-aluno/);
  assert.match(html, /Professor do Futuro · Laboratório/);
  assert.match(html, /Aluno\(a\):/);
  assert.match(html, /class="q-bloco"/);
  assert.match(html, /class="q-linhas/);
  assert.match(html, /class="folha-foot"/);
  assert.match(html, /Modo offline \(sem IA\)/);
  assert.ok(!html.includes('undefined'));
  assert.ok(!html.includes('[object Object]'));
});

teste('folha adaptada liga fonte maior e pictogramas', () => {
  const html = Ativ.montarFolhas(OFFLINE, PEDIDO, { fonte: 'offline' });
  assert.match(html, /folha-adapt/);
  assert.match(html, /q-pic/);
});

teste('folha do professor traz gabarito; desmarcada, não traz', () => {
  const com = Ativ.montarFolhas(OFFLINE, PEDIDO, { fonte: 'offline' });
  assert.match(com, /class="folha folha-prof"/);
  assert.match(com, /Gabarito/);
  assert.match(com, /Adaptações aplicadas/);

  const sem = Ativ.montarFolhas(OFFLINE, { ...PEDIDO, incluirGabarito: false }, { fonte: 'offline' });
  assert.ok(!sem.includes('folha-prof'));
});

teste('caça-palavras aparece na folha com diagrama e lista', () => {
  const a = Ativ.fallbackLocal({ ...PEDIDO, tipo: 'caca_palavras' });
  const html = Ativ.montarFolhas(a, { ...PEDIDO, tipo: 'caca_palavras' }, { fonte: 'offline' });
  assert.match(html, /class="caca-grade"/);
  assert.match(html, /class="caca-lista"/);
  assert.match(html, /Gabarito do diagrama/);
});

teste('escapar HTML impede injeção no tema', () => {
  const pedidoMau = { ...PEDIDO, tema: '<img src=x onerror=alert(1)>' };
  const a = Ativ.fallbackLocal(pedidoMau);
  const html = Ativ.montarFolhas(a, pedidoMau, { fonte: 'offline' });
  assert.ok(!html.includes('<img src=x'), 'HTML do tema não foi escapado');
  assert.ok(html.includes('&lt;img'));
});

teste('negrito **assim** vira <b> na folha', () => {
  const a = { ...OFFLINE, questoes: [{ numero: 1, enunciado: '**Explique** o tema', tipo: 'dissertativa', alternativas: [], correta: null, resposta_esperada: '', linhas_resposta: 2, dica: '', pictograma: '💡' }] };
  const html = Ativ.montarFolhas(a, PEDIDO, { fonte: 'ia', provedor: 'gemini' });
  assert.match(html, /<b>Explique<\/b> o tema/);
  assert.match(html, /Gerado com IA gratuita · gemini/);
});

teste('versão em texto tem gabarito e linhas de escrita', () => {
  const txt = Ativ.montarTexto(OFFLINE, PEDIDO);
  assert.match(txt, /GABARITO \(professor\)/);
  assert.match(txt, /_____+/);
  assert.match(txt, /Revolução Francesa/);
});

console.log('\n' + (process.exitCode ? '❌ Falhou' : '✅ ' + ok + ' verificações passaram'));
if (!process.exitCode) console.log('   (teste do gerador de atividade: prompt, IA, caça-palavras e folha A4)\n');

