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
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);


// Importar rutas de profesores
const profesorRoutes = require('./routes/profesorRoutes'); // Nueva 
// Importar rutas
const userRoutes = require('./routes/userRoutes'); // Rutas de usuarios
const classRoutes = require('./routes/ClassRoutes'); // Rutas de clases
const adminRoutes = require('./routes/adminRoutes');

// Middleware de manejo de rutas
app.use('/api/users', userRoutes); // Rutas para usuarios
app.use('/api/clases', classRoutes); // Rutas para clases
app.use('/api/admin', adminRoutes);
app.use('/api/profesores', profesorRoutes); // Nueva ruta de profesores
// Middleware de manejo de rutas
app.use('/api/users', userRoutes); // Rutas para usuarios
app.use('/api/clases', classRoutes); // Rutas para clases
app.use('/api/admin', adminRoutes);

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
