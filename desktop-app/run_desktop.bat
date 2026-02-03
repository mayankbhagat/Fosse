@echo off
cd /d "%~dp0"
echo Activating Virtual Environment...
call ..\backend\venv\Scripts\activate.bat
echo Starting Desktop App...
python main.py
pause
