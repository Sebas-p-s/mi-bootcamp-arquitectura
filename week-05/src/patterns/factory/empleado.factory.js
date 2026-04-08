// PATRÓN: Factory Method
// PROBLEMA: En el controller se creaba el objeto empleado directamente con
//           lógica dispersa (id, timestamps, defaults). Difícil de mantener.
// SOLUCIÓN: Centralizar la creación en una factory según el tipo de empleado.

class EmpleadoFactory {
  static crear(tipo, datos) {
    const base = {
      id: Date.now().toString(),
      creadoEn: new Date().toISOString(),
      activo: true,
      ...datos,
    };

    switch (tipo) {
      case 'permanente':
        return {
          ...base,
          tipo: 'permanente',
          beneficios: ['salud', 'pension', 'vacaciones'],
        };

      case 'temporal':
        return {
          ...base,
          tipo: 'temporal',
          beneficios: ['salud'],
          fechaFin: datos.fechaFin || null,
        };

      case 'practicante':
        return {
          ...base,
          tipo: 'practicante',
          beneficios: [],
          supervisor: datos.supervisor || null,
        };

      default:
        return { ...base, tipo: 'general' };
    }
  }
}

module.exports = EmpleadoFactory;
