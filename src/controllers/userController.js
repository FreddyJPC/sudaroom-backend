const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Para manejar el token JWT
const crypto = require('crypto'); // Para generar el token único
const nodemailer = require('nodemailer'); // Para enviar correos electrónicos
const User = require('../models/User');

const tokens = {}; // Guardar tokens temporalmente en memoria (podrías usar Redis en producción)

const userController = {

  async register(req, res) { 
    try {
      console.log('Datos recibidos en el cuerpo de la solicitud:', req.body);
      const { nombre, correo, contraseña, rol, carrera } = req.body;

      if (!nombre || !correo || !contraseña || !rol) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
      }
      
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      
      const newUser = await User.create({
        nombre,
        correo,
        password: hashedPassword,
        rol,
        carrera, // Asegúrate de enviar este campo
      });
      
      res.status(201).json({ message: 'Usuario creado con éxito.', usuario: newUser });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ message: 'Error al registrar usuario.', error: error.message });
    }
  },
  
  

  async login(req, res) {
    try {
      const { correo, contraseña } = req.body;

      if (!correo || !contraseña) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
      }

      const user = await User.findByEmail(correo);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      const isPasswordValid = await bcrypt.compare(contraseña, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta.' });
      }

      const token = jwt.sign(
        { id: user.id_usuario, correo: user.correo, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );
      
      console.log('Token generado:', token); // Verifica que el rol está presente en el token
      

      res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error al iniciar sesión.', error: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const users = await User.getAll(Number(limit), Number(offset));
      res.status(200).json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios.', error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const deletedUser = await User.delete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      res.status(200).json({ message: 'Usuario eliminado con éxito.' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ message: 'Error al eliminar usuario.', error: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { nombre, correo } = req.body;

      if (!nombre && !correo) {
        return res.status(400).json({ message: 'Debes proporcionar un nombre o correo para actualizar.' });
      }

      const updatedUser = await User.update(id, { nombre, correo });

      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      res.status(200).json({ message: 'Usuario actualizado con éxito.', usuario: updatedUser });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error al actualizar usuario.', error: error.message });
    }
  },

  // Recuperación de contraseña
  async forgotPassword(req, res) {
    try {
      const { correo } = req.body;

      const user = await User.findByEmail(correo);
      if (!user) {
        return res.status(404).json({ message: 'No se encontró un usuario con ese correo.' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      tokens[correo] = resetToken;

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const resetUrl = `http://localhost:5000/api/users/reset-password/${resetToken}`;

      await transporter.sendMail({
        to: correo,
        subject: 'Recuperación de contraseña',
        html: `<p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
               <a href="${resetUrl}">${resetUrl}</a>`,
      });

      res.status(200).json({ message: 'Correo de recuperación enviado con éxito.' });
    } catch (error) {
      console.error('Error en forgotPassword:', error);
      res.status(500).json({ message: 'Error al procesar la solicitud.', error: error.message });
    }
  },

  // Restablecer contraseña
  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { nuevaContraseña } = req.body;

      const correo = Object.keys(tokens).find((email) => tokens[email] === token);
      if (!correo) {
        return res.status(400).json({ message: 'Token inválido o expirado.' });
      }

      const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
      await User.updatePassword(correo, hashedPassword);

      delete tokens[correo];

      res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
    } catch (error) {
      console.error('Error en resetPassword:', error);
      res.status(500).json({ message: 'Error al restablecer la contraseña.', error: error.message });
    }
  },
};


module.exports = userController;
