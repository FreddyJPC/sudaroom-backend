const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('Conexión a la base de datos exitosa.');
});

module.exports = pool;