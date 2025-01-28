const pool = require('../config/db');

const Profesor = {
  async getAll(carrera) {
    const query = `
      SELECT id_usuario, nombre, correo, carrera
      FROM usuarios
      WHERE rol = 'profesor'
      ${carrera ? "AND carrera = $1" : ""}
    `;
    const params = carrera ? [carrera] : [];
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getById(id) {
    const query = `
      SELECT id_usuario, nombre, correo, rol, carrera
      FROM usuarios
      WHERE id_usuario = $1 AND rol = 'profesor'
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0]; // Devuelve el primer resultado o undefined
  },

  async getCarreras() {
    const query = `
      SELECT DISTINCT carrera
      FROM usuarios
      WHERE rol = 'profesor'
    `;
    const result = await pool.query(query);
    return result.rows.map(row => row.carrera); // Extrae solo los nombres de las carreras
  },
};

module.exports = Profesor;
