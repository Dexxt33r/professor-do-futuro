const fs = require('fs');
const P = 'site/ferramentas.html';
let t = fs.readFileSync(P, 'utf8');
const atual = 'js/ia.js"></script><script src="js/enemcorrector.js';
if (t.includes(atual) && !t.includes('js/lab-ia.js')) {
  t = t.split(atual).join('js/ia.js"></script><script src="js/lab-ia.js"></script><script src="js/enemcorrector.js');
  fs.writeFileSync(P, t);
  console.log('lab-ia.js injetado OK');
} else {
  console.log('ja ok ou padrao diferente. tem lab-ia:', t.includes('js/lab-ia.js'));
}
