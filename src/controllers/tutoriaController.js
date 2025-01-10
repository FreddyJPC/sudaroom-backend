const Tutoria = require('../models/Tutoria');

const tutoriaController = {
  // Buscar profesores por carrera
  async search(req, res) {
    try {
      const { carrera } = req.query;

      // Validar entrada
      if (!carrera) {
        return res.status(400).json({ message: 'La carrera es obligatoria para buscar tutorías.' });
      }

      // Buscar profesores por carrera
      const profesores = await Tutoria.findProfessorsByCareer(carrera);

      // Validar si hay resultados
      if (profesores.length === 0) {
        return res.status(404).json({ message: 'No se encontraron profesores para esta carrera.' });
      }

      res.status(200).json({ profesores });
    } catch (error) {
      console.error('Error al buscar tutorías:', error);
      res.status(500).json({ message: 'Error al buscar tutorías.', error: error.message });
    }
  },
};

module.exports = tutoriaController;
