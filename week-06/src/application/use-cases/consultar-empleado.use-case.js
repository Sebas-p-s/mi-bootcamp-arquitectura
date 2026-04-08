// Caso de uso 3: Consultar empleado con sus contratos
export class ConsultarEmpleadoUseCase {
  #empleadoRepository;
  #contratoRepository;

  constructor({ empleadoRepository, contratoRepository }) {
    this.#empleadoRepository = empleadoRepository;
    this.#contratoRepository = contratoRepository;
  }

  async execute(empleadoId) {
    const empleado = await this.#empleadoRepository.findById(empleadoId);
    if (!empleado) throw new Error(`Empleado ${empleadoId} no encontrado`);

    const contratos = await this.#contratoRepository.findByEmpleadoId(empleadoId);

    return {
      ...empleado.toJSON(),
      contratos: contratos.map((c) => c.toJSON()),
    };
  }
}
