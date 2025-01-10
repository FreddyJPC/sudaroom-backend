const Horario = require('../models/Horario'); // Modelo para horarios

const horarioController = {
  // Crear un horario
  async create(req, res) {
    try {
      const { id_usuario } = req.user; // Obtenemos el id del usuario autenticado (profesor)
      const { dia, hora_inicio, hora_fin } = req.body;

      // Validaciones básicas
      if (!dia || !hora_inicio || !hora_fin) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
      }

      // Crear el horario
      const newHorario = await Horario.create({
        id_usuario,
        dia,
        hora_inicio,
        hora_fin,
      });

      res.status(201).json({ message: 'Horario creado con éxito.', horario: newHorario });
    } catch (error) {
      console.error('Error al crear horario:', error);
      res.status(500).json({ message: 'Error al crear horario.', error: error.message });
    }
  },

  // Obtener horarios por profesor
  async getByProfessor(req, res) {
    try {
      const { id } = req.params; // ID del profesor
      const horarios = await Horario.findByProfessor(id);

      res.status(200).json({ horarios });
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      res.status(500).json({ message: 'Error al obtener horarios.', error: error.message });
    }
  },

  // Actualizar un horario
  async update(req, res) {
    try {
      const { id_horario } = req.params;
      const { dia, hora_inicio, hora_fin } = req.body;

      const updatedHorario = await Horario.update(id_horario, {
        dia,
        hora_inicio,
        hora_fin,
      });

      res.status(200).json({ message: 'Horario actualizado con éxito.', horario: updatedHorario });
    } catch (error) {
      console.error('Error al actualizar horario:', error);
      res.status(500).json({ message: 'Error al actualizar horario.', error: error.message });
    }
  },

  // Eliminar un horario
  async delete(req, res) {
    try {
      const { id_horario } = req.params;

      await Horario.delete(id_horario);

      res.status(200).json({ message: 'Horario eliminado con éxito.' });
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      res.status(500).json({ message: 'Error al eliminar horario.', error: error.message });
    }
  },
};

module.exports = horarioController;
