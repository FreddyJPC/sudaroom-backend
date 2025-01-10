const pool = require('../config/db');

const adminController = {
  // Obtener todos los usuarios
  async obtenerUsuarios(req, res) {
    try {
      const usuarios = await pool.query('SELECT id_usuario, nombre, correo, rol FROM usuarios');
      res.status(200).json(usuarios.rows);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios.' });
    }
  },

  // Crear un nuevo usuario
  async crearUsuario(req, res) {
    const { nombre, correo, contrasena, rol } = req.body;
    try {
      // Validar que el correo sea único
      const correoExistente = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
      if (correoExistente.rowCount > 0) {
        return res.status(400).json({ message: 'El correo ya está registrado.' });
      }

      const nuevoUsuario = await pool.query(
        `INSERT INTO usuarios (nombre, correo, contrasena, rol) 
         VALUES ($1, $2, $3, $4) RETURNING id_usuario, nombre, correo, rol`,
        [nombre, correo, contrasena, rol]
      );

      res.status(201).json({ message: 'Usuario creado con éxito.', usuario: nuevoUsuario.rows[0] });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ message: 'Error al crear usuario.' });
    }
  },

  // Actualizar un usuario
  async actualizarUsuario(req, res) {
    const { id_usuario } = req.params;
    const { nombre, correo, rol } = req.body;
    try {
      const usuarioActualizado = await pool.query(
        `UPDATE usuarios SET nombre = $1, correo = $2, rol = $3 WHERE id_usuario = $4 RETURNING id_usuario, nombre, correo, rol`,
        [nombre, correo, rol, id_usuario]
      );

      if (usuarioActualizado.rowCount === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      res.status(200).json({ message: 'Usuario actualizado con éxito.', usuario: usuarioActualizado.rows[0] });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error al actualizar usuario.' });
    }
  },

  // Eliminar un usuario
  async eliminarUsuario(req, res) {
    const { id_usuario } = req.params;
    try {
      const eliminado = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING id_usuario', [
        id_usuario,
      ]);
      if (eliminado.rowCount === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      res.status(200).json({ message: 'Usuario eliminado con éxito.' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ message: 'Error al eliminar usuario.' });
    }
  },

  // Obtener todas las clases
  async obtenerClases(req, res) {
    try {
      const clases = await pool.query('SELECT * FROM clases');
      res.status(200).json(clases.rows);
    } catch (error) {
      console.error('Error al obtener clases:', error);
      res.status(500).json({ message: 'Error al obtener clases.' });
    }
  },

  // Eliminar una clase
  async eliminarClase(req, res) {
    const { id_clase } = req.params;
    try {
      const eliminada = await pool.query('DELETE FROM clases WHERE id_clase = $1 RETURNING id_clase', [id_clase]);
      if (eliminada.rowCount === 0) {
        return res.status(404).json({ message: 'Clase no encontrada.' });
      }
      res.status(200).json({ message: 'Clase eliminada con éxito.' });
    } catch (error) {
      console.error('Error al eliminar clase:', error);
      res.status(500).json({ message: 'Error al eliminar clase.' });
    }
  },
};

module.exports = adminController;
