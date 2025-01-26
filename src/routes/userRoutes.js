const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();


// Rutas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

// Rutas protegidas
router.get('/', verifyToken, requireRole('administrador'), userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserProfile);
router.put('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, requireRole('administrador'), userController.deleteUser);



module.exports = router;
