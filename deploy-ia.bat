@echo off
setlocal enabledelayedexpansion
title Professor do Futuro - Deploy da IA (Supabase)

rem ============================================================
rem  PROFESSOR DO FUTURO - publicar as FUNCOES DE IA (Edge Functions)
rem  Uso: deploy-ia.bat [nome-da-funcao ...]
rem       sem nome = publica TODAS as funcoes de IA
rem  Ex.: deploy-ia.bat tutor-chat
rem
rem  Por que este .bat existe: a CLI do Supabase procura
rem  "supabase/functions/<nome>/index.ts" a partir da PASTA ATUAL.
rem  Por isso e preciso entrar em site\backend (onde fica supabase\).
rem  Rodar de outro lugar gera: "Entrypoint path does not exist".
rem ============================================================

set "PROJ=ngkkhpvganrfctvyyvle"

where supabase >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Supabase CLI nao encontrado.
  echo Instale com:  npm install -g supabase
  pause
  exit /b 1
)

cd /d "%~dp0site\backend"
if not exist "supabase\functions" (
  echo [ERRO] Pasta "site\backend\supabase\functions" nao encontrada.
  pause
  exit /b 1
)

if "%~1"=="" (
  set "FNS=tutor-chat gerar-atividade gerar-plano gerar-quiz gerar-rubrica simplificar-texto corrigir-redacao"
) else (
  set "FNS=%*"
)

echo.
echo  ==========================================================
echo   Deploy da IA - projeto %PROJ%
echo   Funcoes: !FNS!
echo  ==========================================================
echo.

for %%F in (!FNS!) do (
  echo  --^> Publicando %%F ...
  call supabase functions deploy %%F --project-ref %PROJ%
  if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao publicar %%F. Veja a mensagem acima.
    pause
    exit /b 1
  )
  echo.
)

echo  ==========================================================
echo   Pronto - funcoes publicadas.
echo   Painel: https://supabase.com/dashboard/project/%PROJ%/functions
echo  ==========================================================
pause
