// Script auxiliar: aplica as mudanças da ETAPA 3 no ferramentas.html
// (editar via Node evita problema de encoding CRLF no editor).
const fs = require('fs');
const P = 'site/ferramentas.html';
let t = fs.readFileSync(P, 'utf8');
let n = 0;
function rep(a, b) {
  if (!t.includes(a)) { console.log('NAO ACHOU:', JSON.stringify(a.slice(0, 80))); return; }
  t = t.split(a).join(b);
  n++;
}

// 1) Plano: texto + checkbox IA + status
rep(
  '<p><b>Dica:</b> depois de gerar, clique em <b>Copiar texto</b>',
  '<label class="lab-check" for="p-ia"><input type="checkbox" id="p-ia" checked><span>Usar IA nesta geração (recomendado)<small>Desmarcado, o plano é montado no modo offline, sem sair do navegador.</small></span></label><p><b>Dica:</b> depois de gerar, clique em <b>Copiar texto</b>'
);
rep(
  '<button type="submit" class="btn btn-primary">⚡ Gerar plano</button>',
  '<button type="submit" class="btn btn-primary" id="pGerar">⚡ Gerar plano</button>'
);
rep(
  '<div class="plano-out" id="planoOut" aria-live="polite"></div>',
  '<p class="lab-status" id="pStatus" aria-live="polite"></p><div class="plano-out" id="planoOut" aria-live="polite"></div>'
);

// 2) Quiz: botão gerar com IA + status
rep(
  '<button class="btn btn-outline" id="qAdd">➕ Adicionar pergunta</button>',
  '<button class="btn btn-outline" id="qAdd">➕ Adicionar pergunta</button><button class="btn btn-outline" id="qGerarIA" type="button">🤖 Gerar perguntas com IA</button>'
);
rep(
  '<span style="color:var(--text-muted);font-size:.85rem" id="qHint">',
  '<span class="lab-status" id="qStatus" aria-live="polite"></span><span style="color:var(--text-muted);font-size:.85rem" id="qHint">'
);

// 3) Rubrica: botão IA passa a chamar a função gerar-rubrica
rep(
  '<button class="btn btn-primary" id="rubGerar" style="justify-self:start">⚡ Gerar rubrica</button>',
  '<button class="btn btn-primary" id="rubGerar" style="justify-self:start">⚡ Gerar rubrica com IA</button><p class="lab-status" id="rubStatus" aria-live="polite"></p>'
);

// 4) Simplificador: botão IA
rep(
  '<button class="btn btn-primary" id="simpBtn">✨ Simplificar</button>',
  '<button class="btn btn-primary" id="simpBtn">✨ Simplificar com IA</button><p class="lab-status" id="simpStatus" aria-live="polite"></p>'
);

// 5) ENEM: botão de correção com IA
rep(
  '<button class="btn btn-primary" id="enemCalc">🧮 Calcular nota (0–1000)</button>',
  '<button class="btn btn-primary" id="enemCalc">🧮 Calcular nota (0–1000)</button><button class="btn btn-outline" id="enemIA" type="button">🤖 Corrigir com IA</button><p class="lab-status" id="enemStatus" aria-live="polite"></p>'
);

// 6) carrega js/ia.js antes dos demais scripts do laboratório
rep(
  '<script src="js/enemcorrector.js"></script>',
  '<script src="js/ia.js"></script><script src="js/enemcorrector.js"></script>'
);

// 7) Atividade rápida: aviso de que agora pode usar IA via Gerar Atividade
rep(
  '<h2>🧩 Gerador de Atividade Rápida</h2>',
  '<h2>🧩 Gerador de Atividade Rápida (offline)</h2>'
);

fs.writeFileSync(P, t);
console.log('OK - substituicoes:', n);
