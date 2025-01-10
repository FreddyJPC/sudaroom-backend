const pool = require('../config/db');

const Clase = {
  // Crear una clase
  async create({ titulo, descripcion, fecha_hora, duracion, capacidad_maxima, estado, id_profesor, carrera }) {
    try {
      const result = await pool.query(
        `INSERT INTO clases (titulo, descripcion, fecha_hora, duracion, capacidad_maxima, estado, id_profesor, carrera)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [titulo, descripcion, fecha_hora, duracion, capacidad_maxima, estado, id_profesor, carrera]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al crear clase:', error);
      throw error;
    }
  },

  // Editar una clase
  async update(id_clase, { titulo, descripcion, fecha_hora, duracion, capacidad_maxima, estado, carrera }) {
    try {
      const result = await pool.query(
        `UPDATE clases
         SET titulo = $1, descripcion = $2, fecha_hora = $3, duracion = $4, capacidad_maxima = $5, estado = $6, carrera = $7
         WHERE id_clase = $8 RETURNING *`,
        [titulo, descripcion, fecha_hora, duracion, capacidad_maxima, estado, carrera, id_clase]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al actualizar clase:', error);
      throw error;
    }
  },

  // Listar clases de un profesor
  async findByProfessor(id_profesor) {
    try {
      const result = await pool.query(
        `SELECT * FROM clases WHERE id_profesor = $1 ORDER BY fecha_hora ASC`,
        [id_profesor]
      );
      return result.rows;
    } catch (error) {
      console.error('Error al obtener clases:', error);
      throw error;
    }
  },

  // Eliminar una clase
  async delete(id_clase) {
    try {
      const result = await pool.query(`DELETE FROM clases WHERE id_clase = $1 RETURNING *`, [id_clase]);
      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar clase:', error);
      throw error;
    }
  },
};

module.exports = Clase;
