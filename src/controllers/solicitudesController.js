const pool = require('../config/db');

const solicitudesController = {
  // Enviar una solicitud de tutoría
  async enviarSolicitud(req, res) {
    const { id_profesor, mensaje } = req.body;
    const id_estudiante = req.user.id;

    try {
      // Verificar si ya existe una solicitud pendiente para el mismo profesor
      const solicitudExistente = await pool.query(
        'SELECT * FROM solicitudes_tutoria WHERE id_estudiante = $1 AND id_profesor = $2 AND estado = $3',
        [id_estudiante, id_profesor, 'pendiente']
      );
      if (solicitudExistente.rowCount > 0) {
        return res.status(400).json({ message: 'Ya has enviado una solicitud a este profesor.' });
      }

      // Crear nueva solicitud
      const nuevaSolicitud = await pool.query(
        `INSERT INTO solicitudes_tutoria (id_estudiante, id_profesor, mensaje) 
         VALUES ($1, $2, $3) RETURNING *`,
        [id_estudiante, id_profesor, mensaje]
      );

      res.status(201).json({
        message: 'Solicitud enviada exitosamente.',
        solicitud: nuevaSolicitud.rows[0],
      });
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },

  // Aceptar o rechazar una solicitud
  async actualizarSolicitud(req, res) {
    const { id_solicitud } = req.params;
    const { estado } = req.body; // "aceptada" o "rechazada"
    const id_profesor = req.user.id;

    try {
      // Verificar si la solicitud existe y pertenece al profesor
      const solicitud = await pool.query(
        'SELECT * FROM solicitudes_tutoria WHERE id_solicitud = $1 AND id_profesor = $2',
        [id_solicitud, id_profesor]
      );
      if (solicitud.rowCount === 0) {
        return res.status(404).json({ message: 'Solicitud no encontrada o no autorizada.' });
      }

      const solicitudData = solicitud.rows[0];

      // Actualizar estado de la solicitud
      await pool.query(
        'UPDATE solicitudes_tutoria SET estado = $1 WHERE id_solicitud = $2',
        [estado, id_solicitud]
      );

      // Crear una notificación para el estudiante
      const mensaje = `Tu solicitud ha sido ${estado}.`;
      await pool.query(
        `INSERT INTO notificaciones (id_usuario, mensaje) VALUES ($1, $2)`,
        [solicitudData.id_estudiante, mensaje]
      );

      res.status(200).json({ message: `Solicitud ${estado} exitosamente.` });
    } catch (error) {
      console.error('Error al actualizar la solicitud:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },

  // Obtener notificaciones
  async obtenerNotificaciones(req, res) {
    const id_usuario = req.user.id;

    try {
      const notificaciones = await pool.query(
        'SELECT * FROM notificaciones WHERE id_usuario = $1 ORDER BY fecha DESC',
        [id_usuario]
      );

      res.status(200).json({ notificaciones: notificaciones.rows });
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },

  // Marcar notificaciones como leídas
  async marcarNotificacionesLeidas(req, res) {
    const id_usuario = req.user.id;

    try {
      await pool.query(
        'UPDATE notificaciones SET leido = TRUE WHERE id_usuario = $1',
        [id_usuario]
      );

      res.status(200).json({ message: 'Notificaciones marcadas como leídas.' });
    } catch (error) {
      console.error('Error al marcar notificaciones:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },
};

module.exports = solicitudesController;
