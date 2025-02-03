// routes/solicitudRoutes.js

const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const { verifyToken } = require('../middlewares/authMiddleware'); // ✅ Importar middleware

// Rutas protegidas con verifyToken
router.post('/', verifyToken, solicitudController.crearSolicitud);
router.put('/solicitudes/:id_solicitud/responder', verifyToken, solicitudController.responderSolicitud);

// Modificar esta línea para no duplicar "solicitudes"
router.get('/usuario/:id_usuario', verifyToken, solicitudController.obtenerSolicitudesPorUsuario);


module.exports = router;
