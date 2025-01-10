const express = require('express');
const tutoriaController = require('../controllers/tutoriaController');
const solicitudesController = require('../controllers/solicitudesController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/search', tutoriaController.search); // Buscar profesores por carrera

// Estudiantes envían solicitudes de tutoría
router.post('/solicitudes', verifyToken, requireRole('estudiante'), solicitudesController.enviarSolicitud);

// Profesores aceptan/rechazan solicitudes
router.put('/solicitudes/:id_solicitud', verifyToken, requireRole('profesor'), solicitudesController.actualizarSolicitud);

// Notificaciones
router.get('/notificaciones', verifyToken, solicitudesController.obtenerNotificaciones); // Obtener notificaciones
router.put('/notificaciones/leidas', verifyToken, solicitudesController.marcarNotificacionesLeidas); // Marcar como leídas

module.exports = router;
