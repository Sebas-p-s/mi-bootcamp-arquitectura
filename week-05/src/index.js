// Registrar observadores antes de levantar el servidor
require('./patterns/observer/empleado.observer');

const express = require('express');
const app = express();

const empleadoRoutes = require('./routes/empleado.routes');
const errorHandler = require('./middleware/error-handler');
const setupSwagger = require('./swagger');

app.use(express.json());

app.use('/api/v1/empleados', empleadoRoutes);

setupSwagger(app);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
  console.log('📄 Swagger UI en http://localhost:3000/api-docs');
});
