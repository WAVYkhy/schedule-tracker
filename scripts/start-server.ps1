$portConns = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portConns) {
    $uniquePids = $portConns | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($p in $uniquePids) {
        if ($p -gt 0) {
            try { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue } catch {}
        }
    }
}
Start-Sleep -Seconds 1
Set-Location -Path "C:\apps\schedule"
$env:PORT = "3000"
$env:NODE_ENV = "production"
$nodePath = (Get-Command node.exe).Source
Start-Process -FilePath $nodePath -ArgumentList "node_modules\next\dist\bin\next start -p 3000" -WorkingDirectory "C:\apps\schedule" -WindowStyle Hidden -RedirectStandardOutput "C:\apps\schedule\server.log" -RedirectStandardError "C:\apps\schedule\server-error.log"
