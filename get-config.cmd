@echo off
setlocal

for /f "delims=" %%i in ('where /r . daytona.exe') do set daytona_path=%%i

if not defined daytona_path (
    echo Daytona executable not found
    exit /b 1
)

set DAYTONA_TELEMETRY_ENABLED=false
%daytona_path% config --format json -k