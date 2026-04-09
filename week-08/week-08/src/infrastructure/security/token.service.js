import jwt from 'jsonwebtoken';
import { config } from '../../config.js';

// Adaptador secundario: firma y verificación de tokens JWT
// Payload incluye userId y role (los datos necesarios para RBAC en Rechum)
export class TokenService {
  sign(payload) {
    // payload: { userId, role }
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn ?? '15m',
      issuer: config.appName,
    });
  }

  verify(token) {
    // Lanza JsonWebTokenError si es inválido o expirado
    return jwt.verify(token, config.jwtSecret);
  }
}
