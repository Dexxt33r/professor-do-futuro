@echo off
setlocal
title Professor do Futuro - Testar Site de Vendas

rem ============================================================
rem  PROFESSOR DO FUTURO - testar/ver o SITE DE VENDAS
rem  Uso: testar-vendas.bat [porta]   (porta padrao: 8001)
rem ============================================================

rem Porta (padrao 8001, diferente do site do curso que usa 8000)
set "PORTA=%~1"
if "%PORTA%"=="" set "PORTA=8001"

rem Encontra o Python (py launcher, python ou python3)
set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY where python3 >nul 2>nul && set "PY=python3"
if not defined PY (
    echo [ERRO] Python nao encontrado.
    echo Instale em https://www.python.org/downloads/ e tente novamente.
    pause
    exit /b 1
)

rem Vai para a pasta de vendas (backend/ fica dentro de vendas/, não interfere)
cd /d "%~dp0vendas"
if not exist index.html (
    echo [ERRO] Pasta "vendas" nao encontrada ao lado deste .bat.
    pause
    exit /b 1
)

echo.
echo  ==========================================================
echo   Professor do Futuro - SITE DE VENDAS (preview)
echo  ==========================================================
echo.
echo  Iniciando o servidor em http://localhost:%PORTA% ...
echo.

rem Abre o servidor em uma janela propria
start "Professor do Futuro - Vendas (servidor)" cmd /k "title Professor do Futuro - Vendas & %PY% -m http.server %PORTA%"

rem Da um tempo para o servidor subir e abre a pagina de vendas
timeout /t 2 /nobreak >nul
start "" "http://localhost:%PORTA%/index.html"

echo.
echo  ==========================================================
echo   Servidor rodando em: http://localhost:%PORTA%
echo   O navegador abriu a landing page de vendas.
echo   Para encerrar, feche a janela "... Vendas (servidor)".
echo  ==========================================================
echo.
echo   ATENCAO: enquanto o backend (Mercado Pago/Supabase) nao
echo   estiver configurado, o botao "Comprar" abrira um aviso
echo   de checkout nao configurado - o restante do design pode
echo   ser visualizado normalmente.
echo.
pause