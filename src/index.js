require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Habilitación de CORS
const morgan = require('morgan'); // Middleware para logging

const app = express();

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Carga la URL de la base de datos desde el archivo .env
});

// Middleware para procesar JSON
app.use(express.json());

// Habilitar CORS (permitir solicitudes desde otros dominios)
app.use(cors());

// Middleware de logging (muestra detalles de cada solicitud en la consola)
app.use(morgan('dev'));

// Importar rutas
const userRoutes = require('./routes/userRoutes');          // Rutas de usuarios
const classRoutes = require('./routes/ClassRoutes');        // Rutas de clases
const adminRoutes = require('./routes/adminRoutes');        // Rutas de administrador
const profesorRoutes = require('./routes/profesorRoutes'); // Rutas de profesores
const solicitudRoutes = require('./routes/solicitudRoutes'); // ✅ Nueva ruta de solicitudes
const notificationRoutes = require('./routes/notificationRoutes');




// Middleware de manejo de rutas
app.use('/api/notificaciones', notificationRoutes);
app.use('/api/users', userRoutes);            // Rutas para usuarios
app.use('/api/clases', classRoutes);          // Rutas para clases
app.use('/api/admin', adminRoutes);           // Rutas para administrador
app.use('/api/profesores', profesorRoutes);   // Rutas para profesores
app.use('/api/solicitudes', solicitudRoutes); // ✅ Rutas para solicitudes de tutoría

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Bienvenido a SUDAROOM Backend!');
});

// Verificar conexión a la base de datos
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.stack);
  } else {
    console.log('Conexión exitosa a PostgreSQL');
    release(); // Libera el cliente después de la conexión exitosa
  }
});

// Middleware de manejo de errores (debe ir después de las rutas)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Puerto de la aplicación
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
