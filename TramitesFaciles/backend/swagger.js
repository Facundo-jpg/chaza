const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tramites — API de Gestión de Turnos',
      version: '1.0.0',
      description: 'API oficial para la gestión de ciudadanos y turnos de trámites municipales',
      contact: {
        name: 'Soporte Tramites',
        email: 'tramitesfaciles@municipio.gob.ar'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese el token JWT obtenido del login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id_user: {
              type: 'integer',
              description: 'ID único del ciudadano'
            },
            name: {
              type: 'string',
              description: 'Nombre del ciudadano'
            },
            lastname: {
              type: 'string',
              description: 'Apellido del ciudadano'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del ciudadano'
            },
            phone: {
              type: 'string',
              description: 'Teléfono de contacto'
            },
            address: {
              type: 'string',
              description: 'Domicilio del ciudadano'
            },
            type: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Rol: "user" = ciudadano, "admin" = operador municipal'
            }
          }
        },
        Turno: {
          type: 'object',
          properties: {
            id_ticket: {
              type: 'integer',
              description: 'ID único del turno'
            },
            id_user: {
              type: 'integer',
              description: 'ID del ciudadano que solicitó el turno'
            },
            dateCreated: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del turno'
            },
            deliveryTime: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora de atención reservada'
            },
            status: {
              type: 'string',
              enum: ['pendiente', 'en_proceso', 'finalizado', 'cancelado'],
              description: 'Estado del trámite'
            },
            service: {
              type: 'string',
              enum: [
                'dni-documentacion',
                'habilitaciones-comerciales',
                'registro-civil',
                'infracciones-multas',
                'servicios-sociales',
                'obras-permisos'
              ],
              description: 'Tipo de trámite municipal solicitado'
            },
            description: {
              type: 'string',
              description: 'Descripción detallada del requerimiento del ciudadano'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            ok: {
              type: 'boolean',
              description: 'Indica si la operación fue exitosa'
            },
            user: {
              type: 'object',
              description: 'Datos del resultado'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };