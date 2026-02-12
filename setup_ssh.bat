@echo off
echo Starting SSH agent...

REM Start SSH agent
start ssh-agent

REM Wait a moment for the agent to start
timeout /t 2 /nobreak >nul

REM Add the SSH key
ssh-add "%USERPROFILE%\.ssh\id_ed25519"

REM Test the connection to GitHub
echo Testing connection to GitHub...
ssh -T git@github.com

pause