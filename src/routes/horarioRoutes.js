const express = require('express');
const horarioController = require('../controllers/horarioController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/', verifyToken, horarioController.create); // Crear horario
router.get('/:id', horarioController.getByProfessor); // Obtener horarios por profesor
router.put('/:id_horario', verifyToken, horarioController.update); // Actualizar horario
router.delete('/:id_horario', verifyToken, horarioController.delete); // Eliminar horario

module.exports = router;
