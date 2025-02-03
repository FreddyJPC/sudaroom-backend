const express = require('express');
const classController = require('../controllers/classController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas existentes
router.post('/reservar', verifyToken, requireRole('estudiante'), classController.reservarClase); // Reservar una clase
router.post('/', verifyToken, requireRole('profesor'), classController.create); // Crear clase
router.get('/', verifyToken, requireRole('profesor'), classController.listByProfessor); // Listar clases por profesor
router.put('/:id_clase', verifyToken, requireRole('profesor'), classController.update); // Editar clase
router.delete('/:id_clase', verifyToken, requireRole('profesor'), classController.delete); // Eliminar clase


// Nuevas rutas
router.get('/disponibles', verifyToken, classController.listAvailable); // Listar clases disponibles
router.get('/:id_clase', verifyToken, classController.getDetails); // Obtener detalles de una clase específica

module.exports = router;
