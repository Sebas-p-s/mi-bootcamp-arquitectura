const express = require('express');
const app = express();

const empleadoRoutes = require('./routes/empleado.routes');
const errorHandler = require('./middleware/error-handler');
const setupSwagger = require('./swagger');

app.use(express.json());

// rutas
app.use('/api/v1/empleados', empleadoRoutes);

// swagger
setupSwagger(app);

// manejo de errores
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});