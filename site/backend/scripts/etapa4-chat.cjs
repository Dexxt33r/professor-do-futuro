// ETAPA 4: injeta o chat flutuante (js/ia.js + js/tutor.js) em TODAS as páginas.
const fs = require('fs');
const path = require('path');
const dir = 'site';
const paginas = fs.readdirSync(dir).filter((f) => f.endsWith('.html'));
let ok = 0;
for (const f of paginas) {
  const P = path.join(dir, f);
  let t = fs.readFileSync(P, 'utf8');
  if (t.includes('js/tutor.js')) { console.log('ja tem:', f); continue; }
  const marcador = '<script src="js/main.js"></script>';
  const injecao = '<script src="js/ia.js"></script><script src="js/tutor.js"></script>';
  if (t.includes(marcador)) {
    t = t.split(marcador).join(injecao + marcador);
  } else if (t.includes('</body>')) {
    t = t.split('</body>').join(injecao + '</body>');
  } else {
    console.log('sem ponto de injecao:', f);
    continue;
  }
  fs.writeFileSync(P, t);
  ok++;
  console.log('injetado:', f);
}
console.log('OK - paginas atualizadas:', ok);
