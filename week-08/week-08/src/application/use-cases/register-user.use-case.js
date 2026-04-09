// Roles válidos en Rechum
const ROLES_VALIDOS = ['EMPLEADO', 'RRHH', 'ADMIN'];

export class RegisterUserUseCase {
  #userRepository;
  #passwordService;

  constructor({ userRepository, passwordService }) {
    this.#userRepository = userRepository;
    this.#passwordService = passwordService;
  }

  async execute({ email, password, role = 'EMPLEADO' }) {
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido');
    }
    if (!password || password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    if (!ROLES_VALIDOS.includes(role)) {
      throw new Error(`Rol inválido. Debe ser: ${ROLES_VALIDOS.join(', ')}`);
    }

    const existing = await this.#userRepository.findByEmail(email);
    if (existing) throw new Error('Email ya registrado');

    // Nunca almacenar contraseñas en texto plano
    const passwordHash = await this.#passwordService.hash(password);
    const user = await this.#userRepository.save({ email, passwordHash, role });

    return { id: user.id, email: user.email, role: user.role };
  }
}
