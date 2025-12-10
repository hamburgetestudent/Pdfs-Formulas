@echo off
setlocal
title Generador de Formulas - Build Script

echo ========================================================
echo [BUILD] Iniciando proceso de construccion...
echo ========================================================

:: 1. Verificar Python
echo.
echo [1/4] Verificando instalacion de Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no esta instalado o no esta en el PATH.
    echo Por favor instala Python y vuelve a intentarlo.
    pause
    exit /b 1
)
python --version

:: 2. Verificar Dependencias
echo.
echo [2/4] Verificando dependencias...
if exist "requirements.txt" (
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo [WARNING] Hubo un error instalando dependencias.
        echo Se intentara continuar, pero podria fallar.
    )
) else (
    echo [WARNING] No se encontro requirements.txt, saltando paso.
)

:: 3. Limpieza de procesos y archivos
echo.
echo [3/4] Preparando entorno...
:: Intentar cerrar el programa si esta abierto
taskkill /F /IM "GeneradorFormulas.exe" >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Se cerro una instancia de GeneradorFormulas.exe
)

:: Reintentos para eliminar el archivo si esta bloqueado
if exist "dist\GeneradorFormulas.exe" (
    echo Eliminando version anterior...
    del /f /q "dist\GeneradorFormulas.exe" >nul 2>&1
    if exist "dist\GeneradorFormulas.exe" (
        echo [RETRY] El archivo sigue bloqueado, esperando 2 segundos...
        timeout /t 2 /nobreak >nul
        del /f /q "dist\GeneradorFormulas.exe" >nul 2>&1
        if exist "dist\GeneradorFormulas.exe" (
            echo [ERROR] No se pudo eliminar dist\GeneradorFormulas.exe. El archivo esta en uso.
            echo Cierra la carpeta o el programa y vuelve a intentar.
            pause
            exit /b 1
        )
    )
)

:: 4. Generacion del EXE
echo.
echo [4/4] Generando ejecutable con PyInstaller...
pyinstaller GeneradorFormulas.spec --clean --noconfirm --log-level=WARN

if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo [ERROR] FALLO LA GENERACION DEL .EXE
    echo ========================================================
    echo Revisa los errores arriba.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo [EXITO] .exe generado correctamente en la carpeta dist/
echo ========================================================
echo.
pause
