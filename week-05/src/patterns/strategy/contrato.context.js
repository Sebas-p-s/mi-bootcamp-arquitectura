// Contexto del Strategy — delega el cálculo a la estrategia inyectada

class ContratoContext {
  constructor(estrategia) {
    this._estrategia = estrategia;
  }

  calcular(salarioBase) {
    return this._estrategia.calcular(salarioBase);
  }
}

module.exports = ContratoContext;
