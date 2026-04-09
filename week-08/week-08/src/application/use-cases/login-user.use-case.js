export class LoginUserUseCase {
  #userRepository;
  #passwordService;
  #tokenService;

  constructor({ userRepository, passwordService, tokenService }) {
    this.#userRepository = userRepository;
    this.#passwordService = passwordService;
    this.#tokenService = tokenService;
  }

  async execute({ email, password }) {
    // Mensaje genérico: no revelar si el email existe o no (OWASP A07)
    const GENERIC_ERROR = 'Credenciales incorrectas';

    const user = await this.#userRepository.findByEmail(email);
    if (!user) throw new Error(GENERIC_ERROR);

    const valid = await this.#passwordService.compare(password, user.passwordHash);
    if (!valid) throw new Error(GENERIC_ERROR);

    // Solo incluir en el token lo necesario para autorización
    const token = this.#tokenService.sign({
      userId: user.id,
      role: user.role,
    });

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}
