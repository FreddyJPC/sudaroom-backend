const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Crear una notificación
router.post('/', notificationController.createNotification);

// Obtener notificaciones de un usuario
router.get('/:id_usuario', notificationController.getUserNotifications);

// Marcar una notificación como leída
router.put('/:id_notificacion/read', notificationController.markNotificationAsRead);

module.exports = router;
