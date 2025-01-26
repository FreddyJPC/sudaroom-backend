const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// Usar para guardar tokens temporalmente (reemplazar con Redis en producción)
const tokens = {}; 

const userController = {
  async register(req, res) {
    try {
      console.log("Solicitud recibida en /register:", req.body);

      const { nombre, correo, contraseña, rol, carrera } = req.body;

      // Validación básica de entradas
      if (!nombre || !correo || !contraseña || !rol) {
        console.warn("Campos obligatorios faltantes en /register:", req.body);
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Validar si el correo ya existe
      const usuarioExistente = await User.findByEmail(correo);
      if (usuarioExistente) {
        console.warn(`Intento de registro con correo ya registrado: ${correo}`);
        return res.status(409).json({ message: "El correo ya está registrado." });
      }

      const hashedPassword = await bcrypt.hash(contraseña, 10);
      console.log("Contraseña encriptada correctamente.");

      const newUser = await User.create({
        nombre,
        correo,
        password: hashedPassword,
        rol,
        carrera,
      });

      console.log("Usuario creado exitosamente:", newUser);

      res.status(201).json({ message: "Usuario creado con éxito.", usuario: newUser });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      res.status(500).json({ message: "Error al registrar usuario.", error: error.message });
    }
  },

  async login(req, res) {
    try {
      console.log("Solicitud de inicio de sesión recibida:", req.body);

      const { correo, contraseña } = req.body;

      if (!correo || !contraseña) {
        console.warn("Campos obligatorios faltantes en /login:", req.body);
        return res.status(400).json({ message: "Correo y contraseña son obligatorios." });
      }

      const user = await User.findByEmail(correo);
      if (!user) {
        console.warn(`Inicio de sesión fallido: usuario no encontrado (${correo})`);
        return res.status(404).json({ message: "Usuario no encontrado." });
      }

      const isPasswordValid = await bcrypt.compare(contraseña, user.password);
      if (!isPasswordValid) {
        console.warn(`Inicio de sesión fallido: contraseña incorrecta (${correo})`);
        return res.status(401).json({ message: "Contraseña incorrecta." });
      }

      const token = jwt.sign(
        { id: user.id_usuario, correo: user.correo, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      console.log("Inicio de sesión exitoso. Token generado:", token);

      res.status(200).json({ message: "Inicio de sesión exitoso.", token });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ message: "Error al iniciar sesión.", error: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      console.log("Solicitud para obtener usuarios recibida:", req.query);

      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const users = await User.getAll(Number(limit), Number(offset));
      console.log(`Usuarios obtenidos exitosamente (Página ${page}):`, users);

      res.status(200).json(users);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({ message: "Error al obtener usuarios.", error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      console.log("Solicitud para eliminar usuario recibida:", req.params);

      const { id } = req.params;
      const deletedUser = await User.delete(id);

      if (!deletedUser) {
        console.warn(`Usuario no encontrado para eliminación: ID ${id}`);
        return res.status(404).json({ message: "Usuario no encontrado." });
      }

      console.log("Usuario eliminado exitosamente:", deletedUser);
      res.status(200).json({ message: "Usuario eliminado con éxito." });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ message: "Error al eliminar usuario.", error: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      console.log("Solicitud para actualizar usuario recibida:", req.params, req.body);

      const { id } = req.params;
      const { nombre, correo } = req.body;

      if (!nombre && !correo) {
        console.warn(`Actualización inválida para usuario ID ${id}: Campos vacíos.`);
        return res.status(400).json({ message: "Debes proporcionar un nombre o correo para actualizar." });
      }

      const updatedUser = await User.update(id, { nombre, correo });

      if (!updatedUser) {
        console.warn(`Usuario no encontrado para actualización: ID ${id}`);
        return res.status(404).json({ message: "Usuario no encontrado." });
      }

      console.log("Usuario actualizado exitosamente:", updatedUser);
      res.status(200).json({ message: "Usuario actualizado con éxito.", usuario: updatedUser });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      res.status(500).json({ message: "Error al actualizar usuario.", error: error.message });
    }
  },


    // Recuperación de contraseña
    async forgotPassword(req, res) {
      try {
        console.log("Solicitud de recuperación de contraseña recibida:", req.body);
  
        const { correo } = req.body;
  
        if (!correo) {
          console.warn("Correo no proporcionado en forgotPassword.");
          return res.status(400).json({ message: "El correo es obligatorio." });
        }
  
        const user = await User.findByEmail(correo);
        if (!user) {
          console.warn(`Intento de recuperación con correo inexistente: ${correo}`);
          return res.status(404).json({ message: "Usuario no encontrado." });
        }
  
        const resetToken = crypto.randomBytes(32).toString("hex");
        tokens[correo] = resetToken;
  
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
  
        const resetUrl = `http://localhost:5000/api/users/reset-password/${resetToken}`;
  
        console.log(`Enviando correo de recuperación a ${correo}...`);
        await transporter.sendMail({
          to: correo,
          subject: "Recuperación de contraseña",
          html: `
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
            <a href="${resetUrl}">${resetUrl}</a>
          `,
        });
  
        console.log("Correo de recuperación enviado exitosamente.");
        res.status(200).json({ message: "Correo de recuperación enviado con éxito." });
      } catch (error) {
        console.error("Error en forgotPassword:", error);
        res.status(500).json({ message: "Error al procesar la solicitud.", error: error.message });
      }
    },
  
    // Restablecer contraseña
    async resetPassword(req, res) {
      try {
        console.log("Solicitud para restablecer contraseña recibida:", req.params, req.body);
  
        const { token } = req.params;
        const { nuevaContraseña } = req.body;
  
        if (!nuevaContraseña) {
          console.warn("Contraseña nueva no proporcionada en resetPassword.");
          return res.status(400).json({ message: "La nueva contraseña es obligatoria." });
        }
  
        const correo = Object.keys(tokens).find((email) => tokens[email] === token);
        if (!correo) {
          console.warn("Token inválido o expirado:", token);
          return res.status(400).json({ message: "Token inválido o expirado." });
        }
  
        const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
        console.log(`Actualizando contraseña para el correo: ${correo}`);
  
        await User.updatePassword(correo, hashedPassword);
  
        delete tokens[correo]; // Elimina el token usado para evitar reutilización
  
        console.log("Contraseña actualizada exitosamente.");
        res.status(200).json({ message: "Contraseña actualizada con éxito." });
      } catch (error) {
        console.error("Error en resetPassword:", error);
        res.status(500).json({ message: "Error al restablecer la contraseña.", error: error.message });
      }
    },
  
    // Obtener perfil de usuario
    async getUserProfile(req, res) {
      try {
        console.log("Solicitud para obtener perfil recibida:", req.params);
  
        const { id } = req.params;
  
        if (!id) {
          console.warn("ID no proporcionado en getUserProfile.");
          return res.status(400).json({ message: "El ID del usuario es obligatorio." });
        }
  
        const user = await User.getById(id);
        if (!user) {
          console.warn(`Usuario no encontrado con ID: ${id}`);
          return res.status(404).json({ message: "Usuario no encontrado." });
        }
  
        console.log(`Usuario encontrado: ${user.nombre}`);
  
        if (user.rol === "profesor") {
          console.log(`Buscando horarios para el usuario (profesor): ${id}`);
          const horarios = await User.getHorariosById(id);
          return res.status(200).json({ ...user, horarios });
        }
  
        res.status(200).json(user);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
        res.status(500).json({ message: "Error al obtener el perfil del usuario.", error: error.message });
      }
    },

};

module.exports = userController;
