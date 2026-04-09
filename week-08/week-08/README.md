# Rechum Secure — Semana 08: Capa de Seguridad

Capa de seguridad completa sobre la API de Recursos Humanos Rechum.

## Lo que incluye

- Registro y login con contraseñas hasheadas (bcrypt)
- Tokens JWT para autenticación sin estado
- RBAC con 3 roles: EMPLEADO, RRHH, ADMIN
- Hardening: Helmet, rate limiting, CORS, validación Zod
- Tests de seguridad sin BD ni servidor

## Roles y Permisos

| Rol | Puede hacer |
|-----|-------------|
| EMPLEADO | Ver listado de empleados |
| RRHH | Todo lo anterior + crear y actualizar empleados |
| ADMIN | Todo lo anterior + eliminar empleados + gestión de usuarios |

## Instalación y Uso

```bash
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env — especialmente JWT_SECRET (mínimo 32 caracteres)

# Correr tests (sin BD ni servidor)
npm test

# Levantar servidor
npm start
```

## Tests

```bash
node --test tests/security/

# Resultado esperado:
# ✓ TokenService - firma y verifica un token válido
# ✓ TokenService - incluye el issuer rechum-test en el token
# ✓ TokenService - lanza error en token manipulado
# ✓ TokenService - lanza error en token vacío
# ✓ TokenService - lanza error en token con formato incorrecto
# ✓ authorize middleware - permite acceso a RRHH cuando se requiere RRHH
# ✓ authorize middleware - permite acceso a ADMIN en cualquier ruta
# ✓ authorize middleware - retorna 403 cuando EMPLEADO intenta ruta de RRHH
# ✓ authorize middleware - retorna 403 cuando RRHH intenta ruta solo de ADMIN
# ✓ authorize middleware - retorna 401 cuando no hay usuario autenticado
# ✓ validate middleware - permite pasar datos válidos y los sanitiza
# ✓ validate middleware - retorna 400 cuando nombre es muy corto
# ✓ validate middleware - retorna 400 cuando falta campo obligatorio
# ✓ validate middleware - retorna 400 cuando tipo es inválido
# Duration: < 2000ms
```

## Endpoints

### Autenticación (sin JWT)
```bash
# Registro
POST /auth/register
{ "email": "ana@rechum.com", "password": "mipass123", "role": "RRHH" }

# Login
POST /auth/login
{ "email": "ana@rechum.com", "password": "mipass123" }
# Retorna: { token: "eyJ..." }
```

### Empleados (requieren JWT)
```bash
# Listar — EMPLEADO, RRHH, ADMIN
GET /api/empleados
Authorization: Bearer <token>

# Crear — RRHH, ADMIN
POST /api/empleados
Authorization: Bearer <token>
{ "nombre": "Carlos Gil", "cargo": "Contador", "tipo": "permanente" }

# Eliminar — solo ADMIN
DELETE /api/empleados/:id
Authorization: Bearer <token>
```

## Verificar Hardening

```bash
# Headers de seguridad (Helmet)
curl -I http://localhost:3000/health
# Debe incluir: x-content-type-options, x-frame-options, etc.

# Rate limiting en /auth (máx 10 intentos por 15 min)
for i in {1..12}; do
  curl -X POST http://localhost:3000/auth/login \
    -H 'Content-Type: application/json' \
    -d '{"email":"x@x.com","password":"wrong"}'
done
# Las últimas respuestas deben ser 429 Too Many Requests
```

## Generar JWT_SECRET seguro

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Estructura

```
src/
├── config.js                          ← Validación con Zod
├── server.js
├── application/
│   ├── ports/secondary/
│   │   └── token.service.port.js
│   └── use-cases/
│       ├── register-user.use-case.js
│       └── login-user.use-case.js
├── infrastructure/
│   ├── repositories/
│   │   └── in-memory-user.repository.js
│   └── security/
│       ├── password.service.js        ← bcrypt
│       ├── token.service.js           ← JWT
│       └── rate-limiter.js
└── interfaces/http/
    ├── app.js                         ← Helmet + CORS + rutas
    ├── auth.controller.js
    └── middlewares/
        ├── authenticate.js            ← Verifica JWT
        ├── authorize.js               ← Verifica rol (RBAC)
        └── validate.js                ← Valida con Zod
tests/security/
├── token.service.test.js              ← 5 pruebas
└── authorize.middleware.test.js       ← 9 pruebas
```

## OWASP Top 10 Cubierto

| Riesgo | Medida |
|--------|--------|
| A03 Injection | Validación con Zod en todos los inputs |
| A05 Security Misconfiguration | Helmet con headers seguros |
| A07 Auth failures | Mensajes genéricos, rate limiting en /auth |
| A09 Logging failures | Logs JSON en stdout, sin detalles de error al cliente |
