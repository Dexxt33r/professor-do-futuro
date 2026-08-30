/* ============================================================
   PROFESSOR DO FUTURO — guard.js  (gate de autenticação)
   Deve ser carregado NO <head> das páginas protegidas,
   logo APÓS loader.js (a página de carregamento).

   Novo comportamento (corrige travamentos, lentidão e o bug
   de "pede pra logar de novo"):

   • Se o navegador já tem uma sessão salva → a página é liberada
     IMEDIATAMENTE (sem esperar o CDN). A verificação real
     acontece em segundo plano e o splash some ao confirmar.
   • Se NÃO há sessão salva → redireciona para o login na hora,
     sem esperar nada nem mostrar conteúdo.
   • Sem timeout rígido que manda usuário logado para o login
     numa rede lenta (era a causa do "pede pra logar dinovo").
   ============================================================ */
(function(){
  'use strict';

  var PROJECT_REF = 'ngkkhpvganrfctvyyvle'; // referência do projeto Supabase

  // Existe sessão salva no navegador? (login anterior persistido)
  function hasCachedSession(){
    try{
      for(var i = 0; i < localStorage.length; i++){
        var key = localStorage.key(i);
        if(!key) continue;
        if(key.indexOf(PROJECT_REF) === -1) continue;
        if(key.indexOf('-auth-token') === -1) continue;
        var val = localStorage.getItem(key);
        if(val && val.length > 4 && val.indexOf('access_token') > -1) return true;
      }
    }catch(e){}
    return false;
  }

  function goLogin(){
    var dest = encodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
    window.location.replace('login.html?next=' + dest);
  }

  // Libera a página na hora e confirma a sessão em segundo plano.
  function optimistic(){
    // remove qualquer bloqueio de visibilidade (por segurança)
    document.documentElement.classList.remove('pdf-auth-lock');
    if(window.Loader){ window.Loader.setMessage('Verificando seu acesso…'); }

    var started = false;
    function verify(){
      if(started) return;
      started = true;
      if(!window.Auth){ goLogin(); return; }          // sem API de auth → sem acesso
      if(!Auth.configured()){ goLogin(); return; }    // Supabase não configurado → falha fechada
      Auth.requireAuth().then(function(ok){
        // ok === true  → libera (caminho normal)
        // ok === false → requireAuth já redirecionou para o login
        if(ok && window.Loader){ window.Loader.hide(); }
      });
    }

    if(window.Auth){
      Auth.ready(verify);
    } else {
      // auth.js carrega no fim do body; espera o DOM pronto e tenta.
      document.addEventListener('DOMContentLoaded', function(){
        if(window.Auth){ Auth.ready(verify); } else { goLogin(); }
      });
    }

    // Rede de segurança: nunca deixa o splash travar para sempre.
    // A página já foi liberada acima; só esconde o splash em último caso.
    setTimeout(function(){
      document.documentElement.classList.remove('pdf-auth-lock');
      if(!started && window.Loader){ window.Loader.hide(); }
    }, 6000);
  }

  // Porta de entrada
  if(hasCachedSession()){
    optimistic();
  } else {
    // Sem sessão salva → vai direto para o login, sem esperar.
    // Executa no <head>, antes do <body> renderizar: nenhum flash de conteúdo.
    goLogin();
  }

  window.__pdfUnlock = function(){ document.documentElement.classList.remove('pdf-auth-lock'); };
})();