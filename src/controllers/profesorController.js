const Profesor = require('../models/profesor');

const ProfesorController = {
  async getAllProfesores(req, res) {
    const { carrera } = req.query;
    try {
      const profesores = await Profesor.getAll(carrera);
      res.json(profesores);
    } catch (error) {
      console.error("Error al obtener los profesores:", error);
      res.status(500).json({ message: "Error al obtener los profesores" });
    }
  },

  async getProfesorById(req, res) {
    const { id } = req.params;
    try {
      const profesor = await Profesor.getById(id);
      if (!profesor) {
        return res.status(404).json({ message: "Profesor no encontrado" });
      }
      res.json(profesor);
    } catch (error) {
      console.error("Error al obtener el profesor:", error);
      res.status(500).json({ message: "Error al obtener el profesor" });
    }
  },

  async getCarreras(req, res) {
    try {
      const carreras = await Profesor.getCarreras();
      res.json({ carreras });
    } catch (error) {
      console.error("Error al obtener las carreras:", error);
      res.status(500).json({ message: "Error al obtener las carreras" });
    }
  },
};

module.exports = ProfesorController;
