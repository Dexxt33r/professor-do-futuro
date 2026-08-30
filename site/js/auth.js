/* ============================================================
   PROFESSOR DO FUTURO — auth.js
   Login/logout/sessão via Supabase Auth (e-mail + senha).
   As contas são criadas pelo administrador (dono do curso) no
   painel do Supabase — aqui não existe registro público.
   ============================================================ */
(function(){
  'use strict';

  var _ready = false;      // indica se o supabase.js já terminou de carregar
  var _eventQueue = [];    // callbacks aguardando o carregamento

  function whenReady(cb){
    if(_ready){ cb(); return; }
    _eventQueue.push(cb);
  }

  document.addEventListener('supabase-ready', function(){
    _ready = true;
    _eventQueue.forEach(function(cb){ try{ cb(); }catch(e){} });
    _eventQueue = [];
  });

  function getClient(){
    if(!window.SUPABASE){
      return { error:'SUPABASE_NAO_CONFIGURADO' };
    }
    return window.SUPABASE;
  }

  function configured(){
    var c = window.SUPABASE_CONFIG;
    return !!(c && c.url && c.url.indexOf('COLE_AQUI') === -1 && c.anonKey && c.anonKey.indexOf('COLE_AQUI') === -1 && window.SUPABASE);
  }

  /* ---------- API pública (login/logout retornam Promise) ---------- */

  // Login com e-mail + senha (Supabase)
  function login(email, password){
    var sb = getClient();
    if(sb && sb.error === 'SUPABASE_NAO_CONFIGURADO'){
      return Promise.resolve({ ok:false, error:'Login ainda não configurado. Contate o administrador.' });
    }
    return sb.auth.signInWithPassword({ email:email, password:password }).then(function(res){
      if(res.error){
        var msg = res.error.message || 'Não foi possível entrar.';
        if(/invalid login|invalid credentials/i.test(msg)) msg = 'E-mail ou senha incorretos.';
        else if(/not confirmed/i.test(msg)) msg = 'Este e-mail ainda não foi confirmado.';
        else if(/rate limit/i.test(msg)) msg = 'Muitas tentativas. Aguarde alguns segundos e tente de novo.';
        return { ok:false, error:msg };
      }
      document.dispatchEvent(new CustomEvent('auth-change'));
      return { ok:true, user:res.data && res.data.user };
    }).catch(function(err){
      var msg = (err && err.message) || 'Erro inesperado. Tente novamente.';
      if(/rate limit/i.test(msg)) msg = 'Muitas tentativas. Aguarde alguns segundos e tente de novo.';
      return { ok:false, error:msg };
    });
  }

  // Logout (Supabase)
  function logout(){
    var sb = getClient();
    if(sb && sb.error === 'SUPABASE_NAO_CONFIGURADO'){
      return Promise.resolve();
    }
    return sb.auth.signOut().then(function(){
      document.dispatchEvent(new CustomEvent('auth-change'));
    }).catch(function(){});
  }

  // Obtém dados do usuário logado (assíncrono). Retorna objeto ou null.
  function getUser(){
    var sb = getClient();
    if(sb && sb.error === 'SUPABASE_NAO_CONFIGURADO'){
      return Promise.resolve(null);
    }
    return sb.auth.getUser().then(function(res){
      if(res.error || !res.data || !res.data.user) return null;
      var u = res.data.user;
      var meta = u.user_metadata || {};
      return {
        id: u.id,
        email: u.email || '',
        name: meta.name || u.email || '',
        plan: meta.plan || ''
      };
    }).catch(function(){ return null; });
  }

  // Sessão ativa? Retorna a sessão (ou null)
  function getSession(){
    var sb = getClient();
    if(sb && sb.error === 'SUPABASE_NAO_CONFIGURADO'){
      return Promise.resolve(null);
    }
    return sb.auth.getSession().then(function(res){
      return (res && !res.error && res.data && res.data.session) ? res.data.session : null;
    }).catch(function(){ return null; });
  }

  // Escuta mudanças de autenticação
  function onAuthChange(cb){
    var sb = getClient();
    if(sb && sb.error !== 'SUPABASE_NAO_CONFIGURADO'){
      try{ sb.auth.onAuthStateChange(function(event){ cb(event); }); }
      catch(e){ document.addEventListener('auth-change', function(){ cb(); }); }
    } else {
      document.addEventListener('auth-change', function(){ cb(); });
    }
  }

  // Protege páginas que exigem login. Retorna Promise<boolean> (true = liberado)
  function requireAuth(){
    return getSession().then(function(session){
      if(session) return true;
      var dest = encodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
      window.location.replace('login.html?next=' + dest);
      return false;
    });
  }

  // Helper de escape
  function escapeHtml(s){
    return String(s==null?'':s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  window.Auth = {
    configured: configured,
    ready: whenReady,
    login: login,
    logout: logout,
    getUser: getUser,
    getSession: getSession,
    onAuthChange: onAuthChange,
    requireAuth: requireAuth,
    escapeHtml: escapeHtml
  };
})();