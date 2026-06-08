const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.static('public'));
app.use(express.json());

// RUTA PARA GUARDAR
app.post('/guardar', async (req, res) => {
  try {
    const ahora = new Date();
    await pool.query('INSERT INTO registros (fecha_hora) VALUES ($1)', [ahora]);
    res.json({ mensaje: "Guardado correctamente", fecha: ahora });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al guardar en base de datos");
  }
});

// RUTA PARA LEER EL HISTORIAL
app.get('/historial', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM registros ORDER BY fecha_hora DESC LIMIT 10');
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener datos");
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});