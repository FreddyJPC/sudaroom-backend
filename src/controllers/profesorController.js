const pool = require("../config/db");

const ProfesorController = {
  // Obtener todos los profesores
  async getAllProfesores(req, res) {
    const { carrera } = req.query; // Capturamos el filtro de carrera si existe

    try {
      let query = "SELECT id_usuario, nombre, correo, carrera FROM usuarios WHERE rol = 'profesor'";
      const params = [];

      if (carrera) {
        query += " AND carrera = $1";
        params.push(carrera);
      }

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error("Error al obtener los profesores:", error);
      res.status(500).json({ message: "Error al obtener los profesores" });
    }
  },


    // Obtener todas las carreras disponibles
    async getCarreras(req, res) {
        try {
          const result = await pool.query(
            "SELECT DISTINCT carrera FROM usuarios WHERE rol = 'profesor'"
          );
          const carreras = result.rows.map((row) => row.carrera);
          res.json({ carreras });
        } catch (error) {
          console.error("Error al obtener las carreras:", error);
          res.status(500).json({ message: "Error al obtener las carreras" });
        }
      },

  // Obtener un profesor por ID
  async getProfesorById(req, res) {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "SELECT id_usuario, nombre, correo, rol FROM usuarios WHERE id_usuario = $1 AND rol = 'profesor'",
        [id]
      );
      const profesor = result.rows[0];
      if (!profesor) {
        return res.status(404).json({ message: "Profesor no encontrado" });
      }
      res.json(profesor);
    } catch (error) {
      console.error("Error al obtener el profesor:", error);
      res.status(500).json({ message: "Error al obtener el profesor" });
    }
  },
};

module.exports = ProfesorController;
