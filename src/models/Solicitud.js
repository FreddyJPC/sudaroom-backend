// models/Solicitud.js
const db = require('../config/db');

const Solicitud = {
  // Crear una nueva solicitud
  crearSolicitud: async ({ id_estudiante, id_profesor, mensaje, fecha_solicitada, duracion, tema }) => {
    const query = `
      INSERT INTO solicitudes_tutoria (id_estudiante, id_profesor, mensaje, fecha_solicitada, duracion, tema, estado, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, $6, 'pendiente', NOW())
      RETURNING *;
    `;
    const values = [id_estudiante, id_profesor, mensaje, fecha_solicitada, duracion, tema];

    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Error al crear la solicitud: ' + error.message);
    }
  },

  // Actualizar el estado de la solicitud (aceptar o rechazar)
  responderSolicitud: async (idSolicitud, estado, motivoRechazo = null) => {
    const query = `
      UPDATE solicitudes_tutoria
      SET estado = $1, mensaje = COALESCE($2, mensaje)
      WHERE id_solicitud = $3
      RETURNING *;
    `;
    const values = [estado, motivoRechazo, idSolicitud];

    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Error al responder la solicitud: ' + error.message);
    }
  },

  // Obtener solicitudes por usuario
  obtenerSolicitudesPorUsuario: async (idUsuario, rol) => {
    const campo = rol === 'profesor' ? 'id_profesor' : 'id_estudiante';
    const query = `
      SELECT * FROM solicitudes_tutoria
      WHERE ${campo} = $1
      ORDER BY fecha_creacion DESC;
    `;

    try {
      const { rows } = await db.query(query, [idUsuario]);
      return rows;
    } catch (error) {
      throw new Error('Error al obtener solicitudes: ' + error.message);
    }
  }
};

module.exports = Solicitud;
