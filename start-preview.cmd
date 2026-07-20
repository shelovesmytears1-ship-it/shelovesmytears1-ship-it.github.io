@echo off
setlocal
cd /d "%~dp0"
set "PATH=C:\Users\deppe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
"C:\Users\deppe\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "%~dp0node_modules\astro\astro.js" dev --host 127.0.0.1 --port 4321
