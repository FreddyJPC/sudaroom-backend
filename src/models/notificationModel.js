const pool = require('../config/db');

// Crear una notificación
const createNotification = async (id_usuario, mensaje, tipo = 'info') => {
  const query = `
    INSERT INTO notificaciones (id_usuario, mensaje, tipo, leido, fecha)
    VALUES ($1, $2, $3, false, CURRENT_TIMESTAMP)
    RETURNING *;
  `;
  const values = [id_usuario, mensaje, tipo];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Obtener notificaciones de un usuario
const getNotificationsByUserId = async (id_usuario) => {
  const query = `
    SELECT * FROM notificaciones
    WHERE id_usuario = $1
    ORDER BY fecha DESC;
  `;
  const result = await pool.query(query, [id_usuario]);
  return result.rows;
};

// Marcar una notificación como leída
const markAsRead = async (id_notificacion) => {
  const query = `
    UPDATE notificaciones
    SET leido = true
    WHERE id_notificacion = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [id_notificacion]);
  return result.rows[0];
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markAsRead,
};
