const pool = require('../config/db'); // Conexión a la base de datos

const Horario = {
  // Crear horario
  async create({ id_usuario, dia, hora_inicio, hora_fin }) {
    const result = await pool.query(
      `INSERT INTO horarios (id_usuario, dia, hora_inicio, hora_fin)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_usuario, dia, hora_inicio, hora_fin]
    );
    return result.rows[0];
  },

  // Obtener horarios por profesor
  async findByProfessor(id_usuario) {
    const result = await pool.query(
      `SELECT * FROM horarios WHERE id_usuario = $1`,
      [id_usuario]
    );
    return result.rows;
  },

  // Actualizar horario
  async update(id_horario, { dia, hora_inicio, hora_fin }) {
    const result = await pool.query(
      `UPDATE horarios 
       SET dia = $1, hora_inicio = $2, hora_fin = $3
       WHERE id_horario = $4 RETURNING *`,
      [dia, hora_inicio, hora_fin, id_horario]
    );
    return result.rows[0];
  },

  // Eliminar horario
  async delete(id_horario) {
    await pool.query(`DELETE FROM horarios WHERE id_horario = $1`, [id_horario]);
  },
};

module.exports = Horario;
