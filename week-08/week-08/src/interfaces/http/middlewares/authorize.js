// Roles de Rechum:
//   EMPLEADO → puede ver su propio perfil
//   RRHH     → puede gestionar empleados y contratos
//   ADMIN    → acceso total + gestión de usuarios

export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'No tienes permiso para esta acción' });
  }

  next();
};

// Ejemplos de uso en rutas:
// Listar empleados — solo RRHH y ADMIN
// router.get('/', authenticate, authorize('RRHH', 'ADMIN'), controller.listar);
//
// Crear empleado — solo RRHH y ADMIN
// router.post('/', authenticate, authorize('RRHH', 'ADMIN'), controller.crear);
//
// Eliminar empleado — solo ADMIN
// router.delete('/:id', authenticate, authorize('ADMIN'), controller.eliminar);
