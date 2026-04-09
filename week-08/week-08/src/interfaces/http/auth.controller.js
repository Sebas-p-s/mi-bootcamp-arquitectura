import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case.js';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case.js';
import { InMemoryUserRepository } from '../../infrastructure/repositories/in-memory-user.repository.js';
import { PasswordService } from '../../infrastructure/security/password.service.js';
import { TokenService } from '../../infrastructure/security/token.service.js';

const userRepo       = new InMemoryUserRepository();
const passwordService = new PasswordService();
const tokenService   = new TokenService();

const registerUseCase = new RegisterUserUseCase({ userRepository: userRepo, passwordService });
const loginUseCase    = new LoginUserUseCase({ userRepository: userRepo, passwordService, tokenService });

export const authController = {
  async register(req, res, next) {
    try {
      const user = await registerUseCase.execute(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  async login(req, res, next) {
    try {
      const result = await loginUseCase.execute(req.body);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },
};
