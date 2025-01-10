const pool = require('../config/db'); // Importa la configuración de la base de datos

const User = {
  // Buscar usuario por correo
  async findByEmail(correo) {
    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
      return result.rows[0]; // Devuelve el usuario encontrado, o undefined si no existe
    } catch (error) {
      console.error('Error en findByEmail:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  },

  async getAll(limit = 10, offset = 0) {
    try {
      const result = await pool.query(
        'SELECT id_usuario, nombre, correo, rol, fecha_creacion FROM usuarios LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  },

  async updatePassword(correo, nuevaContraseña) {
    try {
      const result = await pool.query(
        'UPDATE usuarios SET password = $1 WHERE correo = $2 RETURNING *',
        [nuevaContraseña, correo]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error en updatePassword:', error);
      throw error;
    }
  },
  



  async getAll() {
    try {
      const result = await pool.query('SELECT id_usuario, nombre, correo, rol, fecha_creacion FROM usuarios');
      return result.rows; // Devuelve la lista de usuarios
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  },

  async update(id, { nombre, correo }) {
    try {
      const fields = [];
      const values = [];

      if (nombre) {
        fields.push('nombre = $' + (fields.length + 1));
        values.push(nombre);
      }

      if (correo) {
        fields.push('correo = $' + (fields.length + 1));
        values.push(correo);
      }

      if (fields.length === 0) return null;

      values.push(id); // El ID siempre será el último parámetro

      const result = await pool.query(
        `UPDATE usuarios SET ${fields.join(', ')} WHERE id_usuario = $${values.length} RETURNING *`,
        values
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  },



  // Crear un nuevo usuario
  async create({ nombre, correo, password, rol }) {
    try {
      const result = await pool.query(
        `INSERT INTO usuarios (nombre, correo, password, rol) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [nombre, correo, password, rol]
      );
      return result.rows[0]; // Devuelve el usuario creado
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  },
};

module.exports = User;
