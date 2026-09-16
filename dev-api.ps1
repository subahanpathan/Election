$ErrorActionPreference = "Stop"

$env:DATABASE_URL = "postgres://postgres@127.0.0.1:5432/election2026"
$env:PORT = "3000"
$env:NODE_ENV = "development"

$listener = Get-NetTCPConnection -State Listen -LocalPort 3000 -ErrorAction SilentlyContinue
if ($listener) {
    Write-Warning "Port 3000 is already in use by PID $($listener.OwningProcess). Start will fail until that process is stopped."
}

$apiDir = Join-Path $PSScriptRoot "artifacts\api-server"
Push-Location $apiDir
try {
    pnpm run build
    pnpm run start
} finally {
    Pop-Location
}