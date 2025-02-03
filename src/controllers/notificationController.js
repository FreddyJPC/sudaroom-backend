const notificationModel = require('../models/notificationModel');

// Crear una notificación
const createNotification = async (req, res) => {
  try {
    const { id_usuario, mensaje, tipo } = req.body;
    const notification = await notificationModel.createNotification(id_usuario, mensaje, tipo);
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener notificaciones de un usuario
const getUserNotifications = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const notifications = await notificationModel.getNotificationsByUserId(id_usuario);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Marcar notificación como leída
const markNotificationAsRead = async (req, res) => {
  try {
    const { id_notificacion } = req.params;
    const updatedNotification = await notificationModel.markAsRead(id_notificacion);
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
};
