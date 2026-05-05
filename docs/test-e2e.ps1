# test-e2e.ps1 - Prueba end-to-end del sistema ARCA via API Gateway
# Requiere los 5 servicios corriendo (npm run dev desde Arca-Backend/)

$gateway = "http://localhost:3000"
$ErrorActionPreference = "Stop"

function Show-Step($n, $title) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "PASO $n - $title" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
}

function Show-Json($obj) {
    $obj | ConvertTo-Json -Depth 10 | Write-Host
}

Show-Step 0 "Health check del gateway"
$h = Invoke-RestMethod -Uri "$gateway/health"
Show-Json $h

Show-Step 1 "Listar funcionarios activos"
$funcs = Invoke-RestMethod -Uri "$gateway/api/personal/funcionarios"
Show-Json $funcs
$idJuan = ($funcs | Where-Object { $_.ci -eq "12345678" }).id
$idAna  = ($funcs | Where-Object { $_.ci -eq "87654321" }).id
$idCarlos = ($funcs | Where-Object { $_.ci -eq "11223344" }).id
Write-Host "ids: Juan=$idJuan, Ana=$idAna, Carlos=$idCarlos" -ForegroundColor Yellow

Show-Step 2 "Generar contrato para Juan"
$body = @{ funcionarioId = $idJuan; salario = 8500; periodoPrueba = 90 } | ConvertTo-Json
$contrato = Invoke-RestMethod -Uri "$gateway/api/contratos/contratos" -Method POST -ContentType "application/json" -Body $body
Show-Json $contrato

Show-Step 3 "Obtener documento del contrato (text/plain)"
$doc = Invoke-RestMethod -Uri "$gateway/api/contratos/contratos/$($contrato.id)/documento"
Write-Host $doc

Show-Step 4 "Generar boleta de Juan periodo 2026-05"
$body = @{ funcionarioId = $idJuan; periodo = "2026-05" } | ConvertTo-Json
try {
    $boleta = Invoke-RestMethod -Uri "$gateway/api/pagos/boletas" -Method POST -ContentType "application/json" -Body $body
    Show-Json $boleta
} catch {
    Write-Host "Boleta ya existe (es esperado en runs sucesivos): $($_.ErrorDetails.Message)" -ForegroundColor Yellow
}

Show-Step 5 "Saldo de vacaciones de Juan"
$saldo = Invoke-RestMethod -Uri "$gateway/api/vacaciones/vacaciones/saldo/$idJuan"
Show-Json $saldo

Show-Step 6 "Intentar vacaciones de Ana (debe fallar por antiguedad)"
$body = @{ funcionarioId = $idAna; fechaInicio = "2026-06-01"; fechaFin = "2026-06-05" } | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$gateway/api/vacaciones/vacaciones" -Method POST -ContentType "application/json" -Body $body
    Write-Host "ERROR: deberia haber rechazado" -ForegroundColor Red
} catch {
    Write-Host "OK: rechazado como se esperaba" -ForegroundColor Green
    Write-Host $_.ErrorDetails.Message
}

Show-Step 7 "Solicitar 5 dias de vacaciones para Juan"
$body = @{ funcionarioId = $idJuan; fechaInicio = "2026-09-01"; fechaFin = "2026-09-05" } | ConvertTo-Json
try {
    $vac = Invoke-RestMethod -Uri "$gateway/api/vacaciones/vacaciones" -Method POST -ContentType "application/json" -Body $body
    Show-Json $vac
} catch {
    Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
}

Show-Step 8 "Saldo de Juan despues de la solicitud"
$saldoFinal = Invoke-RestMethod -Uri "$gateway/api/vacaciones/vacaciones/saldo/$idJuan"
Show-Json $saldoFinal

Write-Host ""
Write-Host "Test E2E completo." -ForegroundColor Green
