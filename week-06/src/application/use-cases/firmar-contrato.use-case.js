import { Contrato } from '../../domain/aggregates/contrato.aggregate.js';
import { ContratoDomainService } from '../../domain/services/contrato.domain-service.js';

// Caso de uso 2: Firmar un contrato para un empleado
// Es la operación principal de negocio de Rechum
export class FirmarContratoUseCase {
  #empleadoRepository;
  #contratoRepository;
  #notificationPort;
  #domainService;

  constructor({ empleadoRepository, contratoRepository, notificationPort, domainService }) {
    this.#empleadoRepository = empleadoRepository;
    this.#contratoRepository = contratoRepository;
    this.#notificationPort = notificationPort;
    this.#domainService = domainService ?? new ContratoDomainService();
  }

  async execute({ empleadoId, tipoContrato, salarioBase, fechaFin = null }) {
    // 1. Cargar empleado
    const empleado = await this.#empleadoRepository.findById(empleadoId);
    if (!empleado) throw new Error(`Empleado ${empleadoId} no encontrado`);

    // 2. Cargar contratos existentes del empleado
    const contratosExistentes = await this.#contratoRepository.findByEmpleadoId(empleadoId);

    // 3. Validar reglas de negocio (domain service)
    this.#domainService.validarNuevoContrato(empleado, contratosExistentes);

    // 4. Calcular salario final según tipo de contrato
    const salarioFinal = this.#domainService.calcularSalarioFinal(salarioBase, tipoContrato);

    // 5. Crear aggregate y firmarlo
    const contrato = new Contrato({
      empleadoId,
      tipoContrato,
      salario: salarioFinal,
      fechaFin,
    });
    contrato.firmar();

    // 6. Persistir
    await this.#contratoRepository.save(contrato);

    // 7. Notificar
    await this.#notificationPort.contratoFirmado({
      empleado: empleado.nombre,
      tipoContrato,
      salario: salarioFinal,
    });

    return contrato;
  }
}
