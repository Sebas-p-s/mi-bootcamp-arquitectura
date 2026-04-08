export class Contrato {
  constructor(salarioBase) {
    this.salarioBase = salarioBase;
  }

  calcularSalario() {
    return this.salarioBase;
  }
}

export class ContratoIndefinido extends Contrato {
  calcularSalario() {
    return this.salarioBase * 1.1;
  }
}

export class ContratoTemporal extends Contrato {
  calcularSalario() {
    return this.salarioBase;
  }
}
