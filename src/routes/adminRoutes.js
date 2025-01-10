const express = require('express');
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Gestión de usuarios
router.get('/usuarios', verifyToken, requireRole('administrador'), adminController.obtenerUsuarios);
router.post('/usuarios', verifyToken, requireRole('administrador'), adminController.crearUsuario);
router.put('/usuarios/:id_usuario', verifyToken, requireRole('administrador'), adminController.actualizarUsuario);
router.delete('/usuarios/:id_usuario', verifyToken, requireRole('administrador'), adminController.eliminarUsuario);

// Gestión de clases
router.get('/clases', verifyToken, requireRole('administrador'), adminController.obtenerClases);
router.delete('/clases/:id_clase', verifyToken, requireRole('administrador'), adminController.eliminarClase);

module.exports = router;
