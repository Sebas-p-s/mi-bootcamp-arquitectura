import { TokenService } from '../../../infrastructure/security/token.service.js';

const tokenService = new TokenService();

// Verifica el JWT y agrega req.user con { userId, role }
export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const token = header.slice(7);
    req.user = tokenService.verify(token); // { userId, role, iat, exp }
    next();
  } catch {
    // No enviar detalles del error al cliente (OWASP A09)
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
