// Domain Service: ContratoService
// Reglas de negocio que involucran más de una entidad y no pertenecen
// solo a Empleado ni solo a Contrato

export class ContratoDomainService {
  static MAX_CONTRATOS_ACTIVOS = 1;

  // Regla: un empleado no puede tener más de 1 contrato FIRMADO al mismo tiempo
  validarNuevoContrato(empleado, contratosActivos) {
    if (empleado.estado !== 'ACTIVO') {
      throw new Error(
        `No se puede contratar a ${empleado.nombre}: el empleado está ${empleado.estado}`
      );
    }

    const firmados = contratosActivos.filter((c) => c.estado === 'FIRMADO');
    if (firmados.length >= ContratoDomainService.MAX_CONTRATOS_ACTIVOS) {
      throw new Error(
        `El empleado ${empleado.nombre} ya tiene un contrato activo. Debe terminarlo antes de crear uno nuevo.`
      );
    }
  }

  // Regla: calcular salario final según tipo de contrato (integra el Strategy de semana 05)
  calcularSalarioFinal(salarioBase, tipoContrato) {
    const factores = {
      'completo':      1.3,
      'medio-tiempo':  0.5,
      'practicante':   0.25,
    };
    const factor = factores[tipoContrato] ?? 1;
    return Math.round(salarioBase * factor);
  }
}
