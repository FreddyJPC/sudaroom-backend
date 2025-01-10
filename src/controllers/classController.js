const Clase = require('../models/Clase');
const pool = require('../config/db');

const classController = {
  // Crear una clase
  async create(req, res) {
    try {
      const { titulo, descripcion, fecha_hora, duracion, capacidad_maxima, estado, carrera } = req.body;
      const id_profesor = req.user.id; // Obtenemos el id del profesor del token
  
      // Validar datos requeridos
      if (!titulo || !fecha_hora || !carrera) {
        return res.status(400).json({ message: 'El título, la fecha/hora y la carrera son obligatorios.' });
      }
  
      // Validar que la carrera esté en la lista permitida
      const carrerasPermitidas = [
        'Desarrollo de Software',
        'Diseño Gráfico',
        'Redes y Telecomunicaciones',
        'Electricidad',
        'Gastronomía',
        'Turismo',
        'Enfermería',
        'Marketing Digital',
        'Contabilidad y Asesoría Tributaria',
        'Educación',
        'Talento Humano',
      ];
      if (!carrerasPermitidas.includes(carrera)) {
        return res.status(400).json({ message: 'Carrera no válida.' });
      }
  
      const nuevaClase = await Clase.create({
        titulo,
        descripcion,
        fecha_hora,
        duracion,
        capacidad_maxima,
        estado,
        id_profesor,
        carrera,
      });
      res.status(201).json({ message: 'Clase creada exitosamente.', clase: nuevaClase });
    } catch (error) {
      console.error('Error al crear clase:', error);
      res.status(500).json({ message: 'Error al crear clase.', error: error.message });
    }
  },
  

  // Listar clases de un profesor
  async listByProfessor(req, res) {
    try {
      const id_profesor = req.user.id; // Obtenemos el id del profesor del token
      const clases = await Clase.findByProfessor(id_profesor);
      res.status(200).json({ clases });
    } catch (error) {
      console.error('Error al obtener clases:', error);
      res.status(500).json({ message: 'Error al obtener clases.', error: error.message });
    }
  },

  // Editar una clase
  async update(req, res) {
    try {
      const { id_clase } = req.params;
      const { titulo, descripcion, fecha_hora, duracion, capacidad_maxima, estado } = req.body;

      const claseActualizada = await Clase.update(id_clase, { titulo, descripcion, fecha_hora, duracion, capacidad_maxima, estado });
      res.status(200).json({ message: 'Clase actualizada exitosamente.', clase: claseActualizada });
    } catch (error) {
      console.error('Error al actualizar clase:', error);
      res.status(500).json({ message: 'Error al actualizar clase.', error: error.message });
    }
  },

  // Eliminar una clase
  async delete(req, res) {
    try {
      const { id_clase } = req.params;

      const claseEliminada = await Clase.delete(id_clase);
      res.status(200).json({ message: 'Clase eliminada exitosamente.', clase: claseEliminada });
    } catch (error) {
      console.error('Error al eliminar clase:', error);
      res.status(500).json({ message: 'Error al eliminar clase.', error: error.message });
    }
  },

    // Listar todas las clases disponibles
    async listAvailable(req, res) {
      try {
        const { carrera } = req.query; // Recibe el filtro opcional de carrera
    
        let query = `
          SELECT c.id_clase, c.titulo, c.descripcion, c.fecha_hora, c.duracion, c.capacidad_maxima, c.estado, c.carrera, p.nombre AS profesor
          FROM clases c
          JOIN usuarios p ON c.id_profesor = p.id_usuario
          WHERE c.estado = 'disponible'
        `;
    
        const queryParams = [];
    
        // Si se filtra por carrera
        if (carrera && carrera !== 'Todos') {
          query += ' AND c.carrera = $1';
          queryParams.push(carrera);
        }
    
        query += ' ORDER BY c.fecha_hora ASC';
    
        const clases = await pool.query(query, queryParams);
    
        res.status(200).json({ clases: clases.rows });
      } catch (error) {
        console.error('Error al listar clases disponibles:', error);
        res.status(500).json({ message: 'Error al listar clases disponibles.', error: error.message });
      }
    },
    
  
    // Obtener detalles de una clase específica
    async getDetails(req, res) {
      try {
        const { id_clase } = req.params;
  
        const claseResult = await pool.query(`
          SELECT c.id_clase, c.titulo, c.descripcion, c.fecha_hora, c.duracion, c.capacidad_maxima, c.estado, 
                 p.nombre AS profesor, COUNT(r.id_reserva) AS reservas
          FROM clases c
          JOIN usuarios p ON c.id_profesor = p.id
          LEFT JOIN reservas r ON c.id_clase = r.id_clase
          WHERE c.id_clase = $1
          GROUP BY c.id_clase, p.nombre
        `, [id_clase]);
  
        if (claseResult.rowCount === 0) {
          return res.status(404).json({ message: 'Clase no encontrada.' });
        }
  
        res.status(200).json({ clase: claseResult.rows[0] });
      } catch (error) {
        console.error('Error al obtener detalles de la clase:', error);
        res.status(500).json({ message: 'Error al obtener detalles de la clase.', error: error.message });
      }
    },
  

  // Reservar una clase
  async reservarClase(req, res) {
    try {
      const { id_clase } = req.body;
      const id_estudiante = req.user.id;

      // Verificar si la clase existe
      const claseResult = await pool.query('SELECT * FROM clases WHERE id_clase = $1', [id_clase]);
      if (claseResult.rowCount === 0) {
        return res.status(404).json({ message: 'Clase no encontrada.' });
      }
      const claseReservada = claseResult.rows[0];

      // Verificar si ya reservó una clase en ese horario
      const conflictoHorario = await pool.query(
        `SELECT r.id_reserva
         FROM reservas r
         JOIN clases c ON r.id_clase = c.id_clase
         WHERE r.id_estudiante = $1 AND c.fecha_hora <= $2 AND (c.fecha_hora + INTERVAL '1 hour' * c.duracion) > $2`,
        [id_estudiante, claseReservada.fecha_hora]
      );
      if (conflictoHorario.rowCount > 0) {
        return res.status(400).json({ message: 'Ya tienes una clase reservada en este horario.' });
      }

      // Crear la reserva
      const nuevaReserva = await pool.query(
        `INSERT INTO reservas (id_clase, id_estudiante) VALUES ($1, $2) RETURNING *`,
        [id_clase, id_estudiante]
      );

      res.status(201).json({
        message: 'Clase reservada con éxito.',
        reserva: nuevaReserva.rows[0],
      });
    } catch (error) {
      console.error('Error al reservar la clase:', error);
      res.status(500).json({ message: 'Error al reservar la clase.', error: error.message });
    }
  },
};

module.exports = classController;
