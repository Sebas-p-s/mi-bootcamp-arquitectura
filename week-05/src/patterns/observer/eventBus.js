// PATRÓN: Observer — EventBus central
// Permite que múltiples observadores reaccionen a eventos
// sin que el emisor conozca a los suscriptores.

class EventBus {
  constructor() {
    this.handlers = {};
  }

  on(event, handler) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  emit(event, data) {
    const listeners = this.handlers[event] || [];
    listeners.forEach((fn) => fn(data));
  }
}

module.exports = new EventBus();
