// Value Object: Salario
// Regla de negocio: el salario debe estar entre el mínimo legal colombiano
// y un máximo razonable para la plataforma Rechum.
// Es inmutable una vez asignado (Object.freeze)

export class SalarioVO {
  static MIN = 1300000; // salario mínimo Colombia 2026
  static MAX = 50000000;

  #value;

  constructor(value) {
    const num = Number(value);
    if (isNaN(num) || num < SalarioVO.MIN || num > SalarioVO.MAX) {
      throw new Error(
        `Salario inválido: ${value}. Debe estar entre ${SalarioVO.MIN} y ${SalarioVO.MAX}`
      );
    }
    this.#value = Math.round(num);
    Object.freeze(this);
  }

  get value() {
    return this.#value;
  }

  // ¿Supera el umbral para beneficios premium?
  get esSalarioAlto() {
    return this.#value >= 5000000;
  }

  equals(other) {
    return other instanceof SalarioVO && this.#value === other.value;
  }

  toString() {
    return `$${this.#value.toLocaleString('es-CO')}`;
  }
}
