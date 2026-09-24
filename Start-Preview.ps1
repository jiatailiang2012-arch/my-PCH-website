$ErrorActionPreference = 'Stop'
$previewRoot = $PSScriptRoot
$previewUrl = 'http://127.0.0.1:3000/'
try {
    $existingPage = Invoke-WebRequest -Uri $previewUrl -TimeoutSec 5
    if ($existingPage.StatusCode -eq 200 -and $existingPage.Content.Contains('Justin Liang')) {
        Write-Output "Preview is already running: $previewUrl"
        exit 0
    }
    throw 'Port 3000 is serving a different application.'
} catch {
    if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) {
        throw 'Port 3000 is occupied. No process was stopped. Check the existing server before restarting.'
    }
}
$previewNode = (Get-Command node.exe -ErrorAction Stop).Source
$previewCli = Join-Path $previewRoot 'node_modules/next/dist/bin/next'
if (!(Test-Path -LiteralPath $previewCli)) { throw 'Next.js is missing. Run npm install from this folder first.' }
$previewLogs = Join-Path $previewRoot '.preview'
New-Item -ItemType Directory -Path $previewLogs -Force | Out-Null
$previewProcess = Start-Process -FilePath $previewNode -ArgumentList @('"' + $previewCli + '"', 'dev', '--hostname', '127.0.0.1', '--port', '3000') -WorkingDirectory $previewRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $previewLogs 'server.log') -RedirectStandardError (Join-Path $previewLogs 'server-error.log') -PassThru
Set-Content -LiteralPath (Join-Path $previewLogs 'server.pid') -Value $previewProcess.Id
for ($attempt = 0; $attempt -lt 30; $attempt++) {
    if ($previewProcess.HasExited) { throw "Preview stopped. See $previewLogs/server-error.log" }
    try {
        $page = Invoke-WebRequest -Uri $previewUrl -TimeoutSec 3
        if ($page.StatusCode -eq 200 -and $page.Content.Contains('Justin Liang')) {
            Write-Output "Preview is ready: $previewUrl (process $($previewProcess.Id))"
            exit 0
        }
    } catch { }
    Start-Sleep -Milliseconds 500
}
throw "Preview did not become ready. See $previewLogs/server-error.log"
