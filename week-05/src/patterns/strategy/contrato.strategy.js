// PATRÓN: Strategy
// PROBLEMA: El cálculo de salario estaba hardcodeado con if/else en el controller,
//           haciendo difícil agregar nuevos tipos de contrato.
// SOLUCIÓN: Encapsular cada algoritmo de cálculo en su propia clase.

class ContratoTiempoCompleto {
  calcular(salarioBase) {
    // Tiempo completo: salario base + 30% de bonificación
    return salarioBase * 1.3;
  }
}

class ContratoMedioTiempo {
  calcular(salarioBase) {
    // Medio tiempo: 50% del salario base
    return salarioBase * 0.5;
  }
}

class ContratoPracticante {
  calcular(salarioBase) {
    // Practicante: 25% del salario base
    return salarioBase * 0.25;
  }
}

module.exports = { ContratoTiempoCompleto, ContratoMedioTiempo, ContratoPracticante };
