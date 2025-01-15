const pool = require('../config/db'); // Conexión a la base de datos

const Tutoria = {
  // Buscar profesores por carrera
  async findProfessorsByCareer(carrera) {
    const result = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.correo, u.carrera, u.materias
       FROM usuarios u
       WHERE u.carrera ILIKE $1 AND u.rol = 'profesor'
       ORDER BY u.nombre`,
      [`%${carrera}%`]
    );
    return result.rows;
  },
  
};

module.exports = Tutoria;
