/* ============================================================
   PROFESSOR DO FUTURO — js/ia.js (ETAPA 3)
   ------------------------------------------------------------
   Cliente ÚNICO das funções de IA do Laboratório (Opção B:
   1 função por ferramenta). O professor NUNCA digita prompt:
   cada ferramenta envia só campos de formulário e recebe JSON
   pronto para exibir. Com fallback offline onde fizer sentido.
   Funções: gerar-plano, gerar-quiz, gerar-rubrica,
   simplificar-texto, corrigir-redacao (+ gerar-atividade,
   que continua em js/atividade.js).
   ============================================================ */
(function(){
  'use strict';

  function baseURL(){
    var c = (typeof window !== 'undefined') ? window.SUPABASE_CONFIG : null;
    var base = (c && c.url) ? c.url : 'https://ngkkhpvganrfctvyyvle.supabase.co';
    return String(base).replace(/\/+$/, '') + '/functions/v1/';
  }

  function tokenSessao(){
    return new Promise(function(res){
      try{
        if(window.Auth && window.Auth.getSession){
          window.Auth.getSession().then(function(s){
            res(s && s.access_token ? s.access_token : null);
          }).catch(function(){ res(null); });
          return;
        }
      }catch(e){}
      res(null);
    });
  }

  // POST genérico: { funcao, corpo, timeoutMs } → { ok, ...dados, _meta }
  function chamar(funcao, corpo, timeoutMs){
    timeoutMs = timeoutMs || 120000;
    return tokenSessao().then(function(token){
      var cab = { 'Content-Type': 'application/json' };
      var cfg = (typeof window !== 'undefined') ? window.SUPABASE_CONFIG : null;
      if(cfg && cfg.anonKey) cab.apikey = cfg.anonKey;
      if(token) cab.Authorization = 'Bearer ' + token;
      var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var relogio = ctrl ? setTimeout(function(){ ctrl.abort(); }, timeoutMs) : null;
      return fetch(baseURL() + funcao, {
        method: 'POST', headers: cab,
        body: JSON.stringify(corpo || {}),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function(r){
        return r.json().catch(function(){ return null; }).then(function(d){
          if(r.ok && d && d.ok !== false && !d.erro) return d;
          var msg = (d && (d.erro || d.detalhes)) || ('IA não respondeu (' + r.status + ').');
          throw new Error(String(msg));
        });
      }).catch(function(err){
        throw new Error(err && err.name === 'AbortError'
          ? 'A IA demorou demais. Tente de novo ou use o modo offline.'
          : ((err && err.message) || 'Falha ao falar com a IA.'));
      }).then(function(d){
        if(relogio) clearTimeout(relogio);
        return d;
      }, function(err){
        if(relogio) clearTimeout(relogio);
        throw err;
      });
    });
  }

  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Liga um <form> ao padrão: btn loading + status + fallback offline.
  // opts: { form, btn, status, fn (mais usados na UI) ... }
  function statusEl(id, msg, tipo){
    var el = id && document.getElementById(id);
    if(!el) return;
    el.textContent = msg || '';
    el.className = 'lab-status' + (tipo ? ' ' + tipo : '');
  }

  var API = { chamar: chamar, esc: esc, status: statusEl, baseURL: baseURL };
  if(typeof window !== 'undefined') window.LabIA = API;
  if(typeof module !== 'undefined' && module.exports) module.exports = API;
})();
