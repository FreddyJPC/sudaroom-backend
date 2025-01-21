const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware'); // Corrige la importación

const router = express.Router();

router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

// Ruta para actualizar un usuario (requiere autenticación)
router.put('/:id', verifyToken, userController.updateUser); // Proteger con verifyToken

// Solo los administradores pueden listar usuarios
router.get('/', verifyToken, requireRole('administrador'), userController.getAllUsers); // Solo administradores

// Ruta para eliminar un usuario (solo administradores)
router.delete('/:id', verifyToken, requireRole('administrador'), userController.deleteUser); // Solo administradores

// Ruta para registrar usuario
router.post('/register', userController.register);

// Ruta para iniciar sesión
router.post('/login', userController.login);

router.get('/:id', verifyToken, userController.getUserProfile); // Asegúrate de que el controlador esté definido


// Ruta para obtener todos los usuarios (Redundante, se ha simplificado y protegido arriba)
// Nota: Se eliminan las rutas duplicadas para evitar errores al registrar múltiples manejadores de la misma ruta

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra un nuevo usuario.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - contraseña
 *               - rol
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *                 format: email
 *               contraseña:
 *                 type: string
 *               rol:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado con éxito.
 *       400:
 *         description: Error en los datos proporcionados.
 */
router.post('/register', userController.register);

module.exports = router;
