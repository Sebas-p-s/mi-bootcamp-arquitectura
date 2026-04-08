import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { CrearEmpleadoUseCase } from '../../src/application/use-cases/crear-empleado.use-case.js';
import { FirmarContratoUseCase } from '../../src/application/use-cases/firmar-contrato.use-case.js';
import { ConsultarEmpleadoUseCase } from '../../src/application/use-cases/consultar-empleado.use-case.js';
import { InMemoryEmpleadoRepository } from '../../src/infrastructure/repositories/in-memory-empleado.repository.js';
import { InMemoryContratoRepository } from '../../src/infrastructure/repositories/in-memory-contrato.repository.js';

// Mock de notificaciones — no hace nada, solo registra llamadas
const notificationMock = {
  llamadas: [],
  async empleadoCreado(data) { this.llamadas.push({ tipo: 'empleadoCreado', data }); },
  async contratoFirmado(data) { this.llamadas.push({ tipo: 'contratoFirmado', data }); },
};

//CrearEmpleadoUseCase

describe('CrearEmpleadoUseCase', () => {
  let empleadoRepo;
  let useCase;

  beforeEach(() => {
    empleadoRepo = new InMemoryEmpleadoRepository();
    notificationMock.llamadas = [];
    useCase = new CrearEmpleadoUseCase({
      empleadoRepository: empleadoRepo,
      notificationPort: notificationMock,
    });
  });

  it('crea y persiste un empleado correctamente', async () => {
    const emp = await useCase.execute({ nombre: 'Ana Torres', cargo: 'Diseñadora', tipo: 'permanente' });
    assert.ok(emp.id, 'Debe tener ID');
    assert.strictEqual(await empleadoRepo.size, 1);
  });

  it('notifica la creación del empleado', async () => {
    await useCase.execute({ nombre: 'Ana Torres', cargo: 'Diseñadora', tipo: 'permanente' });
    assert.strictEqual(notificationMock.llamadas.length, 1);
    assert.strictEqual(notificationMock.llamadas[0].tipo, 'empleadoCreado');
  });

  it('rechaza crear empleado con nombre inválido', async () => {
    await assert.rejects(
      () => useCase.execute({ nombre: 'AB', cargo: 'Dev', tipo: 'permanente' }),
      /al menos 3 caracteres/
    );
  });
});

// FirmarContratoUseCase

describe('FirmarContratoUseCase', () => {
  let empleadoRepo;
  let contratoRepo;
  let useCase;
  let crearEmpleado;

  beforeEach(() => {
    empleadoRepo = new InMemoryEmpleadoRepository();
    contratoRepo = new InMemoryContratoRepository();
    notificationMock.llamadas = [];

    crearEmpleado = new CrearEmpleadoUseCase({
      empleadoRepository: empleadoRepo,
      notificationPort: notificationMock,
    });

    useCase = new FirmarContratoUseCase({
      empleadoRepository: empleadoRepo,
      contratoRepository: contratoRepo,
      notificationPort: notificationMock,
    });
  });

  it('firma un contrato exitosamente para un empleado activo', async () => {
    const emp = await crearEmpleado.execute({ nombre: 'Juan Pérez', cargo: 'Contador', tipo: 'permanente' });
    const contrato = await useCase.execute({
      empleadoId: emp.id,
      tipoContrato: 'completo',
      salarioBase: 2000000,
    });
    assert.strictEqual(contrato.estado, 'FIRMADO');
    assert.strictEqual(contratoRepo.size, 1);
  });

  it('calcula el salario correcto para tiempo completo (x1.3)', async () => {
    const emp = await crearEmpleado.execute({ nombre: 'Juan Pérez', cargo: 'Contador', tipo: 'permanente' });
    const contrato = await useCase.execute({
      empleadoId: emp.id,
      tipoContrato: 'completo',
      salarioBase: 2000000,
    });
    assert.strictEqual(contrato.salario, 2600000);
  });

  it('rechaza firmar contrato si el empleado no existe', async () => {
    await assert.rejects(
      () => useCase.execute({ empleadoId: 'no-existe', tipoContrato: 'completo', salarioBase: 2000000 }),
      /no encontrado/
    );
  });

  it('rechaza un segundo contrato activo para el mismo empleado', async () => {
    const emp = await crearEmpleado.execute({ nombre: 'María Ruiz', cargo: 'Asistente', tipo: 'permanente' });
    await useCase.execute({ empleadoId: emp.id, tipoContrato: 'completo', salarioBase: 1500000 });

    await assert.rejects(
      () => useCase.execute({ empleadoId: emp.id, tipoContrato: 'completo', salarioBase: 1500000 }),
      /ya tiene un contrato activo/
    );
  });

  it('notifica cuando se firma el contrato', async () => {
    notificationMock.llamadas = [];
    const emp = await crearEmpleado.execute({ nombre: 'Carlos Gil', cargo: 'Técnico', tipo: 'permanente' });
    notificationMock.llamadas = []; // limpiar la notif de creación
    await useCase.execute({ empleadoId: emp.id, tipoContrato: 'completo', salarioBase: 1800000 });
    assert.ok(notificationMock.llamadas.some((l) => l.tipo === 'contratoFirmado'));
  });
});

// ─── ConsultarEmpleadoUseCase ────────────────────────────────────────────────

describe('ConsultarEmpleadoUseCase', () => {
  it('retorna empleado con sus contratos', async () => {
    const empleadoRepo = new InMemoryEmpleadoRepository();
    const contratoRepo = new InMemoryContratoRepository();

    const crearEmp = new CrearEmpleadoUseCase({ empleadoRepository: empleadoRepo, notificationPort: notificationMock });
    const firmarCont = new FirmarContratoUseCase({ empleadoRepository: empleadoRepo, contratoRepository: contratoRepo, notificationPort: notificationMock });
    const consultarEmp = new ConsultarEmpleadoUseCase({ empleadoRepository: empleadoRepo, contratoRepository: contratoRepo });

    const emp = await crearEmp.execute({ nombre: 'Sofía Mora', cargo: 'RRHH', tipo: 'permanente' });
    await firmarCont.execute({ empleadoId: emp.id, tipoContrato: 'completo', salarioBase: 2000000 });

    const resultado = await consultarEmp.execute(emp.id);
    assert.strictEqual(resultado.nombre, 'Sofía Mora');
    assert.strictEqual(resultado.contratos.length, 1);
  });

  it('rechaza consultar un empleado inexistente', async () => {
    const empleadoRepo = new InMemoryEmpleadoRepository();
    const contratoRepo = new InMemoryContratoRepository();
    const consultar = new ConsultarEmpleadoUseCase({ empleadoRepository: empleadoRepo, contratoRepository: contratoRepo });

    await assert.rejects(() => consultar.execute('no-existe'), /no encontrado/);
  });
});
