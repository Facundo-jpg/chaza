const express = require("express");
const cors = require ("cors");
require("dotenv").config();
const checkApiKey = require('./middleware/checkApikey');
const usersRoutes = require('./routes/userRoutes');
const turnosRoutes = require('./routes/turnosRoutes');

const { specs, swaggerUi } = require('./swagger');

const api = express();

const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}

api.disable('x-powered-by')
api.use(cors(corsOptions));

api.use(express.json());

// Documentación Swagger
api.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Turnos - Documentación"
}));

api.use(checkApiKey);

// Rutas
api.use('/user', usersRoutes);
api.use('/turnos', turnosRoutes);

const PORT = process.env.PORT || 3000;
api.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});

module.exports = api;
