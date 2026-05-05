# Evidencia de pruebas

Todos los curls fueron ejecutados contra los services corriendo en local. Las respuestas son las literales devueltas durante el smoke test.

> Nota: los tests directos se hacen al puerto del service (3001-3004). Si se prueba a través del gateway en `:3000`, la URL es `http://localhost:3000/api/<servicio><path>`.

---

## personal-service (puerto 3001)

### Listar funcionarios activos
```bash
curl http://localhost:3001/funcionarios
```
**Response:**
```json
[
  {"id":1,"ci":"12345678","nombre":"Juan","apellido":"Perez","fechaIngreso":"2023-01-15T00:00:00.000Z","area":"Operaciones","cargo":"Analista Senior","remuneracion":"8500","activo":true,"createdAt":"2026-05-05T23:30:17.043Z","updatedAt":"2026-05-05T23:30:17.043Z"},
  {"id":2,"ci":"87654321","nombre":"Ana","apellido":"Mendoza","fechaIngreso":"2025-11-01T00:00:00.000Z","area":"Riesgos","cargo":"Asistente","remuneracion":"4200","activo":true,"createdAt":"2026-05-05T23:30:18.152Z","updatedAt":"2026-05-05T23:30:18.152Z"},
  {"id":3,"ci":"11223344","nombre":"Carlos","apellido":"Rojas","fechaIngreso":"2024-03-10T00:00:00.000Z","area":"Tecnologia","cargo":"Tech Lead","remuneracion":"9500","activo":true,"createdAt":"2026-05-05T23:30:19.247Z","updatedAt":"2026-05-05T23:30:49.134Z"}
]
```

### Detalle de un funcionario
```bash
curl http://localhost:3001/funcionarios/1
```

### Alta de funcionario (HU-PER-01)
```bash
curl -X POST http://localhost:3001/funcionarios \
  -H "Content-Type: application/json" \
  -d '{"ci":"99887766","nombre":"Lucia","apellido":"Vargas","fechaIngreso":"2025-06-01","area":"RRHH","cargo":"Coordinadora","remuneracion":6500}'
```
**Response:** `201` con el objeto creado.

### Modificación (HU-PER-02)
```bash
curl -X PUT http://localhost:3001/funcionarios/3 \
  -H "Content-Type: application/json" \
  -d '{"cargo":"Tech Lead","remuneracion":9500}'
```
**Response:** funcionario actualizado.

### Baja lógica (HU-PER-03)
```bash
curl -X DELETE http://localhost:3001/funcionarios/4
```
**Response:** `{"id":4, ..., "activo":false, ...}`.

### Listar incluyendo inactivos
```bash
curl "http://localhost:3001/funcionarios?todos=true"
```

---

## contratos-service (puerto 3002)

### Generar contrato (HU-CON-01)
```bash
curl -X POST http://localhost:3002/contratos \
  -H "Content-Type: application/json" \
  -d '{"funcionarioId":1,"salario":8500,"periodoPrueba":90}'
```
**Response:**
```json
{
  "id":1,"funcionarioId":1,"fechaIngreso":"2023-01-15T00:00:00.000Z",
  "salario":"8500","periodoPrueba":90,"template":"default",
  "documento":"CONTRATO DE TRABAJO\n\nEntre ARCA LTDA y Juan Perez (CI: 12345678), ...",
  "createdAt":"2026-05-05T23:32:27.026Z"
}
```

### Validación cruzada — funcionario inexistente
```bash
curl -X POST http://localhost:3002/contratos \
  -H "Content-Type: application/json" \
  -d '{"funcionarioId":999,"salario":5000,"periodoPrueba":90}'
```
**Response:** `400 {"error":"funcionario no encontrado"}`

### Documento renderizado (HU-CON-03)
```bash
curl http://localhost:3002/contratos/1/documento
```
**Response (text/plain):**
```
CONTRATO DE TRABAJO

Entre ARCA LTDA y Juan Perez (CI: 12345678), se acuerda lo siguiente:

1. Fecha de inicio: 2023-01-15
2. Salario mensual: Bs. 8500.00
3. Periodo de prueba: 90 dias

Firmado en La Paz, Bolivia.
```

---

## pagos-service (puerto 3004)

### Generar boleta (HU-BOL-01, HU-BOL-02)
```bash
curl -X POST http://localhost:3004/boletas \
  -H "Content-Type: application/json" \
  -d '{"funcionarioId":1,"periodo":"2026-05"}'
```
**Response:**
```json
{
  "id":1,"funcionarioId":1,"periodo":"2026-05",
  "sueldoBruto":"8500","aporteAfp":"1080.35","aporteSalud":"255",
  "bonos":"0","sueldoNeto":"7164.65",
  "createdAt":"2026-05-05T23:33:48.972Z"
}
```
Verificación del cálculo: `8500 × 0.1271 = 1080.35`, `8500 × 0.03 = 255`, `8500 - 1080.35 - 255 + 0 = 7164.65`. ✅

### Boleta con bonos
```bash
curl -X POST http://localhost:3004/boletas \
  -H "Content-Type: application/json" \
  -d '{"funcionarioId":3,"periodo":"2026-05","bonos":500}'
```
**Response (sueldo Carlos = 9500):**
```json
{"id":2,"funcionarioId":3,"periodo":"2026-05","sueldoBruto":"9500","aporteAfp":"1207.45","aporteSalud":"285","bonos":"500","sueldoNeto":"8507.55", ...}
```
Verificación: `9500 × 0.1271 = 1207.45`, `9500 × 0.03 = 285`, `9500 - 1207.45 - 285 + 500 = 8507.55`. ✅

### Constraint duplicado (mismo funcionario+periodo)
```bash
curl -X POST http://localhost:3004/boletas \
  -H "Content-Type: application/json" \
  -d '{"funcionarioId":1,"periodo":"2026-05"}'
```
**Response:** `409 {"error":"ya existe boleta para ese funcionario y periodo"}`

### Histórico (HU-BOL-03)
```bash
curl "http://localhost:3004/boletas?funcionarioId=1"
```

---

## vacaciones-service (puerto 3003)

### Saldo de Juan (3 años antigüedad) — HU-VAC-03
```bash
curl http://localhost:3003/vacaciones/saldo/1
```
**Response:**
```json
{"funcionarioId":1,"gestion":2026,"antiguedadAnios":3,"gestionesCompletas":3,"diasOtorgados":45,"diasGozados":0,"saldoDisponible":45}
```

### Saldo de Ana (6 meses)
```bash
curl http://localhost:3003/vacaciones/saldo/2
```
**Response:**
```json
{"funcionarioId":2,"gestion":2026,"antiguedadAnios":0,"gestionesCompletas":0,"diasOtorgados":0,"diasGozados":0,"saldoDisponible":0}
```

### Solicitar vacaciones OK (HU-VAC-01)
```bash
curl -X POST http://localhost:3003/vacaciones \
  -H "Content-Type: application/json" \
  -d '{"funcionarioId":1,"fechaInicio":"2026-06-01","fechaFin":"2026-06-10"}'
```
**Response:** `201` con `diasGozados: 10, gestion: 2026`.

### Rechazo por antigüedad (HU-VAC-02)
```bash
curl -X POST http://localhost:3003/vacaciones \
  -H "Content-Type: application/json" \
  -d '{"funcionarioId":2,"fechaInicio":"2026-06-01","fechaFin":"2026-06-05"}'
```
**Response:** `400 {"error":"el funcionario aun no cumple un anio de antiguedad","antiguedadAnios":0}`

### Rechazo por saldo insuficiente
```bash
curl -X POST http://localhost:3003/vacaciones \
  -H "Content-Type: application/json" \
  -d '{"funcionarioId":1,"fechaInicio":"2026-07-01","fechaFin":"2026-08-19"}'
```
**Response:** `400 {"error":"saldo de vacaciones insuficiente","diasSolicitados":50,"saldoDisponible":35}`

### Saldo después de gozar 10 días
```bash
curl http://localhost:3003/vacaciones/saldo/1
```
**Response:** `{..., "diasGozados":10, "saldoDisponible":35}`

---

## api-gateway (puerto 3000)

### Health
```bash
curl http://localhost:3000/health
```
**Response:** `{"status":"ok","service":"gateway"}`

### Proxeo a personal
```bash
curl http://localhost:3000/api/personal/funcionarios
```
**Response:** lista completa de funcionarios (proxied a `:3001`).

### Proxeo a pagos
```bash
curl http://localhost:3000/api/pagos/boletas
```

### Proxeo a vacaciones
```bash
curl http://localhost:3000/api/vacaciones/vacaciones/saldo/1
```

---

## Flujo end-to-end

1. Sembrar 3 funcionarios (`npm --prefix personal-service run seed`).
2. `POST /api/contratos/contratos` con funcionarioId=1 → contrato renderizado.
3. `POST /api/pagos/boletas` con funcionarioId=1, periodo=2026-05 → boleta calculada.
4. `GET /api/vacaciones/vacaciones/saldo/1` → 45 días disponibles.
5. `POST /api/vacaciones/vacaciones` con 10 días → saldo restante 35.

Ver [test-e2e.ps1](test-e2e.ps1) para ejecución automatizada.
