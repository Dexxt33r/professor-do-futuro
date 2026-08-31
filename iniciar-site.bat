@echo off
setlocal
title Professor do Futuro - Servidor Local

rem ============================================================
rem  PROFESSOR DO FUTURO - servidor local do site
rem  Uso: iniciar-site.bat [porta]   (porta padrao: 8000)
rem ============================================================

rem Porta (padrao 8000)
set "PORTA=%~1"
if "%PORTA%"=="" set "PORTA=8000"

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

rem Vai para a pasta do site (ao lado deste .bat)
cd /d "%~dp0site"
if not exist index.html (
    echo [ERRO] Pasta "site" nao encontrada ao lado deste .bat.
    pause
    exit /b 1
)

echo.
echo  Iniciando o servidor em http://localhost:%PORTA% ...
echo.

rem Abre o servidor em uma janela propria
start "Professor do Futuro - Servidor" cmd /k "title Professor do Futuro - Servidor & %PY% -m http.server %PORTA%"

rem Da um tempo para o servidor subir e abre o navegador
timeout /t 2 /nobreak >nul
start "" "http://localhost:%PORTA%"

echo.
echo  ============================================================
echo   Servidor rodando em: http://localhost:%PORTA%
echo   O navegador abriu a pagina do curso.
echo   Para encerrar, feche a janela "Professor do Futuro - Servidor".
echo  ============================================================
echo.
pause
