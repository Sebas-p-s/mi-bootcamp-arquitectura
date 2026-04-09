import bcrypt from 'bcrypt';
import { config } from '../../config.js';

// Adaptador secundario: manejo de contraseñas con bcrypt
// El dominio nunca toca esto directamente — pasa por el puerto
export class PasswordService {
  async hash(plainText) {
    return bcrypt.hash(plainText, config.bcryptRounds);
  }

  async compare(plainText, hashed) {
    return bcrypt.compare(plainText, hashed);
  }
}
