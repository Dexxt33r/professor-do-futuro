@echo off
setlocal
title Professor do Futuro - Criar Conta
color 0A
cd /d "%~dp0"

rem ============================================================
rem  CRIA UMA CONTA DE ALUNO NO SUPABASE  (MODO INTERATIVO)
rem  Uso: 2 cliques aqui → o programa pergunta o e-mail e a
rem       senha do cliente, cria a conta e mostra os dados
rem       prontos para você copiar e enviar a ele.
rem ============================================================

echo.
echo  ==========================================================
echo   Professor do Futuro - Criar Conta no Supabase
echo  ==========================================================
echo.

rem Localiza o Node (node.exe) - vendas instaladas via instalador padrao
set "NODE="
where node >nul 2>nul && set "NODE=node"
if not defined NODE (
    if exist "%ProgramFiles%\nodejs\node.exe" set "NODE=%ProgramFiles%\nodejs\node.exe"
)
if not defined NODE (
    if exist "%LocalAppData%\Programs\nodejs\node.exe" set "NODE=%LocalAppData%\Programs\nodejs\node.exe"
)
if not defined NODE (
    echo  [ERRO] Node.js nao encontrado no computador.
    echo  Instale em https://nodejs.org  e tente novamente.
    echo.
    pause
    exit /b 1
)

rem Roda o script. Aceita argumentos opcionais.
rem Para personalizar, use:  criar-conta.bat <EMAIL> <SENHA> [NOME]
"%NODE%" criar_conta.js %1 %2 %3

echo.
echo  ==========================================================
echo   Fim do processo. Verifique a mensagem acima.
echo  ==========================================================
echo.
pause