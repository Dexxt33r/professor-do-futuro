/* ============================================================
   PROFESSOR DO FUTURO — teste de INTERFACE do Gerador de Atividade
   ------------------------------------------------------------
   Simula um DOM mínimo (sem navegador, sem jsdom) e roda o fluxo
   real do arquivo site/js/atividade.js:

     node site/backend/test/ui.test.mjs

   Verifica: selects preenchidos, submit → folha A4 no painel,
   aviso de modo offline, botão imprimir chamando window.print(),
   copiar em texto, fechar e validação de tema vazio.
   ============================================================ */

import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

let ok = 0;
function teste(nome, fn){
  try{ fn(); ok++; console.log('  ✓ ' + nome); }
  catch(err){ console.error('  ✗ ' + nome + '\n     ' + (err && err.message)); process.exitCode = 1; }
}

async function testeAsync(nome, fn){
  try{ await fn(); ok++; console.log('  ✓ ' + nome); }
  catch(err){ console.error('  ✗ ' + nome + '\n     ' + (err && err.message)); process.exitCode = 1; }
}

/* ---------------- DOM de mentira ---------------- */
function criarElemento(id){
  return {
    id: id || '',
    value: '', checked: false, disabled: false, textContent: '', innerHTML: '',
    className: '', style: {}, options: [], children: [], scrollTop: 0,
    _h: {},
    addEventListener(ev, fn){ this._h[ev] = fn; },
    appendChild(c){ if(id === 'gAno' || id === 'gTipo') this.options.push(c); else this.children.push(c); },
    setAttribute(){}, focus(){},
    classList: {
      _s: {},
      add(c){ this._s[c] = true; },
      remove(c){ delete this._s[c]; },
      contains(c){ return !!this._s[c]; }
    }
  };
}

const IDS = ['gerarForm','gDisciplinas','gDisciplina','gAno','gTema','gTipo','gQtd','gObs',
  'gTdah','gVisual','gGabarito','gUsarIA','gBtn','gStatus',
  'folhaOverlay','folhaPainel','folhaSub','folhaArea','folhaImprimir','folhaCopiar','folhaFechar','folhaLimpar'];

const nodes = {};
IDS.forEach(id => { nodes[id] = criarElemento(id); });

const htmlEl = criarElemento('html');
globalThis.window = {
  addEventListener(){}, removeEventListener(){},
  print(){ globalThis.__impresso = true; },
  copyText(txt){ globalThis.__copiado = txt; }
};
globalThis.localStorage = { _d:{}, getItem(k){ return this._d[k] || null; }, setItem(k, v){ this._d[k] = v; }, removeItem(k){ delete this._d[k]; } };
globalThis.document = {
  readyState: 'complete',
  getElementById(id){ return nodes[id] || null; },
  createElement(){ return { value:'', textContent:'', setAttribute(){} }; },
  addEventListener(){},
  documentElement: htmlEl
};

/* ---------------- carrega o módulo do site ---------------- */
const require = createRequire(import.meta.url);
const Ativ = require('../../js/atividade.js');

const setValor = (id, v) => { nodes[id].value = v; };
const clicar = id => nodes[id]._h.click();
const enviarForm = () => nodes.gerarForm._h.submit({ preventDefault(){} });

console.log('\nInterface do Gerador de Atividade Pronta');

teste('selects são preenchidos pelo JS', () => {
  assert.equal(nodes.gAno.options.length, Ativ.opcoes.ANOS.length);
  assert.equal(nodes.gTipo.options.length, Ativ.opcoes.TIPOS.length);
  assert.equal(nodes.gDisciplinas.children.length, Ativ.opcoes.DISCIPLINAS.length);
  assert.equal(nodes.gAno.value, '5º ano do Ensino Fundamental');   // padrão
  assert.equal(nodes.gTipo.value, 'mista');
});

teste('tema vazio não gera folha e mostra erro', () => {
  setValor('gTema', '');
  enviarForm();
  assert.match(nodes.gStatus.className, /erro/);
  assert.equal(nodes.folhaPainel.innerHTML, '');
});

teste('gerar no modo offline desenha a folha A4 e abre a pré-visualização', () => {
  setValor('gDisciplina', 'Ciências');
  setValor('gAno', '5º ano do Ensino Fundamental');
  setValor('gTema', 'Fotossíntese');
  setValor('gTipo', 'caca_palavras');
  setValor('gQtd', '5');
  nodes.gTdah.checked = true;
  nodes.gVisual.checked = true;
  nodes.gGabarito.checked = true;
  nodes.gUsarIA.checked = false;          // força o modo offline (sem rede no teste)

  enviarForm();

  const html = nodes.folhaPainel.innerHTML;
  assert.match(html, /class="folha folha-aluno/);
  assert.match(html, /Fotossíntese/);
  assert.match(html, /class="caca-grade"/);
  assert.match(html, /class="folha folha-prof"/);
  assert.equal(nodes.folhaOverlay.classList.contains('open'), true);
  assert.equal(nodes.folhaImprimir.disabled, false);
  assert.equal(nodes.folhaCopiar.disabled, false);
  assert.match(nodes.gStatus.className, /aviso/);
  assert.match(nodes.gStatus.textContent, /offline/i);
  assert.match(nodes.folhaSub.textContent, /offline/i);
  assert.equal(nodes.gBtn.disabled, false);
  assert.equal(nodes.gBtn.textContent, '✨ Gerar Atividade Pronta');
});

teste('a folha é salva no localStorage para a próxima visita', () => {
  const salvo = JSON.parse(globalThis.localStorage.getItem('pdf.lab.gerar'));
  assert.equal(salvo.tema, 'Fotossíntese');
  assert.equal(salvo.disciplina, 'Ciências');
  assert.equal(salvo.adaptaTdahTea, true);
});

await testeAsync('imprimir aciona a janela de impressão do navegador', async () => {
  clicar('folhaImprimir');
  assert.equal(htmlEl.classList.contains('printing-folha'), true);
  await new Promise(r => setTimeout(r, 150));
  assert.equal(globalThis.__impresso, true, 'window.print() não foi chamado');
});

teste('copiar em texto usa o helper global do site', () => {
  clicar('folhaCopiar');
  assert.match(globalThis.__copiado, /Fotossíntese/);
  assert.match(globalThis.__copiado, /GABARITO \(professor\)/);
});

teste('fechar esconde a pré-visualização e libera o scroll', () => {
  clicar('folhaFechar');
  assert.equal(nodes.folhaOverlay.classList.contains('open'), false);
  assert.equal(htmlEl.classList.contains('folha-travada'), false);
});

teste('limpar preferências apaga o que foi salvo', () => {
  clicar('folhaLimpar');
  assert.equal(globalThis.localStorage.getItem('pdf.lab.gerar'), null);
  assert.match(nodes.gStatus.textContent, /apagadas/i);
});

console.log('\n' + (process.exitCode ? '❌ Falhou' : '✅ ' + ok + ' verificações de interface passaram'));
