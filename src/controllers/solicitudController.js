const Solicitud = require('../models/Solicitud.js');
const notificationModel = require('../models/notificationModel.js'); // Asegúrate de que la ruta sea correcta

// Crear una nueva solicitud
exports.crearSolicitud = async (req, res) => {
  try {
    const { id_profesor, mensaje, fecha_solicitada, duracion, tema } = req.body;
    const id_estudiante = req.user.id; // ID del estudiante autenticado

    // Verificar que el rol del usuario sea 'estudiante'
    if (req.user.rol !== 'estudiante') {
      return res.status(403).json({ message: "Solo los estudiantes pueden crear solicitudes." });
    }

    // Crear la solicitud
    const solicitud = await Solicitud.crearSolicitud({
      id_estudiante,
      id_profesor,
      mensaje,
      fecha_solicitada,
      duracion,
      tema
    });

    // Crear la notificación
    const notificationMessage = `Tienes una nueva solicitud de clase personalizada de un estudiante. Tema: ${tema}`;
    await notificationModel.createNotification(id_profesor, notificationMessage, 'solicitud');

    // Responder con la solicitud creada
    res.status(201).json({ success: true, data: solicitud });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Responder a una solicitud (aceptar o rechazar)
exports.responderSolicitud = async (req, res) => {
  try {
    const { id_solicitud } = req.params;
    const { estado, motivo_rechazo } = req.body;

    // Actualizar la solicitud
    const solicitud = await Solicitud.responderSolicitud(id_solicitud, estado, motivo_rechazo);

    // Crear el mensaje de notificación
    const notificationMessage =
      estado === 'aceptada'
        ? `Tu solicitud para la clase de ${solicitud.tema} ha sido aceptada.`
        : `Tu solicitud para la clase de ${solicitud.tema} ha sido rechazada.${motivo_rechazo ? ' Motivo: ' + motivo_rechazo : ''}`;

    // Crear la notificación para el estudiante
    await notificationModel.createNotification(solicitud.id_estudiante, notificationMessage, 'solicitud');

    // Responder con la solicitud actualizada
    res.status(200).json({ success: true, data: solicitud });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener solicitudes por usuario
exports.obtenerSolicitudesPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const solicitudes = await Solicitud.obtenerSolicitudesPorUsuario(id_usuario, req.user.rol);
    res.status(200).json({ success: true, data: solicitudes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};