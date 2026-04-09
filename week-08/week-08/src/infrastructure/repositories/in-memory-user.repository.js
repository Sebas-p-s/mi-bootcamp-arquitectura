// Repositorio InMemory de usuarios — para tests y desarrollo
// En producción se reemplaza por postgres-user.repository.js
export class InMemoryUserRepository {
  #data = new Map();

  async findByEmail(email) {
    for (const user of this.#data.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async findById(id) {
    return this.#data.get(id) ?? null;
  }

  async save({ email, passwordHash, role }) {
    const id = crypto.randomUUID();
    const user = { id, email, passwordHash, role, creadoEn: new Date().toISOString() };
    this.#data.set(id, user);
    return user;
  }

  clear() { this.#data.clear(); }
}
