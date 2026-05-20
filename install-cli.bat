@echo off
REM Zio-Booster CLI Installation Script
REM This script installs the Zio-Booster CLI tool for command prompt usage without Git

echo ============================================================
echo   Zio-Booster CLI Installer
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not found in PATH.
    echo Please install Python 3.7 or higher from https://python.org
    pause
    exit /b 1
)

echo ✓ Python detected
python --version
echo.

REM Create installation directory
set INSTALL_DIR=%USERPROFILE%\AppData\Local\Zio-Booster
if not exist "%INSTALL_DIR%" (
    echo Creating installation directory...
    mkdir "%INSTALL_DIR%"
)

echo Installing to: %INSTALL_DIR%
echo.

REM Install required packages
echo Installing required packages...
pip install psutil
echo.

REM Copy CLI script to installation directory
echo Copying CLI files...
copy /Y "zio-booster-cli.py" "%INSTALL_DIR%\zio-booster-cli.py"
copy /Y "requirements.txt" "%INSTALL_DIR%\requirements.txt"
echo.

REM Create wrapper batch file
echo Creating command wrapper...
(
echo @echo off
echo REM Zio-Booster CLI Wrapper
echo python "%INSTALL_DIR%\zio-booster-cli.py" %%*
) > "%INSTALL_DIR%\zio-booster.bat"

REM Add to PATH (user-level)
echo.
echo Adding Zio-Booster to PATH...
setx PATH "%PATH%;%INSTALL_DIR%" >nul 2>&1
echo.

echo ============================================================
echo   Installation Complete!
echo ============================================================
echo.
echo You can now use Zio-Booster CLI from any command prompt:
echo   zio-booster boost      - Start optimization
echo   zio-booster status     - Check system status
echo   zio-booster monitor    - Real-time monitoring
echo   zio-booster optimize   - Manual optimization
echo   zio-booster --help     - Show all commands
echo.
echo NOTE: You may need to restart your command prompt for PATH changes to take effect.
echo.
pause
