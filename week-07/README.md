# Rechum Cloud

API REST de gestión de Recursos Humanos. Cloud native, containerizada con Docker.

## Inicio Rápido (Desarrollo)

```bash
# 1. Clonar el repositorio
git clone <url>
cd rechum-cloud

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales reales

# 3. Levantar todos los servicios
docker compose up --build

# 4. Verificar que funciona
curl http://localhost:3000/health
curl http://localhost:3000/api/empleados
```

## Detener Servicios

```bash
docker compose down        # Detener (conservar datos)
docker compose down -v     # Detener + borrar volúmenes (borra la BD)
```

## URLs Disponibles

| Servicio | URL |
|----------|-----|
| API Rechum | http://localhost:3000 |
| Health check | http://localhost:3000/health |
| Readiness | http://localhost:3000/ready |
| pgAdmin | http://localhost:5050 |

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/empleados | Listar todos los empleados |
| GET | /api/empleados/:id | Obtener empleado por ID |
| POST | /api/empleados | Crear empleado |
| PUT | /api/empleados/:id | Actualizar empleado |
| DELETE | /api/empleados/:id | Eliminar empleado |

## Ejemplo de Uso

```bash
# Crear empleado
curl -X POST http://localhost:3000/api/empleados \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana Torres","cargo":"Analista RRHH","tipo":"permanente"}'

# Listar empleados
curl http://localhost:3000/api/empleados
```

## Despliegue en Producción

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Principios 12-Factor Aplicados

| Factor | Implementación |
|--------|---------------|
| III. Config | Toda la config viene de variables de entorno (`src/config.js`) |
| VI. Processes | App stateless — el estado vive en PostgreSQL |
| VII. Port binding | Express escucha en `PORT` del entorno |
| VIII. Concurrency | `replicas: 2` en producción |
| IX. Disposability | Graceful shutdown con `SIGTERM`/`SIGINT` |
| XI. Logs | JSON en stdout, sin archivos de log |

## Estructura del Proyecto

```
rechum-cloud/
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── .dockerignore
├── .gitignore
├── package.json
└── src/
    ├── app.js           # Express sin listen
    ├── server.js        # Entry point + graceful shutdown
    ├── config.js        # Variables de entorno
    ├── routes/
    │   └── empleados.js
    ├── services/
    │   └── empleado-service.js
    └── db/
        ├── pool.js
        └── migrations.js
```
