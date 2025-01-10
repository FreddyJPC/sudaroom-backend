const pool = require('../config/db'); // Conexión a la base de datos

const Tutoria = {
  // Buscar profesores por carrera
  async findProfessorsByCareer(carrera) {
    const result = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.correo, u.carrera, h.dia, h.hora_inicio, h.hora_fin
       FROM usuarios u
       LEFT JOIN horarios h ON u.id_usuario = h.id_usuario
       WHERE u.carrera ILIKE $1 AND u.rol = 'profesor'
       ORDER BY u.nombre`,
      [`%${carrera}%`] // Búsqueda flexible usando ILIKE para ignorar mayúsculas/minúsculas
    );
    return result.rows;
  },
};

module.exports = Tutoria;
