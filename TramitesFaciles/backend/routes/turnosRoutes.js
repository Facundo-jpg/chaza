const express = require('express')
const router = express.Router()
const TurnosController = require('../controllers/turnosController')

/**
 * @swagger
 * /turnos/getall:
 *   get:
 *     summary: Obtener todos los turnos
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Turno'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/getall', TurnosController.getAllTurnos)

/**
 * @swagger
 * /turnos/getById/{id_user}:
 *   get:
 *     summary: Obtener turnos por ID de usuario
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario para filtrar sus turnos
 *         example: 1
 *     responses:
 *       200:
 *         description: Turnos del usuario obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Turno'
 *       500:
 *         description: Error del servidor
 */
router.get('/getById/:id_user', TurnosController.getAllById)

/**
 * @swagger
 * /turnos/create:
 *   post:
 *     summary: Crear un nuevo turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_user
 *               - dateCreated
 *               - deliveryTime
 *               - status
 *               - description
 *             properties:
 *               id_user:
 *                 type: integer
 *                 description: ID del usuario que crea el turno
 *                 example: 1
 *               dateCreated:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de creación del turno
 *                 example: 2024-01-15T10:30:00Z
 *               deliveryTime:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de entrega/finalización
 *                 example: 2024-01-20T15:00:00Z
 *               status:
 *                 type: string
 *                 description: Estado del turno
 *                 example: pendiente
 *                 enum: [pendiente, en_proceso, completado, cancelado]
 *               description:
 *                 type: string
 *                 description: Descripción detallada del turno
 *                 example: Reparación de equipo informático
 *     responses:
 *       200:
 *         description: Turno creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/Turno'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/create', TurnosController.createTurno)

/**
 * @swagger
 * /turnos/update/{id}:
 *   put:
 *     summary: Actualizar un turno existente
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno (id_ticket) a actualizar
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryTime:
 *                 type: string
 *                 format: date-time
 *                 description: Nueva fecha de entrega
 *                 example: 2024-01-25T16:00:00Z
 *               status:
 *                 type: string
 *                 description: Nuevo estado del turno
 *                 example: en_proceso
 *               description:
 *                 type: string
 *                 description: Nueva descripción
 *                 example: Reparación completada al 50%
 *     responses:
 *       200:
 *         description: Turno actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   description: Datos del turno actualizado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/update/:id', TurnosController.updateTurno)

/**
 * @swagger
 * /turnos/delete/{id_ticket}:
 *   delete:
 *     summary: Eliminar un turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_ticket
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno (ticket) a eliminar
 *         example: 5
 *     responses:
 *       200:
 *         description: Turno eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   description: Confirmación de eliminación
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/delete/:id_ticket', TurnosController.deleteTurno)

router.get('/horarios-ocupados/:fecha', TurnosController.getHorariosOcupados);

module.exports = router