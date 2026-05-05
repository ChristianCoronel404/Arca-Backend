# Historias de Usuario — Sistema de Gestión Humana ARCA

## Módulo Personal (60% — base del sistema)

### HU-PER-01 — Alta de funcionario
**Como** responsable de RRHH
**quiero** registrar un nuevo funcionario con sus datos personales y laborales
**para** mantener el padrón actualizado.

**Criterios de aceptación:**
- El sistema valida que CI, nombre, apellido, fechaIngreso, área, cargo y remuneración estén presentes.
- CI es único: si ya existe, devuelve 409.
- Por defecto, el funcionario queda `activo=true`.
- Endpoint: `POST /funcionarios`.

### HU-PER-02 — Modificación de funcionario
**Como** responsable de RRHH
**quiero** modificar el área, cargo o remuneración de un funcionario
**para** reflejar movimientos internos.

**Criterios de aceptación:**
- Solo se aceptan cambios en `area`, `cargo`, `remuneracion`.
- Si el id no existe, devuelve 404.
- Endpoint: `PUT /funcionarios/:id`.

### HU-PER-03 — Baja lógica de funcionario
**Como** responsable de RRHH
**quiero** dar de baja a un funcionario sin perder su histórico
**para** auditoría y trazabilidad.

**Criterios de aceptación:**
- La baja es lógica: marca `activo=false`, no elimina la fila.
- `GET /funcionarios` por defecto solo devuelve activos. `?todos=true` incluye inactivos.
- Endpoint: `DELETE /funcionarios/:id`.

---

## Módulo Contratos (80%)

### HU-CON-01 — Generar contrato
**Como** responsable de RRHH
**quiero** generar el contrato de un funcionario a partir de un template
**para** automatizar la documentación legal.

**Criterios de aceptación:**
- Valida que el `funcionarioId` exista contra `personal-service` (HTTP). Si no existe, 400.
- Toma `nombre`, `apellido`, `ci`, `fechaIngreso` del funcionario; recibe `salario` y `periodoPrueba` en el body.
- Renderiza placeholders `{{nombre}}`, `{{apellido}}`, `{{ci}}`, `{{salario}}`, `{{fechaIngreso}}`, `{{periodoPrueba}}`.
- Endpoint: `POST /contratos`.

### HU-CON-02 — Template parametrizable
**Como** responsable de RRHH
**quiero** poder elegir entre distintos templates de contrato
**para** soportar contratos especiales en el futuro.

**Criterios de aceptación:**
- El campo `template` en el body selecciona el template (default: `"default"`).
- Si el template no existe, se usa el default.

### HU-CON-03 — Consultar documento renderizado
**Como** responsable de RRHH
**quiero** obtener el texto plano del contrato ya generado
**para** imprimirlo o adjuntarlo.

**Criterios de aceptación:**
- Devuelve el documento como `text/plain`.
- Si el id no existe, 404.
- Endpoint: `GET /contratos/:id/documento`.

---

## Módulo Pagos / Boletas (100% — prioridad máxima)

### HU-BOL-01 — Generar boleta de pago
**Como** responsable de pagos
**quiero** generar la boleta mensual de un funcionario
**para** liquidar su sueldo con descuentos correctos.

**Criterios de aceptación:**
- Valida funcionario contra `personal-service`.
- Toma la `remuneracion` actual del funcionario como sueldoBruto.
- Acepta `bonos` opcionales (default 0).
- `periodo` con formato `YYYY-MM`; rechaza otros formatos con 400.
- Cálculo: AFP 12.71%, Salud 3%, neto = bruto − AFP − salud + bonos.
- Constraint `@@unique(funcionarioId, periodo)`: no se puede emitir dos veces la misma boleta.
- Endpoint: `POST /boletas`.

### HU-BOL-02 — Cálculo automático de aportes
**Como** responsable de pagos
**quiero** que el sistema calcule AFP y Salud automáticamente
**para** evitar errores de cálculo manual.

**Criterios de aceptación:**
- AFP = sueldoBruto × 0.1271, redondeado a 2 decimales.
- Salud = sueldoBruto × 0.03, redondeado a 2 decimales.
- Las tasas están centralizadas y son fáciles de modificar.

### HU-BOL-03 — Histórico de boletas
**Como** responsable de pagos
**quiero** consultar las boletas emitidas por funcionario y/o período
**para** auditoría y reimpresión.

**Criterios de aceptación:**
- Filtros: `?funcionarioId=` y `?periodo=YYYY-MM`, combinables.
- Endpoint: `GET /boletas`.

---

## Módulo Vacaciones (70%)

### HU-VAC-01 — Solicitar vacaciones
**Como** funcionario / responsable de RRHH
**quiero** registrar un período de vacaciones a gozar
**para** descontarlo del saldo disponible.

**Criterios de aceptación:**
- Valida funcionario contra `personal-service`.
- Rechaza si la antigüedad es < 1 año.
- Rechaza si los días solicitados superan el saldo disponible de la gestión.
- `gestion` se infiere del año de `fechaInicio`.
- Endpoint: `POST /vacaciones`.

### HU-VAC-02 — Validación de antigüedad y saldo
**Como** sistema
**quiero** aplicar las reglas de antigüedad y saldo automáticamente
**para** evitar otorgamientos indebidos.

**Criterios de aceptación:**
- Antigüedad = años calendario completos desde `fechaIngreso` hasta hoy.
- Días otorgados = años completos × 15.
- Saldo = días otorgados − días ya gozados en la gestión actual.

### HU-VAC-03 — Consultar saldo
**Como** funcionario / responsable de RRHH
**quiero** consultar el saldo disponible de un funcionario
**para** planificar las vacaciones.

**Criterios de aceptación:**
- Devuelve `{antiguedadAnios, gestionesCompletas, diasOtorgados, diasGozados, saldoDisponible}`.
- Endpoint: `GET /vacaciones/saldo/:funcionarioId`.
