const pool = require("../config/db"); // Importa la configuración de la base de datos

const User = {
  // Buscar usuario por correo
  async findByEmail(correo) {
    try {
      const result = await pool.query(
        "SELECT * FROM usuarios WHERE correo = $1",
        [correo]
      );
      return result.rows[0]; // Devuelve el usuario encontrado, o undefined si no existe
    } catch (error) {
      console.error("Error en findByEmail:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const result = await pool.query(
        "DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error en delete:", error);
      throw error;
    }
  },

  async getAll(limit = 10, offset = 0) {
    try {
      const result = await pool.query(
        "SELECT id_usuario, nombre, correo, rol, fecha_creacion FROM usuarios LIMIT $1 OFFSET $2",
        [limit, offset]
      );
      console.log("Resultado de la base de datos:", result.rows);
      return result.rows || [];
    } catch (error) {
      console.error("Error en getAll:", error);
      throw error;
    }
  },
  
  

  async updatePassword(correo, nuevaContraseña) {
    try {
      const result = await pool.query(
        "UPDATE usuarios SET password = $1 WHERE correo = $2 RETURNING *",
        [nuevaContraseña, correo]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error en updatePassword:", error);
      throw error;
    }
  },


  async update(id, { nombre, correo }) {
    try {
      const fields = [];
      const values = [];

      if (nombre) {
        fields.push("nombre = $" + (fields.length + 1));
        values.push(nombre);
      }

      if (correo) {
        fields.push("correo = $" + (fields.length + 1));
        values.push(correo);
      }

      if (fields.length === 0) return null;

      values.push(id); // El ID siempre será el último parámetro

      const result = await pool.query(
        `UPDATE usuarios SET ${fields.join(", ")} WHERE id_usuario = $${
          values.length
        } RETURNING *`,
        values
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error en update:", error);
      throw error;
    }
  },

  // Crear un nuevo usuario
  async create({ nombre, correo, password, rol, carrera }) {
    try {
      const result = await pool.query(
        `INSERT INTO usuarios (nombre, correo, password, rol, carrera) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [nombre, correo, password, rol, carrera]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error en create:", error);
      throw error;
    }
  },

  ///Nuevo agregado
  // async getUserProfile({ req, res }) {
  //   const { id } = req.params;
  //   try {
  //     const result = await pool.query(
  //       "SELECT * FROM usuarios WHERE id_usuario = $1",
  //       [id]
  //     );
  //     const user = result.rows[0];

  //     if (!user) {
  //       return res.status(404).json({ message: "Usuario no encontrado" });
  //     }

  //     if (user.rol === "profesor") {
  //       const horariosResult = await pool.query(
  //         `SELECT dia, hora_inicio, hora_fin 
  //          FROM horarios 
  //          WHERE id_usuario = $1`,
  //         [id]
  //       );
  //       const horarios = horariosResult.rows;

  //       return res.json({
  //         ...user,
  //         horarios,
  //       });
  //     }

  //     res.json(user);
  //   } catch (error) {
  //     console.error("Error al obtener el perfil del usuario:", error);
  //     res
  //       .status(500)
  //       .json({ message: "Error al obtener el perfil del usuario" });
  //   }
  // },

  async getById(id) {
    try {
      const result = await pool.query(
        "SELECT id_usuario, nombre, correo, rol, carrera FROM usuarios WHERE id_usuario = $1",
        [id] // Asegúrate de que aquí se pase un número entero
      );
      return result.rows[0]; // Devuelve el usuario encontrado o undefined
    } catch (error) {
      console.error("Error en getById:", error);
      throw error;
    }
  },
  
};

module.exports = User;
