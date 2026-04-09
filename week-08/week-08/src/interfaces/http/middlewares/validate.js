// Fábrica de middleware de validación con Zod
// Uso: router.post('/', validate(miSchema), controller.crear)
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: result.error.flatten().fieldErrors,
    });
  }

  // Reemplazar req.body con el valor parseado y sanitizado por Zod
  req.body = result.data;
  next();
};
