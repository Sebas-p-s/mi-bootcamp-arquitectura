
import { randomUUID } from 'crypto';
import { SalarioVO } from '../value-objects/salario.vo.js';


export class Contrato {
  #id;
  #empleadoId;
  #tipoContrato;
  #salario;
  #fechaInicio;
  #fechaFin;
  #estado;
  #events;

  constructor({
    id = randomUUID(),
    empleadoId,
    tipoContrato,
    salario,
    fechaInicio = new Date().toISOString(),
    fechaFin = null,
    estado = 'BORRADOR',
  }) {
    if (!empleadoId) throw new Error('El contrato requiere un empleadoId');
    if (!tipoContrato) throw new Error('El tipo de contrato es obligatorio');

    const tiposValidos = ['completo', 'medio-tiempo', 'practicante'];
    if (!tiposValidos.includes(tipoContrato)) {
      throw new Error(`Tipo de contrato inválido: ${tipoContrato}`);
    }

    this.#id = id;
    this.#empleadoId = empleadoId;
    this.#tipoContrato = tipoContrato;
    this.#salario = salario instanceof SalarioVO ? salario : new SalarioVO(salario);
    this.#fechaInicio = fechaInicio;
    this.#fechaFin = fechaFin;
    this.#estado = estado;
    this.#events = [];
  }

  // Operación principal: firmar el contrato
  firmar() {
    if (this.#estado !== 'BORRADOR') {
      throw new Error('Solo se puede firmar un contrato en estado BORRADOR');
    }
    if (this.#tipoContrato !== 'completo' && !this.#fechaFin) {
      throw new Error('Los contratos temporales y de practicante requieren fecha de fin');
    }

    this.#estado = 'FIRMADO';
    this.#events.push({
      type: 'ContratoFirmado',
      aggregateId: this.#id,
      empleadoId: this.#empleadoId,
      salario: this.#salario.value,
      tipoContrato: this.#tipoContrato,
      fechaInicio: this.#fechaInicio,
    });
  }

  // Terminar un contrato activo
  terminar() {
    if (this.#estado !== 'FIRMADO') {
      throw new Error('Solo se puede terminar un contrato FIRMADO');
    }
    this.#estado = 'TERMINADO';
    this.#events.push({
      type: 'ContratoTerminado',
      aggregateId: this.#id,
      empleadoId: this.#empleadoId,
    });
  }

  // Consumir y vaciar los eventos pendientes
  pullEvents() {
    const events = [...this.#events];
    this.#events = [];
    return events;
  }

  get id()           { return this.#id; }
  get empleadoId()   { return this.#empleadoId; }
  get tipoContrato() { return this.#tipoContrato; }
  get salario()      { return this.#salario.value; }
  get estado()       { return this.#estado; }
  get fechaInicio()  { return this.#fechaInicio; }
  get fechaFin()     { return this.#fechaFin; }

  toJSON() {
    return {
      id: this.#id,
      empleadoId: this.#empleadoId,
      tipoContrato: this.#tipoContrato,
      salario: this.#salario.value,
      fechaInicio: this.#fechaInicio,
      fechaFin: this.#fechaFin,
      estado: this.#estado,
    };
  }

}
