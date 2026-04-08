import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Empleado } from '../../src/domain/entities/empleado.entity.js';
import { SalarioVO } from '../../src/domain/value-objects/salario.vo.js';
import { Contrato } from '../../src/domain/aggregates/contrato.aggregate.js';

// ─── SalarioVO ───────────────────────────────────────────────────────────────

describe('SalarioVO', () => {
  it('acepta un salario dentro del rango válido', () => {
    const salario = new SalarioVO(2000000);
    assert.strictEqual(salario.value, 2000000);
  });

  it('rechaza un salario por debajo del mínimo legal', () => {
    assert.throws(
      () => new SalarioVO(500000),
      /Salario inválido/
    );
  });

  it('rechaza un salario por encima del máximo permitido', () => {
    assert.throws(
      () => new SalarioVO(100000000),
      /Salario inválido/
    );
  });

  it('identifica correctamente un salario alto', () => {
    const salario = new SalarioVO(6000000);
    assert.ok(salario.esSalarioAlto);
  });

  it('es inmutable (Object.freeze)', () => {
    const salario = new SalarioVO(2000000);
    assert.throws(() => { salario.value = 9999; }, TypeError);
  });
});

// ─── Empleado Entity ─────────────────────────────────────────────────────────

describe('Empleado entity', () => {
  it('crea un empleado válido con los datos correctos', () => {
    const emp = new Empleado({ nombre: 'Laura Pérez', cargo: 'Analista', tipo: 'permanente' });
    assert.strictEqual(emp.nombre, 'Laura Pérez');
    assert.strictEqual(emp.estado, 'ACTIVO');
  });

  it('rechaza nombre con menos de 3 caracteres', () => {
    assert.throws(
      () => new Empleado({ nombre: 'Li', cargo: 'Dev', tipo: 'permanente' }),
      /al menos 3 caracteres/
    );
  });

  it('rechaza tipo de empleado inválido', () => {
    assert.throws(
      () => new Empleado({ nombre: 'Carlos Ruiz', cargo: 'Dev', tipo: 'indefinido' }),
      /Tipo inválido/
    );
  });

  it('desactiva un empleado activo correctamente', () => {
    const emp = new Empleado({ nombre: 'Mario López', cargo: 'RRHH', tipo: 'temporal' });
    emp.desactivar();
    assert.strictEqual(emp.estado, 'INACTIVO');
  });

  it('no permite desactivar un empleado ya inactivo', () => {
    const emp = new Empleado({ nombre: 'Mario López', cargo: 'RRHH', tipo: 'temporal' });
    emp.desactivar();
    assert.throws(() => emp.desactivar(), /ya está inactivo/);
  });
});

// ─── Contrato Aggregate ──────────────────────────────────────────────────────

describe('Contrato aggregate', () => {
  it('crea un contrato en estado BORRADOR', () => {
    const contrato = new Contrato({
      empleadoId: 'emp-1',
      tipoContrato: 'completo',
      salario: 3000000,
    });
    assert.strictEqual(contrato.estado, 'BORRADOR');
  });

  it('firma un contrato de tiempo completo correctamente', () => {
    const contrato = new Contrato({
      empleadoId: 'emp-1',
      tipoContrato: 'completo',
      salario: 3000000,
    });
    contrato.firmar();
    assert.strictEqual(contrato.estado, 'FIRMADO');
  });

  it('rechaza firmar contrato temporal sin fecha de fin', () => {
    const contrato = new Contrato({
      empleadoId: 'emp-1',
      tipoContrato: 'medio-tiempo',
      salario: 1500000,
    });
    assert.throws(() => contrato.firmar(), /requieren fecha de fin/);
  });

  it('emite evento ContratoFirmado al firmar', () => {
    const contrato = new Contrato({
      empleadoId: 'emp-1',
      tipoContrato: 'completo',
      salario: 3000000,
    });
    contrato.firmar();
    const events = contrato.pullEvents();
    assert.strictEqual(events.length, 1);
    assert.strictEqual(events[0].type, 'ContratoFirmado');
  });

  it('termina un contrato firmado y emite evento', () => {
    const contrato = new Contrato({
      empleadoId: 'emp-1',
      tipoContrato: 'completo',
      salario: 3000000,
    });
    contrato.firmar();
    contrato.pullEvents(); // limpiar
    contrato.terminar();
    const events = contrato.pullEvents();
    assert.strictEqual(contrato.estado, 'TERMINADO');
    assert.strictEqual(events[0].type, 'ContratoTerminado');
  });
});
