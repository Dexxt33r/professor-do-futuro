/* ============================================================
   PROFESSOR DO FUTURO — supabase.js
   Configuração e inicialização do Supabase (Auth).
   ------------------------------------------------------------
   Usa a chave PUBLICABLE (pública/anon), segura para o navegador.
   A chave SECRET (sb_secret_...) NUNCA deve ser colocada aqui —
   ela fica só no script admin criar_conta.js.
   ============================================================ */
(function(){
  'use strict';

  var CFG = {
    url:     'https://ngkkhpvganrfctvyyvle.supabase.co',
    anonKey: 'sb_publishable_esHmq85Hujm6BZM538L1Cg_igZMdFa_'
  };

  window.SUPABASE_CONFIG = CFG;
  window.SUPABASE = null;      // instância do client (preenchida após o SDK carregar)

  function loadSDK(){
    return new Promise(function(res, rej){
      if(window.supabase && window.supabase.createClient){ res(); return; }
      var s = document.createElement('script');
      // SDK do supabase-js v2 HOSPEDADO LOCALMENTE (js/vendor/supabase-js.js).
      // Nada de CDN externo: carrega pelo mesmo servidor do site, muito mais
      // rápido e não depende da disponibilidade de terceiros.
      s.src = 'js/vendor/supabase-js.js';
      s.onload = res;
      s.onerror = function(){ rej(new Error('Falha ao carregar o SDK do Supabase.')); };
      document.head.appendChild(s);
    });
  }

  loadSDK().then(function(){
    var configured = CFG.url.indexOf('COLE_AQUI') === -1 && CFG.anonKey.indexOf('COLE_AQUI') === -1;
    if(configured && window.supabase && window.supabase.createClient){
      window.SUPABASE = window.supabase.createClient(CFG.url, CFG.anonKey);
    }
  }).catch(function(){
    window.SUPABASE = null;
  }).finally(function(){
    document.dispatchEvent(new CustomEvent('supabase-ready'));
  });
})();