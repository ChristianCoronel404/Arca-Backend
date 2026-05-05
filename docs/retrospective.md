# Sprint Retrospective — 07/05/2026

> Template para la retrospectiva del sprint del hackathon ARCA. Completar el día 07/05.

## Contexto del sprint

- **Producto:** MVP backend de gestión humana para ARCA LTDA.
- **Inicio:** 05/05/2026.
- **Deadline:** 05/05/2026 20:45 (entrega LMS 21:00).
- **Equipo:** Juan José Cordeiro, Marvin Mollo, Alan Flores, Sergio Arias, Leonardo Delgado, Chris Coronel.

## ✅ Qué fue bien

- *(completar)*
- Decisión temprana de usar Supabase en lugar de Postgres en Docker: nos ahorró tiempo y problemas de Windows.
- Schema-per-service en una sola instancia de Postgres: aislamiento sin la sobrecarga de N bases.
- `concurrently` para orquestación local: sencillo, sin Docker, hot reload en cada service.

## ❌ Qué fue mal / qué nos costó

- *(completar)*
- Validación cruzada via HTTP: si `personal-service` cae, los otros tres devuelven 503. Aceptable para MVP, pero no resiliente.

## 🔧 Qué mejorar para el próximo sprint

- *(completar)*
- Agregar tests automatizados (Jest + supertest) en cada service.
- Auth (al menos un middleware básico en el gateway).
- Logging estructurado (pino o winston) y un correlation-id que viaje del gateway a cada service.
- CI con GitHub Actions corriendo lint + tests + migraciones contra una BD efímera.
- Pasar de Decimal stringificado en JSON a Number con precisión controlada (o explicitar siempre el contrato).

## 📊 Métricas del sprint

- Endpoints implementados: *(completar)*.
- Tasa de tests pasados (curl manual / script e2e): *(completar)*.
- Líneas de código aprox: *(completar — `git log --shortstat`)*.

## 🗳️ Acción para sprint siguiente

- *(completar — quién hace qué cuándo)*
