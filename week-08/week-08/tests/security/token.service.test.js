import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

// Configurar env mínimo antes de importar config
process.env.JWT_SECRET  = 'rechum-test-secret-de-al-menos-32-caracteres-ok';
process.env.APP_NAME    = 'rechum-test';
process.env.BCRYPT_ROUNDS = '10';

const { TokenService } = await import('../../src/infrastructure/security/token.service.js');

describe('TokenService', () => {
  let tokenService;

  before(() => { tokenService = new TokenService(); });

  it('firma y verifica un token válido', () => {
    const payload = { userId: 'emp-123', role: 'RRHH' };
    const token = tokenService.sign(payload);

    assert.ok(typeof token === 'string', 'El token debe ser un string');
    assert.strictEqual(token.split('.').length, 3, 'JWT debe tener 3 segmentos');

    const decoded = tokenService.verify(token);
    assert.strictEqual(decoded.userId, payload.userId);
    assert.strictEqual(decoded.role, payload.role);
  });

  it('incluye el issuer rechum-test en el token', () => {
    const token = tokenService.sign({ userId: '1', role: 'ADMIN' });
    const decoded = tokenService.verify(token);
    assert.strictEqual(decoded.iss, 'rechum-test');
  });

  it('lanza error en token manipulado', () => {
    const token = tokenService.sign({ userId: '1', role: 'EMPLEADO' });
    const tampered = token.slice(0, -5) + 'xxxxx';
    assert.throws(
      () => tokenService.verify(tampered),
      /invalid signature|jwt malformed/i
    );
  });

  it('lanza error en token vacío', () => {
    assert.throws(() => tokenService.verify(''), /jwt must be provided/i);
  });

  it('lanza error en token con formato incorrecto', () => {
    assert.throws(() => tokenService.verify('no.es.un.jwt.valido'), /invalid/i);
  });
});
