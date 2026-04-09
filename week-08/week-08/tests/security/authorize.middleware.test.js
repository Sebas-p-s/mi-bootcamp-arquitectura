import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { authorize } from '../../src/interfaces/http/middlewares/authorize.js';
import { validate } from '../../src/interfaces/http/middlewares/validate.js';
import { z } from 'zod';

// Helper para simular req/res/next de Express
const makeCtx = (role) => {
  const res = {
    _status: null,
    _body: null,
    status(s) { this._status = s; return this; },
    json(b)   { this._body = b;   return this; },
  };
  return {
    req: { user: role ? { userId: 'u-1', role } : undefined },
    res,
  };
};

// ─── authorize ────────────────────────────────────────────────────────────────

describe('authorize middleware — Rechum RBAC', () => {
  it('permite acceso a RRHH cuando se requiere RRHH', () => {
    const { req, res } = makeCtx('RRHH');
    let nextCalled = false;
    authorize('RRHH', 'ADMIN')(req, res, () => { nextCalled = true; });
    assert.ok(nextCalled, 'next() debe llamarse para RRHH');
  });

  it('permite acceso a ADMIN en cualquier ruta', () => {
    const { req, res } = makeCtx('ADMIN');
    let nextCalled = false;
    authorize('EMPLEADO', 'RRHH', 'ADMIN')(req, res, () => { nextCalled = true; });
    assert.ok(nextCalled);
  });

  it('retorna 403 cuando EMPLEADO intenta ruta de RRHH', () => {
    const { req, res } = makeCtx('EMPLEADO');
    authorize('RRHH', 'ADMIN')(req, res, () => {});
    assert.strictEqual(res._status, 403);
    assert.match(res._body.error, /permiso/i);
  });

  it('retorna 403 cuando RRHH intenta ruta solo de ADMIN', () => {
    const { req, res } = makeCtx('RRHH');
    authorize('ADMIN')(req, res, () => {});
    assert.strictEqual(res._status, 403);
  });

  it('retorna 401 cuando no hay usuario autenticado', () => {
    const { req, res } = makeCtx(null);
    authorize('RRHH')(req, res, () => {});
    assert.strictEqual(res._status, 401);
  });
});

// ─── validate ────────────────────────────────────────────────────────────────

describe('validate middleware — Zod schemas', () => {
  const empleadoSchema = z.object({
    nombre: z.string().min(3),
    cargo:  z.string().min(1),
    tipo:   z.enum(['permanente', 'temporal', 'practicante']).default('permanente'),
  });

  const makeReqRes = (body) => ({
    req: { body },
    res: {
      _status: null, _body: null,
      status(s) { this._status = s; return this; },
      json(b)   { this._body = b;   return this; },
    },
  });

  it('permite pasar datos válidos y los sanitiza', () => {
    const { req, res } = makeReqRes({ nombre: 'Ana Torres', cargo: 'Analista' });
    let nextCalled = false;
    validate(empleadoSchema)(req, res, () => { nextCalled = true; });
    assert.ok(nextCalled);
    assert.strictEqual(req.body.tipo, 'permanente'); // valor por defecto aplicado
  });

  it('retorna 400 cuando nombre es muy corto', () => {
    const { req, res } = makeReqRes({ nombre: 'AB', cargo: 'Dev' });
    validate(empleadoSchema)(req, res, () => {});
    assert.strictEqual(res._status, 400);
    assert.ok(res._body.details.nombre);
  });

  it('retorna 400 cuando falta campo obligatorio', () => {
    const { req, res } = makeReqRes({ nombre: 'Ana Torres' }); // sin cargo
    validate(empleadoSchema)(req, res, () => {});
    assert.strictEqual(res._status, 400);
  });

  it('retorna 400 cuando tipo es inválido', () => {
    const { req, res } = makeReqRes({ nombre: 'Ana Torres', cargo: 'Dev', tipo: 'indefinido' });
    validate(empleadoSchema)(req, res, () => {});
    assert.strictEqual(res._status, 400);
  });
});
