const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware'); // Importar los middlewares correctamente

const router = express.Router();

/**
 * Rutas relacionadas con los usuarios.
 */

// Rutas públicas
router.post('/register', userController.register); // Registro de usuarios
router.post('/login', userController.login); // Inicio de sesión
router.post('/forgot-password', userController.forgotPassword); // Solicitar recuperación de contraseña
router.post('/reset-password/:token', userController.resetPassword); // Restablecer contraseña

// Rutas protegidas
router.get('/', verifyToken, requireRole('administrador'), userController.getAllUsers); // Obtener lista de usuarios (solo administradores)
router.get('/:id', verifyToken, userController.getUserProfile); // Obtener perfil del usuario autenticado
router.put('/:id', verifyToken, userController.updateUser); // Actualizar datos de usuario
router.delete('/:id', verifyToken, requireRole('administrador'), userController.deleteUser); // Eliminar usuario (solo administradores)
router.get('/carreras', userController.getCarreras); // Ruta para obtener las carreras


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
