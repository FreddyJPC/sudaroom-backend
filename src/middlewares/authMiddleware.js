const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token recibido:", token);

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);
    req.user = decoded; // Asigna el usuario correctamente
    next();
  } catch (error) {
    console.error("Error verificando token:", error);
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
};




// Middleware para verificar roles
const requireRole = (role) => (req, res, next) => {
  if (req.user.rol !== role) {
    return res.status(403).json({ message: "Acceso denegado." });
  }
  next(); // Continuar si el rol coincide
};


// Middleware adicional para autenticación
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }
  if (!req.user) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
  

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar datos del usuario al objeto req
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = { verifyToken, requireRole, authMiddleware };
